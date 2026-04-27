/**
 * 07_PlaceService.gs
 * บริหารจัดการข้อมูลสถานที่
 */

function resolvePlace(sourceObj) {
  const addr1 = sourceObj.addressRaw;
  const addr2 = sourceObj.addressFromLatLong;
  
  if (!addr1 && !addr2) return { id: null, isNew: false, score: 0, candidates: [] };
  
  // 1. ค้นหาจากที่อยู่หลัก (ที่อยู่ปลายทาง)
  let res1 = findBestMatch(addr1);
  
  // 2. ถ้าที่อยู่หลักคะแนนไม่สูงพอ ลองค้นหาจากที่อยู่ที่สกัดจาก LatLong
  let res2 = { score: 0 };
  if (addr2 && res1.score < 90) {
    res2 = findBestMatch(addr2);
  }
  
  // 3. เลือกผลลัพธ์ที่ดีที่สุด
  let finalMatch = res1.score >= res2.score ? res1 : res2;
  
  const threshold = getThresholds().autoMatchScore;
  const reviewMin = getThresholds().reviewScoreMin;
  
  if (finalMatch.score >= threshold) {
    return { ...finalMatch, isNew: false };
  } else if (finalMatch.score >= reviewMin) {
    // คะแนนก้ำกึ่ง ส่งเข้า Review
    return { ...finalMatch, id: null, isNew: false };
  } else {
    // คะแนนต่ำเกินไป ถือว่าเป็นที่ใหม่
    // เลือกที่อยู่ที่ "ยาวและสมบูรณ์กว่า" มาเป็นชื่อหลักสำหรับสร้างใหม่
    const betterRaw = (addr2 && addr2.length > (addr1 ? addr1.length : 0)) ? addr2 : addr1;
    return { ...finalMatch, id: null, isNew: true, raw: betterRaw };
  }
}

/**
 * ฟังก์ชันช่วยค้นหา Candidate ที่ดีที่สุดจากที่อยู่ใดๆ
 */
function findBestMatch(rawAddress) {
  if (!rawAddress) return { id: null, score: 0, candidates: [] };
  const norm = normalizePlaceName(rawAddress);
  const candidates = findPlaceCandidates(norm);
  
  let bestCandidate = null;
  let bestScore = 0;
  
  for (let i = 0; i < candidates.length; i++) {
    const score = scorePlaceCandidate(norm, candidates[i].normalized);
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = candidates[i];
    }
  }
  
  return {
    id: bestCandidate ? bestCandidate.placeId : null,
    score: bestScore,
    normalized: norm,
    raw: rawAddress,
    candidates: candidates
  };
}

function findPlaceCandidates(normPlace) {
  if (!normPlace) return [];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const aliases = [];
  const aliasSheet = ss.getSheetByName('M_PLACE_ALIAS');
  const aliasData = aliasSheet.getDataRange().getValues();
  
  for (let i = 1; i < aliasData.length; i++) {
    if (aliasData[i][3] === normPlace || aliasData[i][3].indexOf(normPlace) > -1 || normPlace.indexOf(aliasData[i][3]) > -1) {
      aliases.push({
        placeId: aliasData[i][1],
        normalized: aliasData[i][3],
        type: 'ALIAS'
      });
    }
  }
  
  return aliases;
}

function scorePlaceCandidate(inputNorm, candidateNorm) {
  if (inputNorm === candidateNorm) return 100;
  
  const dice = diceCoefficient(inputNorm, candidateNorm);
  const ratio = lengthRatio(inputNorm, candidateNorm);
  
  // คะแนนรวม: (ความเหมือนตัวอักษร 80%) + (สัดส่วนความยาว 20%)
  const finalScore = Math.round(((dice * 0.8) + (ratio * 0.2)) * 100);
  
  return finalScore > 60 ? finalScore : 0;
}

function createPlace(canonicalPlaceName, addressRaw, geoAddr) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_PLACE');
  const placeId = 'PLA-' + uuid().split('-')[0].toUpperCase();
  
  // รวมร่างที่อยู่ให้สมบูรณ์ที่สุด
  const mergedAddress = smartMergeAddress(addressRaw, geoAddr);
  const normPlace = normalizePlaceName(mergedAddress);
  
  sheet.appendRow([
    placeId,
    mergedAddress, // ใช้ที่อยู่ที่ผสมแล้วเป็นชื่อทางการ
    normPlace,
    addressRaw, // เก็บที่อยู่ดิบไว้เป็นประวัติ (M_PLACE Column D คือ address_best -> ตอนนี้เป็น mergedAddress แทน?)
    normalizeAddress(mergedAddress),
    '', // warehouse
    new Date(),
    new Date(),
    1,
    'ACTIVE',
    ''
  ]);
  
  createPlaceAlias(placeId, mergedAddress, normPlace);
  // เก็บ Alias ของที่อยู่ดิบไว้ด้วยเพื่อให้ค้นหาเจอในครั้งหน้า
  if (addressRaw && addressRaw !== mergedAddress) {
    createPlaceAlias(placeId, addressRaw, normalizePlaceName(addressRaw));
  }
  
  return placeId;
}

function createPlaceAlias(placeId, aliasRaw, aliasNormalized) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_PLACE_ALIAS');
  
  sheet.appendRow([
    'L_AL-' + uuid().split('-')[0].toUpperCase(),
    placeId,
    aliasRaw,
    aliasNormalized,
    'SYSTEM',
    new Date(),
    new Date(),
    1,
    'Y'
  ]);
}
