/**
 * 06_PersonService.gs
 * บริหารจัดการข้อมูลบุคคล
 */

/**
 * ค้นหาชื่อคนและให้คะแนนว่าตรงกับ Master ตัวไหน
 */
function resolvePerson(sourceObj) {
  const rawName = sourceObj.destinationNameRaw;
  if (!rawName) return { id: null, isNew: false, score: 0, phone: '', candidates: [] };
  
  // สกัดเบอร์โทรศัพท์
  const phone = extractPhoneNumbers(rawName) || extractPhoneNumbers(sourceObj.addressRaw);
  
  const normName = normalizePersonName(rawName);
  const candidates = findPersonCandidates(normName, phone);
  
  // ไม่มีเลย แปลว่าใหม่ 100%
  if (candidates.length === 0) {
    return { id: null, isNew: true, score: 0, normalized: normName, raw: rawName, phone: phone, candidates: [] };
  }
  
  // ถ้ามี Candidate ให้หาตัวที่คะแนนสูงสุด
  let bestCandidate = null;
  let bestScore = 0;
  
  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    const score = scorePersonCandidate(normName, c.normalized);
    if (score > bestScore) {
      bestScore = score;
      bestCandidate = c;
    }
  }
  
  // ถ้าเกิน Threshold (เช่น >= 90) ถือว่าชัวร์
  const threshold = getThresholds().autoMatchScore;
  const reviewMin = getThresholds().reviewScoreMin;
  
  if (bestScore >= threshold) {
    return { id: bestCandidate.personId, isNew: false, score: bestScore, normalized: normName, raw: rawName, phone: phone, candidates: candidates };
  } else if (bestScore >= reviewMin) {
    // ถ้าก้ำกึ่ง (เช่น 75-89) ให้ส่งเข้า Review
    return { id: null, isNew: false, score: bestScore, normalized: normName, raw: rawName, phone: phone, candidates: candidates };
  } else {
    // ถ้าคะแนนต่ำเกินไป (เช่น < 75) ถือว่าเป็นคนใหม่เลย ไม่ต้อง Review
    return { id: null, isNew: true, score: bestScore, normalized: normName, raw: rawName, phone: phone, candidates: candidates };
  }
}

/**
 * ค้นหา Candidate จาก M_PERSON และ M_PERSON_ALIAS
 */
function findPersonCandidates(normName, phone) {
  if (!normName && !phone) return [];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aliases = [];
  
  const mSheet = ss.getSheetByName('M_PERSON');
  const mData = mSheet.getDataRange().getValues();

  // 1. ลองค้นหาด้วยเบอร์โทรศัพท์ก่อน (Confidence สูงสุด)
  if (phone) {
    const searchPhones = phone.split(', ');
    for (let i = 1; i < mData.length; i++) {
      let storedPhone = mData[i][3]; // Column D
      if (storedPhone) {
        storedPhone = String(storedPhone); // ป้องกัน Error ถ้าข้อมูลไม่ใช่ String (เช่น เป็นวันที่)
        for (let p of searchPhones) {
          if (storedPhone.indexOf(p) > -1) {
            aliases.push({
              personId: mData[i][0],
              normalized: mData[i][2],
              type: 'PHONE_MATCH'
            });
          }
        }
      }
    }
    if (aliases.length > 0) return aliases; // ถ้าเจอด้วยเบอร์แล้ว ถือว่าจบเลย
  }

  // 2. หาแบบ Exact Match ใน Alias
  const aliasSheet = ss.getSheetByName('M_PERSON_ALIAS');
  const aliasData = aliasSheet.getDataRange().getValues();
  
  for (let i = 1; i < aliasData.length; i++) {
    if (aliasData[i][3] === normName || aliasData[i][3].indexOf(normName) > -1 || normName.indexOf(aliasData[i][3]) > -1) {
      aliases.push({
        personId: aliasData[i][1],
        normalized: aliasData[i][3],
        type: 'ALIAS'
      });
    }
  }
  
  // 3. ถ้าไม่เจอใน Alias ลองหาใน Master ตรงๆ
  if (aliases.length === 0) {
    for (let i = 1; i < mData.length; i++) {
      if (mData[i][2] === normName) {
        aliases.push({
          personId: mData[i][0],
          normalized: mData[i][2],
          type: 'MASTER'
        });
      }
    }
  }
  
  return aliases;
}

/**
 * ให้คะแนนความเหมือนของ String สองตัว
 */
function scorePersonCandidate(inputNorm, candidateNorm) {
  if (inputNorm === candidateNorm) return 100;
  
  const dice = diceCoefficient(inputNorm, candidateNorm);
  const ratio = lengthRatio(inputNorm, candidateNorm);
  
  // คำนวณคะแนนรวม: (ความเหมือนตัวอักษร 80%) + (สัดส่วนความยาว 20%)
  const finalScore = Math.round(((dice * 0.8) + (ratio * 0.2)) * 100);
  
  // ถ้าสั้นเกินไปหรือต่างกันเกินไป ให้ 0 เพื่อเข้า Review
  return finalScore > 60 ? finalScore : 0;
}

function createPerson(canonicalName, normName, phone) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_PERSON');
  const personId = 'PER-' + uuid().split('-')[0].toUpperCase(); 
  
  sheet.appendRow([
    personId,
    canonicalName,
    normName,
    phone ? "'" + phone : '', // ใส่ ' นำหน้าเพื่อป้องกันเลข 0 หายใน Sheets
    new Date(),
    new Date(),
    1,
    'ACTIVE',
    ''
  ]);
  
  // สร้าง Alias อัตโนมัติให้ตัวเอง
  createPersonAlias(personId, canonicalName, normName);
  
  return personId;
}

function createPersonAlias(personId, aliasRaw, aliasNormalized) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_PERSON_ALIAS');
  
  sheet.appendRow([
    'P_AL-' + uuid().split('-')[0].toUpperCase(),
    personId,
    aliasRaw,
    aliasNormalized,
    'SYSTEM',
    new Date(),
    new Date(),
    1,
    'Y'
  ]);
}

function updatePersonStats(personId) {
  // สำหรับการใช้งานจริง ควรใช้วิธีรวบยอดอัปเดตเพื่อไม่ให้ช้า
}
