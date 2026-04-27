/**
 * 09_DestinationService.gs
 * ประกอบชิ้นส่วน (Person, Place, Geo) ให้กลายเป็น Destination (ปลายทางจริง)
 */

function buildDestinationKey(personId, placeId, geoId) {
  // สร้าง Key ผสม เพื่อให้หาได้เร็ว
  return `${personId || 'UNK'}|${placeId || 'UNK'}|${geoId || 'UNK'}`;
}

function resolveDestination(personId, placeId, geoId, sourceObj) {
  const destKey = buildDestinationKey(personId, placeId, geoId);
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_DESTINATION');
  const data = sheet.getDataRange().getValues();
  
  let foundId = null;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][5] === destKey) { // คอลัมน์ destination_key
      foundId = data[i][0];
      break;
    }
  }
  
  if (foundId) {
    return { id: foundId, isNew: false, key: destKey };
  } else {
    // ยังไม่เคยมีการประกอบร่างแบบนี้มาก่อน สร้างใหม่
    const newLabel = sourceObj.destinationNameRaw; // ใช้ชื่อดิบชั่วคราวเป็น Label
    const newId = createDestination(personId, placeId, geoId, newLabel, destKey);
    return { id: newId, isNew: true, key: destKey };
  }
}

function createDestination(personId, placeId, geoId, label, destKey) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_DESTINATION');
  const destId = 'DST-' + uuid().split('-')[0].toUpperCase();
  
  sheet.appendRow([
    destId,
    personId,
    placeId,
    geoId,
    safeString(label),
    destKey,
    'HIGH', // confidence_status (ถ้ารวมมาจาก Auto Match หรือ Review)
    new Date(),
    new Date(),
    1,
    ''
  ]);
  
  return destId;
}

function updateDestinationStats(destinationId) {
  // สำหรับใช้งานจริง
}
