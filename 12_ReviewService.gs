/**
 * 12_ReviewService.gs
 * ระบบจัดการคิวงานที่ต้องใช้ "คน" เข้ามาตัดสินใจ (Human-in-the-loop)
 */

function enqueueReview(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Q_REVIEW');
  const reviewId = 'REV-' + uuid().split('-')[0].toUpperCase();
  
  sheet.appendRow([
    reviewId,
    payload.issueType,
    payload.sourceRecordId,
    payload.sourceRowNumber,
    payload.invoiceNo,
    payload.rawPersonName,
    payload.rawPlaceName,
    payload.rawSystemAddress,      // เพิ่มที่อยู่ดิบจากระบบ
    payload.rawGeoResolvedAddress, // เพิ่มที่อยู่ที่แปลงจาก LatLong
    payload.rawLat,
    payload.rawLong,
    payload.candidatePersonIds,
    payload.candidatePlaceIds,
    payload.candidateGeoIds,
    '', // candidate_destination_ids
    payload.score,
    payload.recommendedAction,
    'PENDING', // status
    '', // reviewer
    '', // reviewed_at
    '', // decision
    payload.note || ''  // note
  ]);
  
  return reviewId;
}

/**
 * สร้าง Dropdown (Data Validation) สำหรับคอลัมน์ decision ในชีต Q_REVIEW
 */
function setupReviewDropdown() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Q_REVIEW');
  if (!sheet) return;
  
  // สร้างกฎ Data Validation 3 ตัวเลือก
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['CREATE_NEW', 'MERGE_TO_CANDIDATE', 'IGNORE'], true)
    .setAllowInvalid(false)
    .build();
    
  // นำไปใส่ในคอลัมน์ U (คอลัมน์ที่ 21) ตั้งแต่แถวที่ 2 ลงไป
  const lastRow = Math.max(sheet.getMaxRows(), 100);
  sheet.getRange(2, 21, lastRow - 1, 1).setDataValidation(rule);
}

/**
 * ผู้ดูแลระบบ (Admin) สามารถเขียน Script หรือสร้าง UI เพื่อดึง Pending Reviews ไปจัดการได้
 */
function getPendingReviews() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Q_REVIEW');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const pending = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][15] === 'PENDING') { // status column
      let item = {};
      headers.forEach((h, idx) => item[h] = data[i][idx]);
      item.rowIndex = i + 1;
      pending.push(item);
    }
  }
  
  return pending;
}

/**
 * ฟังก์ชันสำหรับ Admin เพื่อกดปิด Review
 * decision สามารถเป็น: CREATE_NEW, MERGE_TO_CANDIDATE_1, IGNORE
 */
function applyReviewDecision(reviewId, decision, selectedPersonId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Q_REVIEW');
  const data = sheet.getDataRange().getValues();
  
  let rowIndex = -1;
  let reviewRow = null;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === reviewId) {
      rowIndex = i + 1;
      reviewRow = data[i];
      break;
    }
  }
  
  if (rowIndex === -1) throw new Error("ไม่พบ Review ID นี้");
  
  // อัปเดตสถานะใน Q_REVIEW (V4.4 Schema)
  sheet.getRange(rowIndex, 18).setValue('RESOLVED'); // status
  sheet.getRange(rowIndex, 19).setValue(Session.getActiveUser().getEmail()); // reviewer
  sheet.getRange(rowIndex, 20).setValue(new Date()); // reviewed_at
  sheet.getRange(rowIndex, 21).setValue(decision); // decision
  
  // ถ้าแอดมินเลือก MERGE_TO_CANDIDATE
  if (decision === 'MERGE_TO_CANDIDATE') {
    const rawName = reviewRow[5]; // raw_person_name (Index 5)
    const candidatePersonIdsStr = reviewRow[11]; // candidate_person_ids (Index 11)
    
    // ดึงไอดีแรกมาใช้ (สมมติฐานเบื้องต้น)
    if (candidatePersonIdsStr) {
      const candidateIds = String(candidatePersonIdsStr).split(',');
      const selectedId = candidateIds[0].trim();
      if (selectedId) {
        createPersonAlias(selectedId, rawName, normalizePersonName(rawName));
      }
    }
  }

  // หลังจากตัดสินใจแล้ว ให้นำข้อมูลกลับไปเตรียมรันใหม่
  if (decision !== 'IGNORE') {
    const sourceRowIdx = reviewRow[3];
    updateSourceSyncStatus(sourceRowIdx, 'WAIT_REPROCESS');
  } else {
    // ถ้า IGNORE คือข้ามไปเลย เปลี่ยนเป็น IGNORE ในชีตต้นทาง
    const sourceRowIdx = reviewRow[3];
    updateSourceSyncStatus(sourceRowIdx, 'IGNORE');
  }
}
