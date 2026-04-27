/**
 * 00_App.gs
 * Entry point ของระบบ LMDS (Logistics Master Data System)
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📦 LMDS System')
    .addItem('1. ติดตั้งระบบครั้งแรก (Setup)', 'runInitialSetup')
    .addSeparator()
    .addItem('2. ประมวลผลข้อมูลประจำวัน', 'runDailyProcess')
    .addItem('3. อัปเดตพจนานุกรมสถานที่ (SYS_TH_GEO)', 'buildGeoIndex')
    .addItem('4. รีเซ็ตแถวที่เลือกเพื่อรันใหม่', 'reprocessSelectedRows')
    .addSeparator()
    .addItem('5. อัปเดตสถิติและ Report', 'runNightlyMaintenance')
    .addToUi();
}

function runInitialSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.toast('กำลังเริ่มสร้างชีตระบบและกำหนดค่าเริ่มต้น...', '⚙️ เริ่มต้นการติดตั้ง', 5);
  
  try {
    createSystemSheets(); 
    seedInitialConfig();  
    
    if (typeof setupReviewDropdown === 'function') {
      setupReviewDropdown();
    }
    
    ss.toast('ติดตั้งระบบและเตรียมความพร้อมเรียบร้อยแล้ว', '✅ สำเร็จ', 10);
  } catch (e) {
    ss.toast('เกิดข้อผิดพลาด: ' + e.message, '❌ ล้มเหลว', 15);
    writeLog('ERROR', '00_App', 'runInitialSetup', '', e.message, e.stack);
  }
}

/**
 * ประมวลผลข้อมูลประจำวัน
 */
/**
 * ประมวลผลข้อมูลประจำวัน (แอดมินกดรันเอง)
 */
function runDailyProcess() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const startTime = Date.now();
  const MAX_TIME_MS = 5 * 60 * 1000; // ปลอดภัยที่ 5 นาที (ก่อนถึงลิมิต 6 นาทีของ Google)

  try {
    validateSourceSchema(); 
    ensureSystemSheets();

    const rowsToProcess = getUnprocessedSourceRows();
    if (rowsToProcess.length === 0) {
      clearCheckpoint(); // ล้าง Checkpoint ถ้างานหมดแล้ว
      updateRunStatus('IDLE', 'ไม่มีข้อมูลใหม่ที่ต้องประมวลผล');
      ss.toast('ไม่มีข้อมูลใหม่ที่ต้องประมวลผล', 'ℹ️ ข้อมูลเป็นปัจจุบัน', 5);
      return;
    }

    const lastCheckpoint = getCheckpoint();
    let startIdx = 0;
    if (lastCheckpoint) {
      const resumeIdx = rowsToProcess.findIndex(r => r.sourceIndex === lastCheckpoint);
      if (resumeIdx !== -1) {
        startIdx = resumeIdx + 1;
        updateRunStatus('RESUMING', `กำลังรันต่อจากแถวที่ ${lastCheckpoint}...`);
      }
    } else {
      updateRunStatus('RUNNING', `เริ่มประมวลผล ${rowsToProcess.length} รายการ...`);
    }

    let successCount = 0;
    let reviewCount = 0;
    let errorCount = 0;

    for (let i = startIdx; i < rowsToProcess.length; i++) {
      // ตรวจสอบเวลา (Safety Watch) - ป้องกัน Error 6 นาทีของ Google
      if (isTimeNearLimit(startTime, MAX_TIME_MS)) {
        const lastRow = rowsToProcess[i - 1] ? rowsToProcess[i - 1].sourceIndex : (lastCheckpoint || 0);
        if (lastRow) saveCheckpoint(lastRow);
        
        updateRunStatus('PAUSED', `หยุดพักที่แถว ${lastRow} (ใกล้ครบ 6 นาที)`);
        showAutoCloseAlert(`<b>ใกล้ครบลิมิต 6 นาทีของ Google แล้วครับ</b><br>ระบบบันทึกงานถึงแถวที่ ${lastRow} เรียบร้อย<br><br><b>กรุณากดปุ่มรันใหม่อีกครั้งเพื่อทำงานต่อครับ</b>`, 15);
        return; // หยุดการทำงาน (แอดมินต้องกดรันใหม่เอง)
      }

      const rowItem = rowsToProcess[i];
      try {
        const sourceObj = mapRowToSourceObject(rowItem.rowData, rowItem.sourceIndex);
        const result = matchAllEntities(sourceObj);
        const decision = decideAutoMatchOrReview(result);
        
        if (decision === 'AUTO_MATCH') {
          const factRow = buildFactRow(sourceObj, result);
          upsertFactDelivery(factRow);
          markSourceRowProcessed(rowItem.sourceIndex, 'SUCCESS');
          successCount++;
        } else {
          const reviewPayload = buildReviewPayload(sourceObj, result);
          enqueueReview(reviewPayload);
          markSourceRowProcessed(rowItem.sourceIndex, 'REVIEW');
          reviewCount++;
        }

      } catch (e) {
        markSourceRowProcessed(rowItem.sourceIndex, 'ERROR');
        writeLog('ERROR', '00_App', 'runDailyProcess', `Row_${rowItem.sourceIndex}`, e.message, e.stack);
        errorCount++;
      }
    }

    // เมื่อประมวลผลเสร็จสิ้นทั้งหมด
    clearCheckpoint();
    refreshQualityReport();
    updateRunStatus('COMPLETED', `สำเร็จ: ${successCount} | รีวิว: ${reviewCount} | ผิดพลาด: ${errorCount}`);
    showAutoCloseAlert(`<b>ประมวลผลเสร็จสมบูรณ์!</b><br>สำเร็จ: ${successCount} รายการ<br>รอรีวิว: ${reviewCount} รายการ<br>ผิดพลาด: ${errorCount} รายการ`, 10);

  } catch (e) {
    ss.toast(e.message, '❌ ระบบขัดข้อง', 15);
    writeLog('CRITICAL', '00_App', 'runDailyProcess', '', e.message, e.stack);
  }
}

/**
 * รีเซ็ตแถวที่เลือกเพื่อรันใหม่
 */

function reprocessSelectedRows() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  
  if (sheet.getName() !== getConfig('SOURCE_SHEET_NAME')) {
    ss.toast('กรุณาไปที่ชีตต้นทางก่อนทำรายการนี้', '⚠️ ผิดชีต', 5);
    return;
  }
  
  const range = sheet.getActiveRange();
  const startRow = range.getRow();
  const numRows = range.getNumRows();
  
  if (startRow <= 1) {
    ss.toast('กรุณาเลือกเฉพาะข้อมูล ไม่รวมหัวตาราง', '⚠️ เลือกผิดส่วน', 5);
    return;
  }
  
  // รันทันที
  ss.toast(`กำลังล้างสถานะ ${numRows} แถว และเริ่มรันใหม่...`, '🔄 Reprocessing', 5);
  const colStatus = getSourceColumnMap()['SYNC_STATUS'];
  if (colStatus !== undefined) {
    sheet.getRange(startRow, colStatus + 1, numRows, 1).clearContent();
    runDailyProcess();
  }
}

function onEdit(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  
  if (sheet.getName() === 'Q_REVIEW' && e.range.getColumn() === 21) {
    const row = e.range.getRow();
    if (row <= 1) return;
    
    const decision = e.value;
    if (decision === 'CREATE_NEW' || decision === 'MERGE_TO_CANDIDATE' || decision === 'IGNORE') {
      const reviewId = sheet.getRange(row, 1).getValue();
      try {
        e.range.setBackground('#FFF2CC');
        applyReviewDecision(reviewId, decision, null);
        e.range.setBackground('#D9EAD3');
      } catch (err) {
        e.range.setBackground('#F4CCCC');
        SpreadsheetApp.getActiveSpreadsheet().toast(err.message, '❌ เกิดข้อผิดพลาด', 10);
      }
    }
  }
}
