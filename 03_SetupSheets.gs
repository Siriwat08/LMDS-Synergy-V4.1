/**
 * 03_SetupSheets.gs
 * จัดการการสร้างชีตระบบและตั้งค่าเริ่มต้น
 */

function createSystemSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const names = getSheetNames();
  
  const schemas = {
    [names.M_PERSON]: ['person_id', 'person_name_canonical', 'person_name_normalized', 'phone', 'first_seen_date', 'last_seen_date', 'usage_count', 'status', 'note'],
    [names.M_PERSON_ALIAS]: ['person_alias_id', 'person_id', 'alias_raw', 'alias_normalized', 'source_field', 'first_seen_date', 'last_seen_date', 'usage_count', 'active_flag'],
    [names.M_PLACE]: ['place_id', 'place_name_canonical', 'place_name_normalized', 'address_best', 'address_normalized', 'warehouse_default', 'first_seen_date', 'last_seen_date', 'usage_count', 'status', 'note'],
    [names.M_PLACE_ALIAS]: ['place_alias_id', 'place_id', 'alias_raw', 'alias_normalized', 'source_field', 'first_seen_date', 'last_seen_date', 'usage_count', 'active_flag'],
    [names.M_GEO_POINT]: ['geo_id', 'lat_raw', 'long_raw', 'lat_norm', 'long_norm', 'geo_key_6', 'geo_key_5', 'geo_key_4', 'address_from_latlong_best', 'first_seen_date', 'last_seen_date', 'usage_count', 'note'],
    [names.M_DESTINATION]: ['destination_id', 'person_id', 'place_id', 'geo_id', 'destination_label_canonical', 'destination_key', 'confidence_status', 'first_seen_date', 'last_seen_date', 'usage_count', 'note'],
    [names.FACT_DELIVERY]: ['tx_id', 'source_sheet', 'source_row_number', 'source_record_id', 'delivery_date', 'delivery_time', 'shipment_no', 'invoice_no', 'raw_owner_name', 'raw_person_name', 'raw_system_address', 'raw_geo_resolved_address', 'raw_geo_text', 'lat', 'lng', 'person_id', 'place_id', 'geo_id', 'destination_id', 'warehouse', 'distance_km', 'driver_name', 'employee_id', 'employee_email', 'license_plate', 'validation_result', 'anomaly_reason', 'review_status', 'sync_status', 'created_at', 'updated_at'],
    [names.Q_REVIEW]: ['review_id', 'issue_type', 'source_record_id', 'source_row_number', 'invoice_no', 'raw_person_name', 'raw_place_name', 'raw_system_address', 'raw_geo_resolved_address', 'raw_lat', 'raw_long', 'candidate_person_ids', 'candidate_place_ids', 'candidate_geo_ids', 'candidate_destination_ids', 'score', 'recommended_action', 'status', 'reviewer', 'reviewed_at', 'decision', 'note'],
    [names.SYS_CONFIG]: ['config_key', 'config_value', 'config_group', 'description', 'updated_at'],
    [names.SYS_LOG]: ['log_id', 'run_id', 'created_at', 'level', 'module_name', 'function_name', 'ref_id', 'message', 'payload_json'],
    [names.RPT_DATA_QUALITY]: ['report_date', 'total_source_rows', 'processed_rows', 'new_person_count', 'new_place_count', 'new_geo_count', 'new_destination_count', 'auto_match_count', 'review_count', 'duplicate_alert_count', 'error_count', 'last_refresh_at'],
    [names.MAPS_CACHE]: ['cache_key', 'cache_value', 'cache_type', 'raw_input', 'updated_at']
  };

  Object.keys(schemas).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }
    
    const headers = schemas[sheetName];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f3f3");
    sheet.setFrozenRows(1);
  });
}

/**
 * กำหนดค่า Config เบื้องต้น
 */
function seedInitialConfig() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(getSheetNames().SYS_CONFIG);
  if (!sheet) return;
  
  const initialConfigs = [
    ['AUTO_MATCH_SCORE', '90', 'Engine', 'คะแนนขั้นต่ำในการจับคู่อัตโนมัติ', new Date()],
    ['REVIEW_SCORE_MIN', '75', 'Engine', 'คะแนนขั้นต่ำที่ต้องส่งคนรีวิว', new Date()],
    ['GEO_RADIUS_METER', '50', 'Engine', 'รัศมีความคลาดเคลื่อนพิกัด (เมตร)', new Date()],
    ['MAX_PROCESS_ROWS_PER_RUN', '500', 'System', 'จำนวนแถวสูงสุดต่อการรัน 1 ครั้ง', new Date()]
  ];
  
  const existingData = sheet.getDataRange().getValues();
  if (existingData.length <= 1) { // ถ้ายังไม่มีข้อมูล
    sheet.getRange(2, 1, initialConfigs.length, 5).setValues(initialConfigs);
  }
}
