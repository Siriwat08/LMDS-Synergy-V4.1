/**
 * 01_Config.gs
 * จัดการค่าคงที่และ Configuration ของระบบ
 */

const CONFIG_CACHE = {};

/**
 * ดึงค่า Config จากชีต SYS_CONFIG
 */
function getConfig(key) {
  if (CONFIG_CACHE[key] !== undefined) {
    return CONFIG_CACHE[key];
  }
  
  const allConfigs = getAllConfigs();
  if (allConfigs[key] !== undefined) {
    return allConfigs[key];
  }
  
  // Default fallbacks ถ้าหาในชีตไม่เจอ
  const defaults = {
    'SOURCE_SHEET_NAME': 'SCGนครหลวงJWDภูมิภาค',
    'AUTO_MATCH_SCORE': '90',
    'REVIEW_SCORE_MIN': '75',
    'GEO_RADIUS_METER': '50',
    'MAX_PROCESS_ROWS_PER_RUN': '500'
  };
  
  return defaults[key] || null;
}

/**
 * โหลด Config ทั้งหมดแบบรวดเดียว
 */
function getAllConfigs() {
  if (Object.keys(CONFIG_CACHE).length > 0) return CONFIG_CACHE;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('SYS_CONFIG');
  if (!sheet) return {};
  
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) { // ข้าม header
    const key = data[i][0];
    const value = data[i][1];
    if (key) {
      CONFIG_CACHE[key] = value;
    }
  }
  return CONFIG_CACHE;
}

/**
 * อัปเดตค่า Config ลงชีต
 */
function setConfig(key, value) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('SYS_CONFIG');
  if (!sheet) return;
  
  const data = sheet.getDataRange().getValues();
  let found = false;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === key) {
      sheet.getRange(i + 1, 2).setValue(value);
      sheet.getRange(i + 1, 5).setValue(new Date()); // updated_at
      found = true;
      break;
    }
  }
  
  if (!found) {
    sheet.appendRow([key, value, 'SYSTEM', 'Added by script', new Date()]);
  }
  
  // Update Cache
  CONFIG_CACHE[key] = value;
}

/**
 * ดึงค่าเกณฑ์เป็นตัวเลข
 */
function getThresholds() {
  return {
    autoMatchScore: parseInt(getConfig('AUTO_MATCH_SCORE'), 10) || 90,
    reviewScoreMin: parseInt(getConfig('REVIEW_SCORE_MIN'), 10) || 75,
    geoRadiusMeter: parseInt(getConfig('GEO_RADIUS_METER'), 10) || 50
  };
}

/**
 * ชื่อชีตระบบทั้งหมด
 */
function getSheetNames() {
  return {
    SOURCE: getConfig('SOURCE_SHEET_NAME') || 'SCGนครหลวงJWDภูมิภาค',
    M_PERSON: 'M_PERSON',
    M_PERSON_ALIAS: 'M_PERSON_ALIAS',
    M_PLACE: 'M_PLACE',
    M_PLACE_ALIAS: 'M_PLACE_ALIAS',
    M_GEO_POINT: 'M_GEO_POINT',
    M_DESTINATION: 'M_DESTINATION',
    FACT_DELIVERY: 'FACT_DELIVERY',
    Q_REVIEW: 'Q_REVIEW',
    SYS_CONFIG: 'SYS_CONFIG',
    SYS_LOG: 'SYS_LOG',
    RPT_DATA_QUALITY: 'RPT_DATA_QUALITY',
    MAPS_CACHE: 'MAPS_CACHE'
  };
}
