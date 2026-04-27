/**
 * 04_SourceRepository.gs
 * จัดการการอ่านและอัปเดตข้อมูลชีตต้นทาง
 */

/**
 * ดึงข้อมูลทั้งหมดจากชีตต้นทาง
 */
function getSourceRows() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(getSheetNames().SOURCE);
  const data = sheet.getDataRange().getValues();
  return data;
}

/**
 * ดึงเฉพาะแถวที่ยังไม่ได้ประมวลผล
 * (SYNC_STATUS ว่าง หรือไม่มีคำว่า SUCCESS/REVIEW/ERROR)
 */
function getUnprocessedSourceRows() {
  const data = getSourceRows();
  const map = getSourceColumnMap();
  const syncColIdx = map['SYNC_STATUS'];
  
  const unprocessed = [];
  const maxRows = parseInt(getConfig('MAX_PROCESS_ROWS_PER_RUN'), 10) || 500;
  
  for (let i = 1; i < data.length; i++) { // ข้าม header
    const status = safeString(data[i][syncColIdx]).toUpperCase();
    if (status !== 'SUCCESS' && status !== 'REVIEW' && status !== 'ERROR' && status !== 'IGNORE') {
      unprocessed.push({
        sourceIndex: i + 1, // แถวจริงในชีต (1-indexed)
        rowData: data[i]
      });
      if (unprocessed.length >= maxRows) break;
    }
  }
  return unprocessed;
}

function mapRowToSourceObject(rowArr, rowNumber) {
  const map = getSourceColumnMap();
  
  // ฟังก์ชันช่วยหา Index แบบยืดหยุ่น (เผื่อมีเว้นวรรคไม่ตรงกัน)
  const getIdx = (name, alternates = []) => {
    if (map[name] !== undefined) return map[name];
    for (let alt of alternates) {
      if (map[alt] !== undefined) return map[alt];
    }
    // ค้นหาแบบไม่สนใจเว้นวรรค, Underscore และ Case
    const cleanSearch = name.replace(/[\s_]+/g, '').toLowerCase();
    for (let key in map) {
      if (key.replace(/[\s_]+/g, '').toLowerCase() === cleanSearch) return map[key];
    }
    return undefined;
  };

  return {
    rowNumber: rowNumber,
    idScg: safeString(rowArr[getIdx('ID_SCGนครหลวงJWDภูมิภาค')]),
    invoiceNo: safeString(rowArr[getIdx('Invoice No')]),
    shipmentNo: safeString(rowArr[getIdx('Shipment No')]),
    deliveryDate: safeDate(rowArr[getIdx('วันที่ส่งสินค้า')]),
    deliveryTime: formatTime(rowArr[getIdx('เวลาที่ส่งสินค้า')]),
    driverName: safeString(rowArr[getIdx('ชื่อ - นามสกุล')]),
    licensePlate: safeString(rowArr[getIdx('ทะเบียนรถ')]),
    customerCode: safeString(rowArr[getIdx('รหัสลูกค้า')]),
    ownerName: safeString(rowArr[getIdx('ชื่อเจ้าของสินค้า')]),
    destinationNameRaw: safeString(rowArr[getIdx('ชื่อปลายทาง')]),
    addressRaw: safeString(rowArr[getIdx('ที่อยู่ปลายทาง')]),
    latRaw: safeNumber(rowArr[getIdx('LAT')]),
    longRaw: safeNumber(rowArr[getIdx('LONG')]),
    latLongText: safeString(rowArr[getIdx('จุดส่งสินค้าปลายทาง')]),
    warehouse: safeString(rowArr[getIdx('คลังสินค้า เอสซีจี เจดับเบิ้ลยูดี วังน้อย', ['คลังสินค้า'])]),
    distanceKm: safeNumber(rowArr[getIdx('ระยะทางจากคลัง_Km')]),
    addressFromLatLong: safeString(rowArr[getIdx('ชื่อที่อยู่จาก_LatLong', ['ชื่อที่อยู่จาก LatLong'])]), 
    employeeEmail: safeString(rowArr[getIdx('Email พนักงาน')]),
    employeeId: safeString(rowArr[getIdx('ID_พนักงาน')]),
    anomalyDetected: safeString(rowArr[getIdx('เหตุผิดปกติที่ตรวจพบ')]),
    validationResult: safeString(rowArr[getIdx('ผลการตรวจสอบงานส่ง')])
  };
}

/**
 * อัปเดตสถานะของแถว
 */
function markSourceRowProcessed(rowNumber, status) {
  updateSourceSyncStatus(rowNumber, status);
}

function updateSourceSyncStatus(rowNumber, status) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(getSheetNames().SOURCE);
  const col = getSourceColumnMap()['SYNC_STATUS'] + 1;
  sheet.getRange(rowNumber, col).setValue(status);
}
