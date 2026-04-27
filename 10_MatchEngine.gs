/**
 * 10_MatchEngine.gs
 * สมองกลของระบบ ทำหน้าที่ประสานงานและตัดสินใจว่า Data ชุดนี้คืออะไร
 */

function matchAllEntities(sourceObj) {
  // 1. แยกแก้แต่ละเอนทิตี
  const personResult = resolvePerson(sourceObj);
  const placeResult = resolvePlace(sourceObj);
  const geoResult = resolveGeo(sourceObj);
  
  // 2. ถ้าเอนทิตีไหนมั่นใจว่าใหม่ (isNew = true) ก็ให้สิทธิ์ในการสร้างเลย
  let finalPersonId = personResult.id;
  let finalPlaceId = placeResult.id;
  let finalGeoId = geoResult.id;
  
  let autoCreatedCount = 0;
  
  // สร้าง Person ถ้าเป็นคนใหม่ชัวร์ (ไม่มี Candidate คล้ายเลย)
  if (personResult.isNew) {
    finalPersonId = createPerson(personResult.raw, personResult.normalized, personResult.phone);
    autoCreatedCount++;
  }
  
  // สร้าง Place ถ้าที่อยู่ใหม่ชัวร์
  if (placeResult.isNew) {
    finalPlaceId = createPlace(placeResult.raw, sourceObj.addressRaw, sourceObj.addressFromLatLong);
    autoCreatedCount++;
  }
  
  // สร้าง Geo ถ้าพิกัดห่างไกลจากจุดเดิมทั้งหมด
  if (geoResult.isNew) {
    finalGeoId = createGeoPoint(geoResult.lat, geoResult.lng, geoResult.keys, sourceObj.latLongText);
    autoCreatedCount++;
  }
  
  // 3. รวมคะแนน
  const bonusScore = evaluateThaiGeoBonus(sourceObj);
  const compositeScore = calculateCompositeScore(personResult.score, placeResult.score, geoResult.score, autoCreatedCount, bonusScore);
  
  // 4. สร้างหรือค้นหา Destination
  // (ถ้ายังขาด ID อันใดอันหนึ่ง แสดงว่าคะแนนไม่ถึงเกณฑ์ auto match และมันไม่ใช่ของใหม่ร้อยเปอร์เซ็นต์ -> รอ Review)
  let destResult = { id: null, isNew: false, key: '' };
  if (finalPersonId && finalPlaceId && finalGeoId) {
    destResult = resolveDestination(finalPersonId, finalPlaceId, finalGeoId, sourceObj);
  }
  
  return {
    person: { ...personResult, finalId: finalPersonId },
    place: { ...placeResult, finalId: finalPlaceId },
    geo: { ...geoResult, finalId: finalGeoId },
    dest: destResult,
    compositeScore: compositeScore
  };
}

function calculateCompositeScore(pScore, plScore, gScore, autoCreatedCount, bonusScore = 0) {
  // ถ้าเพิ่งถูกสร้างใหม่หมด แปลว่าเป็น Master ใหม่ชัวร์ ให้คะแนนเต็ม 100
  if (autoCreatedCount >= 3) return 100;
  
  // น้ำหนัก V4.4: Geo 45%, Person 30%, Place 25%
  let score = (pScore * 0.30) + (plScore * 0.25) + (gScore * 0.45);
  
  // บวกโบนัสความแม่นยำทางภูมิศาสตร์ (ถ้ามี)
  score += bonusScore;
  
  return Math.min(100, Math.round(score));
}

function decideAutoMatchOrReview(matchResult) {
  const thresholds = getThresholds();
  
  // ถ้ามีบาง entity ที่หาไม่เจอและไม่ถูกสิทธิ์สร้างใหม่
  if (!matchResult.person.finalId || !matchResult.place.finalId || !matchResult.geo.finalId) {
    return 'REVIEW';
  }
  
  // ถ้าคะแนนรวมผ่านเกณฑ์ หรือ มีการสร้างใหม่ร้อยเปอร์เซ็นต์ (คะแนนจะได้ 100)
  if (matchResult.compositeScore >= thresholds.autoMatchScore) {
    return 'AUTO_MATCH';
  }
  
  return 'REVIEW';
}

function buildReviewPayload(sourceObj, matchResult) {
  const cPersonIds = matchResult.person.candidates.map(c => c.personId || c.id).join(',');
  const cPlaceIds = matchResult.place.candidates.map(c => c.placeId || c.id).join(',');
  const cGeoIds = matchResult.geo.candidates.map(c => c.geoId || c.id).join(',');
  
  return {
    issueType: detectConflictType(matchResult),
    sourceRecordId: sourceObj.idScg,
    sourceRowNumber: sourceObj.rowNumber,
    invoiceNo: sourceObj.invoiceNo,
    rawPersonName: sourceObj.destinationNameRaw,
    rawPlaceName: sourceObj.addressRaw, // เก็บไว้แสดงผล (อาจจะยุบรวมในอนาคต)
    rawSystemAddress: sourceObj.addressRaw, // ที่อยู่จากระบบ
    rawGeoResolvedAddress: sourceObj.addressFromLatLong, // ที่อยู่จากพิกัด
    rawLat: sourceObj.latRaw,
    rawLong: sourceObj.longRaw,
    candidatePersonIds: cPersonIds,
    candidatePlaceIds: cPlaceIds,
    candidateGeoIds: cGeoIds,
    score: matchResult.compositeScore,
    recommendedAction: 'MANUAL_REVIEW',
    note: (analyzeGeoWarning(sourceObj.addressRaw) || '') + 
          '\n💡 ที่อยู่แนะนำ: ' + smartMergeAddress(sourceObj.addressRaw, sourceObj.addressFromLatLong)
  };
}

function detectConflictType(matchResult) {
  if (matchResult.geo.score >= 90 && matchResult.person.score < 50) return 'SAME_GEO_DIFF_PERSON'; // ปัญหา 8
  if (matchResult.person.score >= 90 && matchResult.geo.score < 50) return 'SAME_PERSON_DIFF_GEO'; // ปัญหา 7
  if (matchResult.person.score >= 90 && matchResult.place.score < 50) return 'SAME_PERSON_DIFF_PLACE'; // ปัญหา 6
  if (matchResult.place.score >= 90 && matchResult.person.score < 50) return 'SAME_PLACE_DIFF_PERSON'; // ปัญหา 5
  return 'AMBIGUOUS_DATA'; // ครุมเครือ
}

/**
 * คำนวณคะแนนโบนัสถ้าข้อมูลภูมิศาสตร์ในที่อยู่ดิบตรงกับพิกัดจริง
 */
function evaluateThaiGeoBonus(sourceObj) {
  let bonus = 0;
  const rawAddr = sourceObj.addressRaw || '';
  const geoAddr = sourceObj.addressFromLatLong || '';
  
  if (!rawAddr || !geoAddr) return 0;
  
  // ดึงตำบลจากที่อยู่ดิบ (รองรับ ต. หรือ ตำบล หรือ แขวง)
  const subMatch = rawAddr.match(/(?:ต\.|ตำบล|แขวง)\s*([ก-๙]+)/);
  if (subMatch) {
    const subName = subMatch[1];
    // ถ้าพิกัดที่ได้จาก Google (geoAddr) มีชื่อตำบลตรงกับที่พิมพ์มา
    if (geoAddr.indexOf(subName) > -1) {
      bonus += 15; // โบนัสความแม่นยำ
    }
  }
  
  return bonus;
}
