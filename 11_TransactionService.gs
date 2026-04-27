/**
 * 11_TransactionService.gs
 * บันทึกข้อมูลงานส่งประจำวันลงใน FACT Table (เพื่อให้ Data สะอาดพร้อมใช้งาน)
 */

function buildFactRow(sourceObj, matchResult) {
  return [
    'TX-' + uuid().split('-')[0].toUpperCase(), // tx_id
    getSheetNames().SOURCE,
    sourceObj.rowNumber,
    sourceObj.idScg,
    sourceObj.deliveryDate,
    sourceObj.deliveryTime,
    sourceObj.shipmentNo,
    sourceObj.invoiceNo,
    sourceObj.ownerName,           // raw_owner_name
    sourceObj.destinationNameRaw, // raw_person_name
    sourceObj.addressRaw,          // raw_system_address
    sourceObj.addressFromLatLong, // raw_geo_resolved_address
    sourceObj.latLongText,        // raw_geo_text (จุดส่งสินค้าปลายทาง)
    sourceObj.latRaw,
    sourceObj.longRaw,
    matchResult.person.finalId,
    matchResult.place.finalId,
    matchResult.geo.finalId,
    matchResult.dest.id,
    sourceObj.warehouse,
    sourceObj.distanceKm,
    sourceObj.driverName,
    sourceObj.employeeId,
    sourceObj.employeeEmail,
    sourceObj.licensePlate,
    sourceObj.validationResult,
    sourceObj.anomalyDetected,
    'COMPLETED', // review_status
    'SYNCED',    // sync_status
    new Date(),  // created_at
    new Date()   // updated_at
  ];
}

function upsertFactDelivery(factRowArray) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('FACT_DELIVERY');
  
  // เช็คว่ามีซ้ำหรือไม่ ถ้ามีให้ข้าม (ป้องกันรันสคริปต์ซ้ำ)
  const sourceRecordId = factRowArray[3]; // source_record_id
  if (preventDuplicateTransaction(sourceRecordId)) {
    // ถ้าเจอว่าเคยบันทึกไปแล้ว อัปเดตก็พอ (ในตัวอย่างจะข้าม)
    writeLog('INFO', '11_TransactionService', 'upsertFactDelivery', sourceRecordId, 'Duplicate transaction skipped', '');
    return;
  }
  
  sheet.appendRow(factRowArray);
}

function preventDuplicateTransaction(sourceRecordId) {
  if (!sourceRecordId) return false;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('FACT_DELIVERY');
  const data = sheet.getRange(1, 4, sheet.getLastRow(), 1).getValues(); // Column 4 คือ source_record_id
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === sourceRecordId) {
      return true;
    }
  }
  return false;
}
