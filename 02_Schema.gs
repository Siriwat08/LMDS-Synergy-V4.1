/**
 * 02_Schema.gs
 * จัดการและตรวจสอบโครงสร้างคอลัมน์และชีต
 */

let SOURCE_COL_MAP_CACHE = null;

/**
 * ตรวจสอบว่าชีตต้นทางมีคอลัมน์ครบ 37 คอลัมน์หรือไม่
 */
function validateSourceSchema() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = getSheetNames().SOURCE;
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    throw new Error(`ไม่พบชีตต้นทาง: ${sheetName}`);
  }
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (headers.length < 35) { // คร่าวๆ ควรมีเยอะกว่า 35
    throw new Error(`จำนวนคอลัมน์ในชีต ${sheetName} น้อยกว่าที่คาดหวัง`);
  }
  
  assertRequiredColumns(headers, [
    'ID_SCGนครหลวงJWDภูมิภาค', 'ชื่อปลายทาง', 'ที่อยู่ปลายทาง', 
    'จุดส่งสินค้าปลายทาง', 'LAT', 'LONG', 'SYNC_STATUS', 'Invoice No', 'Shipment No'
  ]);
}

/**
 * ตรวจสอบว่าชีตระบบมีอยู่จริง
 */
function ensureSystemSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const names = getSheetNames();
  
  Object.keys(names).forEach(key => {
    if (!ss.getSheetByName(names[key])) {
      throw new Error(`ไม่พบชีตระบบที่จำเป็น: ${names[key]} กรุณากด ติดตั้งระบบครั้งแรก`);
    }
  });
}

/**
 * คืนค่า Mapping ตำแหน่งของคอลัมน์ต้นทาง
 */
function getSourceColumnMap() {
  if (SOURCE_COL_MAP_CACHE) return SOURCE_COL_MAP_CACHE;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(getSheetNames().SOURCE);
  if (!sheet) throw new Error("ไม่พบชีตต้นทาง");
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const map = {};
  
  for (let i = 0; i < headers.length; i++) {
    const headerName = headers[i];
    if (headerName !== null && headerName !== undefined && headerName !== '') {
      map[headerName.toString().trim()] = i;
    }
  }
  
  // เช็คคอลัมน์ SYNC_STATUS ถ้าไม่มีให้สร้าง
  if (map['SYNC_STATUS'] === undefined) {
    const nextCol = headers.length + 1;
    sheet.getRange(1, nextCol).setValue('SYNC_STATUS');
    map['SYNC_STATUS'] = nextCol - 1;
  }
  
  SOURCE_COL_MAP_CACHE = map;
  return map;
}

/**
 * ฟังก์ชันช่วยตรวจสอบ Required Columns
 */
function assertRequiredColumns(headers, requiredCols) {
  const missing = [];
  requiredCols.forEach(col => {
    if (headers.indexOf(col) === -1) missing.push(col);
  });
  
  if (missing.length > 0) {
    throw new Error(`ขาดคอลัมน์ที่จำเป็นในชีตต้นทาง: ${missing.join(', ')}`);
  }
}
