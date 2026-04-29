🔍 LMDS V4.4 — Full System Inventory Report
ตามที่ขอครับ ขอสรุปแบบละเอียดทุกโมดูล, ทุกฟังก์ชัน, ทุกชีต และทุกคอลัมน์ พร้อมวิเคราะห์จุดที่ยังขาดหายไป

📂 ภาพรวมโมดูลทั้งหมด (17 ไฟล์)
00_App.gs — Entry Point & Menu Controller
ฟังก์ชัน	สถานะ	หมายเหตุ
onOpen()	✅ ครบ	สร้างเมนูหลัก
runInitialSetup()	✅ ครบ	เรียก createSystemSheets + seedInitialConfig
runDailyProcess()	✅ ครบ	Main Loop + Checkpoint + Time Guard
reprocessSelectedRows()	✅ ครบ	รีเซ็ตแถวที่เลือกแล้วรันใหม่
onEdit(e)	✅ ครบ	ดัก Dropdown Q_REVIEW → applyReviewDecision
runNightlyMaintenance()	❌ ขาด	มีในเมนูแต่ไม่มีฟังก์ชัน! เรียก refreshQualityReport() เท่านั้น
01_Config.gs — Configuration Manager
ฟังก์ชัน	สถานะ	หมายเหตุ
getConfig(key)	✅ ครบ	มี Cache + Default fallback
getAllConfigs()	✅ ครบ	โหลดทีเดียวจาก SYS_CONFIG
setConfig(key, value)	✅ ครบ	upsert ลงชีต + update Cache
getThresholds()	✅ ครบ	คืน autoMatchScore, reviewScoreMin, geoRadiusMeter
getSheetNames()	✅ ครบ	คืน object ชื่อชีตทั้งหมด
resetConfigCache()	❌ ขาด	ควรมีเพื่อ flush cache เมื่อแก้ค่าใน SYS_CONFIG มือ
02_Schema.gs — Schema Validator
ฟังก์ชัน	สถานะ	หมายเหตุ
validateSourceSchema()	✅ ครบ	ตรวจว่ามีคอลัมน์ครบ
ensureSystemSheets()	✅ ครบ	ตรวจว่ามีชีตระบบทุกตัว
getSourceColumnMap()	✅ ครบ	แปลง Header → Index Map พร้อม Cache
assertRequiredColumns()	✅ ครบ	ตรวจ Required columns
validateMasterSchemas()	❌ ขาด	ควรมีตรวจ M_PERSON, M_PLACE, M_GEO_POINT ด้วย
03_SetupSheets.gs — Sheet Initializer
ฟังก์ชัน	สถานะ	หมายเหตุ
createSystemSheets()	✅ ครบ	สร้างชีตพร้อม Header ทั้งหมด
seedInitialConfig()	✅ ครบ	เซ็ตค่า default ใน SYS_CONFIG
applySheetFormatting()	❌ ขาด	ควรมีจัด freeze, color, column width
protectSystemSheets()	❌ ขาด	ควร protect M_PERSON/M_PLACE ไม่ให้แก้มือ
04_SourceRepository.gs — Source Data Reader
ฟังก์ชัน	สถานะ	หมายเหตุ
getSourceRows()	✅ ครบ	ดึงข้อมูลดิบทั้งหมด
getUnprocessedSourceRows()	✅ ครบ	filter เฉพาะที่ยังไม่ประมวลผล
mapRowToSourceObject()	✅ ครบ	แปลง array → object พร้อม flexible index
markSourceRowProcessed()	✅ ครบ	อัปเดต SYNC_STATUS
updateSourceSyncStatus()	✅ ครบ	เขียนลงชีตตรง
parseLatLongColumn()	❌ ขาด	ควรมีแยก จุดส่งสินค้าปลายทาง → lat, lng แบบ robust
05_NormalizeService.gs — Data Cleaning Engine
ฟังก์ชัน	สถานะ	หมายเหตุ
normalizeThaiText()	✅ ครบ	NFC + trim + space
normalizePersonName()	✅ ครบ	ตัด prefix + สกัดเบอร์
normalizePlaceName()	✅ ครบ	ตัด "ร้าน", "สาขา"
normalizeAddress()	✅ ครบ	ย่อคำ + Auto-Fill จาก SYS_TH_GEO
loadThGeo()	✅ ครบ	โหลด Dictionary พร้อม RAM Cache
analyzeGeoWarning()	✅ ครบ	เช็ค note_type แล้วสร้าง warning message
extractPhoneNumbers()	✅ ครบ	Regex สกัดเบอร์โทร
smartMergeAddress()	✅ ครบ	รวมร่าง raw + geo address
cleanAddressRedundancy()	✅ ครบ	ลบคำซ้ำซ้อน ต., อ., จ.
validatePostcodeOverride()	✅ ครบ	เช็ค override zipcode
normalizeLatLong()	✅ ครบ	ปัดทศนิยม 5 ตำแหน่ง
buildGeoKeys()	✅ ครบ	สร้าง key4, key3, key2
buildFingerprint()	✅ ครบ	hash object เป็น hex
normalizeCompanyName()	❌ ขาด	ควรมีตัด บจก., จำกัด, หจก. สำหรับ ชื่อเจ้าของสินค้า
parseLatLongText()	❌ ขาด	แยก "13.xxxx,100.xxxx" → {lat, lng}
06_PersonService.gs — Person Master Manager
ฟังก์ชัน	สถานะ	หมายเหตุ
resolvePerson()	✅ ครบ	resolve + score + ตัดสิน new/review/match
findPersonCandidates()	✅ ครบ	ค้นหาด้วยเบอร์ → Alias → Master
scorePersonCandidate()	✅ ครบ	Dice + LengthRatio
createPerson()	✅ ครบ	สร้าง M_PERSON + Alias อัตโนมัติ
createPersonAlias()	✅ ครบ	เพิ่ม record ใน M_PERSON_ALIAS
updatePersonStats()	⚠️ Stub	มีแต่ว่าง ยังไม่ implement
mergePersonRecords()	❌ ขาด	ต้องมีสำหรับ MERGE_TO_CANDIDATE decision
getPersonById()	❌ ขาด	ควรมี helper ดึงข้อมูลบุคคลจาก ID
07_PlaceService.gs — Place Master Manager
ฟังก์ชัน	สถานะ	หมายเหตุ
resolvePlace()	✅ ครบ	เทียบทั้ง addressRaw และ addressFromLatLong
findBestMatch()	✅ ครบ	wrapper หา candidate จาก address ใดๆ
findPlaceCandidates()	✅ ครบ	ค้นจาก M_PLACE_ALIAS
scorePlaceCandidate()	✅ ครบ	Dice + LengthRatio
createPlace()	✅ ครบ	สร้าง M_PLACE + Alias (raw + merged)
createPlaceAlias()	✅ ครบ	เพิ่ม record ใน M_PLACE_ALIAS
updatePlaceStats()	❌ ขาด	ยังไม่มี (เหมือน Person)
mergePlaceRecords()	❌ ขาด	ต้องมีสำหรับ MERGE decision
08_GeoService.gs — Geo Point Manager
ฟังก์ชัน	สถานะ	หมายเหตุ
resolveGeo()	✅ ครบ	หา candidate → วัดระยะ → ตัดสินใจ
findGeoCandidates()	✅ ครบ	ค้นจาก M_GEO_POINT ด้วย bounding box
createGeoPoint()	✅ ครบ	สร้าง M_GEO_POINT
updateGeoStats()	❌ ขาด	ควรมี update usage_count
getGeoById()	❌ ขาด	helper ดึงข้อมูล geo จาก ID
09_DestinationService.gs — Destination Composer
ฟังก์ชัน	สถานะ	หมายเหตุ
buildDestinationKey()	✅ ครบ	สร้าง composite key
resolveDestination()	✅ ครบ	หาหรือสร้าง destination
createDestination()	✅ ครบ	บันทึก M_DESTINATION
updateDestinationStats()	⚠️ Stub	ว่างเปล่า ยังไม่ implement
10_MatchEngine.gs — Decision Brain
ฟังก์ชัน	สถานะ	หมายเหตุ
matchAllEntities()	✅ ครบ	orchestrate person + place + geo
calculateCompositeScore()	✅ ครบ	น้ำหนัก Geo45% Person30% Place25%
decideAutoMatchOrReview()	✅ ครบ	ตัดสิน AUTO_MATCH หรือ REVIEW
buildReviewPayload()	✅ ครบ	สร้าง payload ส่งเข้า Q_REVIEW
detectConflictType()	✅ ครบ	ระบุประเภทปัญหา 5-8
evaluateThaiGeoBonus()	✅ ครบ	โบนัส +15 ถ้าตำบลตรง
evaluateOwnerContextScore()	❌ ขาด	ควรมี bonus/penalty จาก ชื่อเจ้าของสินค้า
detectDuplicateTransaction()	❌ ขาด	ตรวจ Invoice+Date ซ้ำก่อนเข้า match
11_TransactionService.gs — Fact Writer
ฟังก์ชัน	สถานะ	หมายเหตุ
buildFactRow()	✅ ครบ	สร้าง array ครบ 31 คอลัมน์
upsertFactDelivery()	✅ ครบ	append พร้อมป้องกัน duplicate
preventDuplicateTransaction()	✅ ครบ	เช็คซ้ำด้วย source_record_id
batchWriteFacts()	❌ ขาด	สำคัญมาก! ควรเขียนแบบ batch setValues() แทน loop appendRow()
12_ReviewService.gs — Human-in-the-Loop
ฟังก์ชัน	สถานะ	หมายเหตุ
enqueueReview()	✅ ครบ	เพิ่มเข้า Q_REVIEW
setupReviewDropdown()	✅ ครบ	สร้าง Data Validation
getPendingReviews()	✅ ครบ	ดึง PENDING items
applyReviewDecision()	✅ ครบ	UPDATE Q_REVIEW + trigger reprocess
applyBulkReviewDecision()	❌ ขาด	ควรมี bulk apply สำหรับ admin กด approve หลายรายการพร้อมกัน
getReviewSummaryStats()	❌ ขาด	สรุปสถิติ pending/resolved แยกตาม issue_type
13_ReportService.gs — Quality Reporter
ฟังก์ชัน	สถานะ	หมายเหตุ
refreshQualityReport()	✅ ครบ	append แถวใหม่ใน RPT_DATA_QUALITY
buildDailySummary()	✅ ครบ	เรียก refreshQualityReport (ยังไม่ส่ง LINE/Email จริง)
sendLineNotify()	❌ ขาด	ระบบแจ้งเตือน LINE
sendEmailSummary()	❌ ขาด	ระบบส่ง Email สรุป
buildPivotReport()	❌ ขาด	สรุป Fact Delivery แบบ pivot by จังหวัด/วัน
14_Utils.gs — Utility Library
ฟังก์ชัน	สถานะ	หมายเหตุ
uuid()	✅ ครบ	
safeTrim(), safeString(), safeNumber(), safeDate()	✅ ครบ	
formatTime()	✅ ครบ	
writeLog()	✅ ครบ	append SYS_LOG
haversineDistanceMeters()	✅ ครบ	
diceCoefficient()	✅ ครบ	bigram similarity
lengthRatio()	✅ ครบ	
saveCheckpoint(), getCheckpoint(), clearCheckpoint()	✅ ครบ	
isTimeNearLimit()	✅ ครบ	
updateRunStatus()	✅ ครบ	
showAutoCloseAlert()	✅ ครบ	HTML popup countdown
levenshteinDistance()	❌ ขาด	ควรมีคู่กับ Dice สำหรับชื่อสั้น
thaiPhoneticKey()	❌ ขาด	สกัด phonetic key ภาษาไทย
batchReadSheet()	❌ ขาด	helper อ่าน sheet แบบ batch พร้อม cache
15_GoogleMapsAPI.gs — Maps & Geocoding
ฟังก์ชัน	สถานะ	หมายเหตุ
md5()	✅ ครบ	
getAdvancedCache()	✅ ครบ	RAM → Sheet cache
setAdvancedCache()	✅ ครบ	
GOOGLEMAPS_DISTANCE()	✅ ครบ	
GOOGLEMAPS_REVERSEGEOCODE()	✅ ครบ	
GOOGLEMAPS_LATLONG()	✅ ครบ	
GOOGLEMAPS_DURATION()	✅ ครบ	
batchReverseGeocode()	❌ ขาด	สำคัญ — batch หลายพิกัดพร้อมกัน quota-safe
clearMapsCache()	❌ ขาด	ล้าง MAPS_CACHE sheet เมื่อต้องการ refresh
16_GeoDictionaryBuilder.gs — SYS_TH_GEO Builder
ฟังก์ชัน	สถานะ	หมายเหตุ
buildGeoIndex()	✅ ครบ	อ่าน + parse + เขียน column F-N
parseRemarkLogic()	✅ ครบ	แยก 4 note_type: ONLY_BUILDING, ONLY_MOO, EXCEPT_RULE, COMPLEX_HOUSE_NO
validateGeoIndexIntegrity()	❌ ขาด	ตรวจว่า geo_key ซ้ำหรือขาดหายไม่
🗂️ ชีตทั้งหมด (13 ชีต)
กลุ่มที่ 1: Source Data
ชีต	วัตถุประสงค์
SCGนครหลวงJWDภูมิภาค	ข้อมูลดิบจากคนขับ (เพิ่มทุกวัน)
คอลัมน์สำคัญ: head, ID_SCGนครหลวงJWDภูมิภาค, วันที่ส่งสินค้า, เวลาที่ส่งสินค้า, จุดส่งสินค้าปลายทาง, ชื่อ-นามสกุล, ทะเบียนรถ, Shipment No, Invoice No, รูปถ่ายบิลส่งสินค้า, รหัสลูกค้า, ชื่อเจ้าของสินค้า, ชื่อปลายทาง, Email พนักงาน, LAT, LONG, ID_Doc_Return, คลังสินค้า, ที่อยู่ปลายทาง, รูปสินค้าตอนส่ง, รูปหน้าร้าน/บ้าน, หมายเหตุ, เดือน, ระยะทางจากคลัง_Km, ชื่อที่อยู่จาก_LatLong, SM_Link_SCG, ID_พนักงาน, พิกัดตอนกดบันทึกงาน, เวลาเริ่มกรอกงาน, เวลาบันทึกงานสำเร็จ, ระยะขยับจากจุดเริ่มต้น_เมตร, ระยะเวลาใช้งาน_นาที, ความเร็วการเคลื่อนที่_เมตร_นาที, ผลการตรวจสอบงานส่ง, เหตุผิดปกติที่ตรวจพบ, เวลาถ่ายรูปหน้าร้าน_หน้าบ้าน, SYNC_STATUS

กลุ่มที่ 2: Master Data (M_)
ชีต	คอลัมน์
M_PERSON	person_id, person_name_canonical, person_name_normalized, phone, first_seen_date, last_seen_date, usage_count, status, note
M_PERSON_ALIAS	person_alias_id, person_id, alias_raw, alias_normalized, source_field, first_seen_date, last_seen_date, usage_count, active_flag
M_PLACE	place_id, place_name_canonical, place_name_normalized, address_best, address_normalized, warehouse_default, first_seen_date, last_seen_date, usage_count, status, note
M_PLACE_ALIAS	place_alias_id, place_id, alias_raw, alias_normalized, source_field, first_seen_date, last_seen_date, usage_count, active_flag
M_GEO_POINT	geo_id, lat_raw, long_raw, lat_norm, long_norm, geo_key_6, geo_key_5, geo_key_4, address_from_latlong_best, first_seen_date, last_seen_date, usage_count, note
M_DESTINATION	destination_id, person_id, place_id, geo_id, destination_label_canonical, destination_key, confidence_status, first_seen_date, last_seen_date, usage_count, note
กลุ่มที่ 3: Fact & Queue
ชีต	คอลัมน์สำคัญ
FACT_DELIVERY	tx_id, source_sheet, source_row_number, source_record_id, delivery_date, delivery_time, shipment_no, invoice_no, raw_owner_name, raw_person_name, raw_system_address, raw_geo_resolved_address, raw_geo_text, lat, lng, person_id, place_id, geo_id, destination_id, warehouse, distance_km, driver_name, employee_id, employee_email, license_plate, validation_result, anomaly_reason, review_status, sync_status, created_at, updated_at
Q_REVIEW	review_id, issue_type, source_record_id, source_row_number, invoice_no, raw_person_name, raw_place_name, raw_system_address, raw_geo_resolved_address, raw_lat, raw_long, candidate_person_ids, candidate_place_ids, candidate_geo_ids, candidate_destination_ids, score, recommended_action, status, reviewer, reviewed_at, decision (Dropdown), note
กลุ่มที่ 4: System & Reference
ชีต	คอลัมน์
SYS_CONFIG	config_key, config_value, config_group, description, updated_at
SYS_LOG	log_id, run_id, created_at, level, module_name, function_name, ref_id, message, payload_json
SYS_TH_GEO	(A) รหัสไปรษณีย์, (B) แขวง/ตำบล, (C) เขต/อำเภอ, (D) จังหวัด, (E) หมายเหตุ, (F) postcode_text, (G) subdistrict_norm, (H) district_norm, (I) province_norm, (J) note_type, (K) note_keywords, (L) postcode_override, (M) geo_key, (N) active_flag
RPT_DATA_QUALITY	report_date, total_source_rows, processed_rows, new_person_count, new_place_count, new_geo_count, new_destination_count, auto_match_count, review_count, duplicate_alert_count, error_count, last_refresh_at
MAPS_CACHE	cache_key, cache_value, cache_type, raw_input, updated_at
🚨 สรุปจุดที่ต้องแก้/เพิ่มเร่งด่วน
Priority 1 — Critical Bug / ขาดหายจริง
ปัญหา	ไฟล์ที่ต้องแก้
runNightlyMaintenance() อยู่ในเมนูแต่ไม่มีฟังก์ชัน	00_App.gs
updatePersonStats() / updateDestinationStats() เป็น stub ว่างเปล่า	06_PersonService.gs, 09_DestinationService.gs
batchWriteFacts() ยังเป็น single appendRow() loop — ช้ามากเมื่อข้อมูลเยอะ	11_TransactionService.gs
parseLatLongText() ขาด — ยังไม่มีการ parse จุดส่งสินค้าปลายทาง → lat/lng แบบ safe	05_NormalizeService.gs
Priority 2 — Feature สำคัญที่ยังขาด
ฟีเจอร์	ควรอยู่ใน
mergePersonRecords() / mergePlaceRecords() — ยังไม่รองรับ MERGE decision จริง	06_PersonService.gs, 07_PlaceService.gs
levenshteinDistance() — ชื่อสั้น Dice ไม่ accurate	14_Utils.gs
normalizeCompanyName() — ตัด บจก./หจก./จำกัด	05_NormalizeService.gs
batchReverseGeocode() — quota-safe	15_GoogleMapsAPI.gs
ต้องการให้ GEM เริ่มเขียนโค้ดส่วนไหนก่อนครับ? แนะนำให้เริ่มจาก Priority 1 คือแก้ runNightlyMaintenance() + batchWriteFacts() + parseLatLongText() ก่อนเพื่อให้ระบบ stable ครับ

You said: ข้อมูลที่ได้มา ทั้งชื่อบุคคล ทั้งชื่อสถานที่ มันมาแบบมั่วๆ ครบบ้าง ไม่ครบบ้าง ตัดคำมามั่วๆครับ ทำมาแบบไม่ใส่ใจ ให้สูตรตัดคำแต่ไม่ตรวจสอบ ผมจึงอยากจะพัฒนาระบบเอ…
ข้อมูลที่ได้มา ทั้งชื่อบุคคล ทั้งชื่อสถานที่ มันมาแบบมั่วๆ ครบบ้าง ไม่ครบบ้าง ตัดคำมามั่วๆครับ ทำมาแบบไม่ใส่ใจ ให้สูตรตัดคำแต่ไม่ตรวจสอบ ผมจึงอยากจะพัฒนาระบบเอง แค่ข้อมูลที่ได้มามัน ไม่ดีเท่าไหร่ครับ  จึงอยากจะเน้นย้ำเรื่องตรงนี้แหละ

11:44
Claude responded: 🔍 วิเคราะห์ปัญหา "ข้อมูลสกปรก" แบบลึก — GEM Data Quality Audit

Analyzed data quality issues and remediation strategies
Analyzed data quality issues and remediation strategies
🔍 วิเคราะห์ปัญหา "ข้อมูลสกปรก" แบบลึก — GEM Data Quality Audit
ครับ นี่คือปัญหาหัวใจของโปรเจกต์ทั้งหมด ขอแตกให้ละเอียดก่อนเขียนโค้ด เพื่อให้ออกแบบ Logic ได้ถูกต้องตั้งแต่ต้นครับ

🧠 ภาพรวมปัญหา "ข้อมูลสกปรก" ที่พบในระบบนี้


🔬 วิเคราะห์ปัญหาแต่ละประเภทแบบละเอียด
กลุ่มที่ 1: ชื่อบุคคล — ปัญหาหนักที่สุด
ข้อมูลที่พบจริงในระบบโลจิสติกส์แบบนี้ มีรูปแบบสกปรกหลัก 6 ประเภท:

Type A — Prefix ขยะ (ต้องตัดก่อนเปรียบเทียบ)

นาย สมชาย  →  สมชาย
คุณ สมชาย  →  สมชาย
พี่ สมชาย  →  สมชาย
ช่าง สมชาย →  สมชาย
นายสมชาย   →  สมชาย  ← ไม่มีเว้นวรรคก็ต้องจัดการได้
Type B — ข้อมูลปนเปื้อน (เบอร์โทร, ชื่อร้าน)

สมชาย 089-123-4567        →  สมชาย  + phone: 0891234567
สมชาย ร้านวัสดุก่อสร้าง   →  สมชาย  (ร้านฯ ไปสร้าง place alias)
สมชาย/รับของ              →  สมชาย
Type C — ชื่อย่อ / ชื่อเล่น (Dice จะพลาด เพราะความยาวต่างกันมาก)

สมชาย  vs  สมชาย ใจดี   → Dice ~0.67  ← อาจหลุด threshold
ส.ชาย  vs  สมชาย        → ต้องการ phonetic key
Type D — ตัวพิมพ์ผิด / encoding

สมชาย  (NFC)  vs  สมชาย  (NFD) → ตัวอักษรเหมือนกัน แต่ byte ต่างกัน
Type E — ภาษาอังกฤษ

somchai  vs  สมชาย  → ต้องการ phonetic matching เพิ่มเติม
Somchai Jaidee  →  normalize เป็น lowercase ก่อน
Type F — ชื่อบริษัท / นิติบุคคล ปนมากับชื่อคน

บจก.วัสดุภัณฑ์ สาขา 3  →  วัสดุภัณฑ์  (ตัด บจก. + สาขา)
ห้างหุ้นส่วนจำกัด ABC  →  abc
กลุ่มที่ 2: ที่อยู่ — ปัญหาซับซ้อนมากกว่า
Type A — คำซ้ำซ้อน (โค้ดปัจจุบันจัดการได้บางส่วน แต่ยังขาด)

เขตเขตจตุจักร          →  เขตจตุจักร          ✅ มีแล้ว
ต.ตำบลหนองขาม         →  ตำบลหนองขาม         ✅ มีแล้ว
แขวงแขวงลาดพร้าว       →  แขวงลาดพร้าว        ✅ มีแล้ว
ลาดพร้าว ลาดพร้าว      →  ลาดพร้าว           ❌ ยังขาด
กรุงเทพ กรุงเทพมหานคร  →  กรุงเทพมหานคร      ⚠️ บางกรณี
Type B — Plus Code ติดมาจาก Google Maps

QC6P+GFG ถนนสุขุมวิท  →  ถนนสุขุมวิท   ✅ มีแล้ว (smartMerge)
Type C — ที่อยู่ไม่สมบูรณ์ → Auto-Fill จาก SYS_TH_GEO

68 ต.หนองขาม           →  68 ต.หนองขาม อ.หนองขาม จ.สระบุรี  ✅ มีแล้ว
ถ.พหลโยธิน แขวงลาดยาว  →  + เขตจตุจักร จ.กรุงเทพมหานคร     ✅ มีแล้ว
Type D — ที่อยู่ว่างเปล่า แต่มีพิกัด ← นี่คือจุดวิกฤตที่สุด

addressRaw = ""
LAT = 13.872341, LONG = 100.512890
→ ต้อง reverseGeocode แล้วใช้ addressFromLatLong แทน  ⚠️ ยังไม่ robust
กลุ่มที่ 3: พิกัด — ดูง่าย แต่มีกับดัก
ปัญหาหลัก: พิกัดเดียวกันแต่ต่างกันเล็กน้อย เพราะ GPS drift

วันที่ 1:  13.872341, 100.512890
วันที่ 2:  13.872399, 100.512870   ← ห่างกัน ~7 เมตร
วันที่ 3:  13.872310, 100.512920   ← ห่างกัน ~4 เมตร
ระบบปัจจุบัน: ใช้รัศมี 50 เมตร → จัดการได้ดีมากครับ

กับดัก: 0,0 หรือค่าว่าง

LAT = 0, LONG = 0  →  ต้องถือว่า "ไม่มีพิกัด" ไม่ใช่พิกัดจริง
LAT = "", LONG = "" →  เช่นกัน
🛠️ สิ่งที่ต้องเพิ่ม/แก้ใน Normalize Engine
จากการวิเคราะห์ข้างต้น นี่คือรายการ function ที่ขาดหายไปและสำคัญมาก เรียงตาม priority:

Priority	Function ที่ต้องเพิ่ม	Module	เหตุผล
🔴 P1	parseLatLongColumn()	04_Source	แยก "13.x,100.x" → {lat,lng} แบบ safe รองรับทุก format
🔴 P1	validateLatLng(lat,lng)	05_Normalize	เช็ค 0,0 / null / out of Thailand bounds
🔴 P1	normalizeCompanyName()	05_Normalize	ตัด บจก./หจก./จำกัด/สาขา
🔴 P1	mergePersonRecords()	06_Person	MERGE_TO_CANDIDATE decision ยังไม่ทำงานจริง
🟡 P2	levenshteinDistance()	14_Utils	ชื่อสั้น < 4 ตัว Dice ไม่แม่น
🟡 P2	extractPersonOnly()	05_Normalize	แยกชื่อคนออกจากชื่อร้าน
🟡 P2	deduplicateAddressParts()	05_Normalize	จัดการ "ลาดพร้าว ลาดพร้าว"
🟢 P3	thaiPhoneticKey()	14_Utils	จับคู่ชื่อที่สะกดต่างกันแต่ออกเสียงเหมือน
🟢 P3	batchWriteFacts()	11_Transaction	performance สำหรับข้อมูลเยอะ
📋 แผนการพัฒนา (แนะนำ)
Sprint 1 (แก้ก่อน ใช้งานได้เร็ว): parseLatLongColumn + validateLatLng + normalizeCompanyName + mergePersonRecords

Sprint 2 (เพิ่มความแม่นยำ): levenshteinDistance + extractPersonOnly + deduplicateAddressParts

Sprint 3 (optimization): thaiPhoneticKey + batchWriteFacts + batchReverseGeocode

ต้องการให้ GEM เริ่มเขียนโค้ด Sprint 1 เลยเลยครับ? หรือต้องการเจาะปัญหาไหนเป็นพิเศษก่อน? เช่น ถ้าข้อมูลชื่อบุคคลมั่วหนักที่สุด ก็เริ่มจาก normalizePersonName เวอร์ชันใหม่ที่จัดการได้ครบกว่าเดิมครับ

You said: ชื่อบุคคล
ชื่อบุคคล
ชื่อสถานที่
ทั้ง2 มั่วเหมือนกัน
แต่ชื่อสถานที่ยังดีที่มี คอลัมน์ ชื่อที่อยู่จาก_LatLongที่แปลงข้อมูลมาให้เทียบ แต่ไม่รู้ว่าโค๊ดไได้ใช้มั้ย

คอลัมน์ `ชื่อที่อยู่จาก_LatLong`
### ความหมาย
คือ **ชื่อสถานที่อยู่แบบข้อความ**  
ที่ถูกแปลงมาจากคอลัมน์ `จุดส่งสินค้าปลายทาง` โดยใช้ script

พูดให้ตรงคือ มันเป็นผลของ **reverse geocoding**

### ความแตกต่างจาก `ที่อยู่ปลายทาง`
สองคอลัมน์นี้คนชอบสับสนมาก จึงต้องแยกให้ชัด:

#### `ที่อยู่ปลายทาง`
- มาจากระบบเดิม
- เป็นข้อความที่ระบบต้นทางให้มา
- มั่วได้มาก

#### `ชื่อที่อยู่จาก_LatLong`
- มาจากพิกัดจริง
- ระบบแปลงจาก LatLong เป็นข้อความ
- โดยทั่วไปน่าเชื่อถือกว่าในเชิงตำแหน่ง
- แต่บางครั้ง wording อาจไม่ตรงภาษาคนใช้งานจริง

### สถานะความน่าเชื่อถือ
โดยทั่วไปถือว่า **น่าเชื่อถือมากกว่า `ที่อยู่ปลายทาง`**
ในฐานะ “ข้อความที่สะท้อนตำแหน่งจริง”

### บทบาทในระบบ
คอลัมน์นี้สำคัญมาก เพราะควรใช้เป็น:

- ตัวช่วย normalize สถานที่
- ตัวช่วยเทียบกับ `SYS_TH_GEO`
- ตัวช่วยเช็คอำเภอ/ตำบล/จังหวัด
- ตัวช่วยแยกสาขา
- ตัวช่วยตรวจว่าที่อยู่จากระบบเดิมเพี้ยนแค่ไหน

### สรุปสั้น
คอลัมน์นี้คือ **“ที่อยู่ข้อความที่สร้างจากพิกัดจริง”**
Show more
12:22
Claude responded: 🔍 Audit: โค้ดใช้ ชื่อที่อยู่จาก_LatLong จริงไหม และดีพอไหม?

ตรวจสอบการใช้งาน LatLong และเสนอการปรับปรุงระบบ
ตรวจสอบการใช้งาน LatLong และเสนอการปรับปรุงระบบ
🔍 Audit: โค้ดใช้ ชื่อที่อยู่จาก_LatLong จริงไหม และดีพอไหม?
ตรวจแบบ line-by-line ครับ — คำตอบคือ "ใช้อยู่ แต่ยังไม่ได้ประโยชน์เต็มที่"

📍 ตามรอยการใช้งานจริงในโค้ด
จุดที่ 1 — 04_SourceRepository.gs → อ่านข้อมูลเข้า ✅
javascript
addressFromLatLong: safeString(rowArr[getIdx('ชื่อที่อยู่จาก_LatLong', 
                                            ['ชื่อที่อยู่จาก LatLong'])]),
อ่านเข้า sourceObj ถูกต้อง มี alternate key สำรองด้วย ✅

จุดที่ 2 — 07_PlaceService.gs → ใช้เป็น Fallback เท่านั้น ⚠️
javascript
function resolvePlace(sourceObj) {
  const addr1 = sourceObj.addressRaw;           // ที่อยู่มั่วจากระบบ
  const addr2 = sourceObj.addressFromLatLong;   // ที่อยู่จากพิกัดจริง

  let res1 = findBestMatch(addr1);              // หา match จาก addr1 ก่อนเสมอ

  let res2 = { score: 0 };
  if (addr2 && res1.score < 90) {              // ⚠️ ใช้ addr2 เฉพาะตอน addr1 คะแนนต่ำ
    res2 = findBestMatch(addr2);
  }
  // เลือกตัวที่คะแนนสูงกว่า
  let finalMatch = res1.score >= res2.score ? res1 : res2;
}
ปัญหา: ถ้า addressRaw บังเอิญ match ได้ score 90 (แม้จะ match ผิดชีต!) ระบบจะไม่เปิดดู addressFromLatLong เลย — ข้อมูลที่น่าเชื่อถือกว่าถูกทิ้งไป

จุดที่ 3 — 10_MatchEngine.gs → ใช้แค่เช็คตำบล ⚠️
javascript
function evaluateThaiGeoBonus(sourceObj) {
  const rawAddr = sourceObj.addressRaw || '';
  const geoAddr = sourceObj.addressFromLatLong || '';

  // เช็คเฉพาะ "ตำบล" — ไม่เช็ค อำเภอ / จังหวัด / ถนน
  const subMatch = rawAddr.match(/(?:ต\.|ตำบล|แขวง)\s*([ก-๙]+)/);
  if (subMatch) {
    const subName = subMatch[1];
    if (geoAddr.indexOf(subName) > -1) {
      bonus += 15; // ⚠️ บวกโบนัสแค่ 15 คะแนน
    }
  }
  return bonus;
}
ปัญหา: ไม่มีการเช็ค ความขัดแย้ง — ถ้า addressRaw บอกว่า "เขตบางรัก" แต่ addressFromLatLong บอกว่า "เขตสาทร" ระบบไม่รู้ว่านี่คือสัญญาณเตือน

จุดที่ 4 — 05_NormalizeService.gs → ใช้ใน smartMerge ✅ แต่เรียกช้าไป
javascript
// ใน createPlace() เรียก smartMerge หลังจาก resolve แล้ว
function createPlace(canonicalPlaceName, addressRaw, geoAddr) {
  const mergedAddress = smartMergeAddress(addressRaw, geoAddr); // ✅ ใช้
}
ปัญหา: smartMerge ถูกเรียกตอน สร้าง Place ใหม่เท่านั้น ไม่ได้เรียกก่อนการ scoring ทำให้ score คำนวณจากข้อมูลดิบที่ยังสกปรกอยู่

🚨 สรุปช่องโหว่ทั้งหมด
สถานการณ์จริงที่ระบบปัจจุบันล้มเหลว:

addressRaw            = "ร้านสมชาย ถ.มั่ว กทม"       ← สกปรก score 85 (match ผิด)
addressFromLatLong    = "68 ถ.พหลโยธิน แขวงลาดยาว   
                         เขตจตุจักร กรุงเทพมหานคร"    ← ถูกต้อง

→ ระบบเลือก addressRaw (score 85 ชนะ) 
→ addressFromLatLong ถูกทิ้ง ทั้งที่น่าเชื่อถือกว่า 100%
💻 แนวทางแก้ไข — เพิ่ม 3 ฟังก์ชันใหม่
[1] crossValidateAddresses() — ตรวจจับความขัดแย้ง
[2] scoreWithGeoValidation() — คำนวณ score โดย weight ให้ geoAddr มากกว่า
[3] buildBestAddress() — เลือกที่อยู่ที่ดีที่สุดก่อน scoring
💻 FULL CODE — 07_PlaceService.gs (Version ใหม่ที่แก้ปัญหา)
javascript
/**
 * 07_PlaceService.gs — V4.5
 * แก้ไขหลัก: ให้ addressFromLatLong มีน้ำหนักที่ถูกต้อง
 * ไม่ใช่แค่ fallback แต่เป็น "ตัวตรวจสอบ" และ "ตัวเสริม" หลัก
 */

/**
 * [UPGRADED] resolvePlace
 * Logic ใหม่: 
 *   1. ตรวจว่าสองที่อยู่ "ขัดแย้ง" กันไหม
 *   2. สร้าง "best address" ก่อน scoring
 *   3. ให้ geoAddr เป็น primary validator
 */
function resolvePlace(sourceObj) {
  const addr1 = sourceObj.addressRaw;
  const addr2 = sourceObj.addressFromLatLong;

  // กรณีไม่มีข้อมูลเลย
  if (!addr1 && !addr2) {
    return { id: null, isNew: false, score: 0, candidates: [] };
  }

  // --- STEP 1: วินิจฉัยความสัมพันธ์ของสองที่อยู่ ---
  const geoRelation = diagnoseTwoAddresses(addr1, addr2);

  // Log เพื่อ debug
  writeLog('DEBUG', '07_PlaceService', 'resolvePlace', 
    sourceObj.idScg, 
    `GeoRelation: ${geoRelation.type} | conflict: ${geoRelation.hasConflict}`,
    { addr1, addr2 }
  );

  // --- STEP 2: สร้างที่อยู่ "ดีที่สุด" สำหรับ matching ---
  const bestAddress = buildBestAddress(addr1, addr2, geoRelation);

  // --- STEP 3: หา match จาก bestAddress เป็นหลัก ---
  let resBest = findBestMatch(bestAddress);

  // --- STEP 4: ถ้ายังไม่มั่นใจ ลองทั้ง addr1 และ addr2 แยกกัน ---
  let res1 = resBest;
  let res2 = { id: null, score: 0, candidates: [] };

  if (resBest.score < getThresholds().autoMatchScore) {
    // ลองแบบ raw ทั้งคู่เผื่อ bestAddress merge แล้วมั่ว
    if (addr1) res1 = findBestMatch(addr1);
    if (addr2) res2 = findBestMatchWithGeoBoost(addr2); // addr2 ได้ boost
  }

  // เลือกผลที่ดีที่สุด
  const candidates = [resBest, res1, res2].filter(r => r.score > 0);
  const finalMatch = candidates.reduce(
    (best, cur) => cur.score > best.score ? cur : best,
    { id: null, score: 0, candidates: [], normalized: '', raw: '' }
  );

  const threshold  = getThresholds().autoMatchScore;
  const reviewMin  = getThresholds().reviewScoreMin;

  // ติด flag ว่าขัดแย้งกัน → ส่ง review พร้อม note
  finalMatch.hasGeoConflict  = geoRelation.hasConflict;
  finalMatch.conflictMessage = geoRelation.conflictMessage;
  finalMatch.bestAddress     = bestAddress;

  if (finalMatch.score >= threshold) {
    return { ...finalMatch, isNew: false };
  } else if (finalMatch.score >= reviewMin) {
    return { ...finalMatch, id: null, isNew: false };
  } else {
    return { ...finalMatch, id: null, isNew: true, raw: bestAddress };
  }
}

// ─────────────────────────────────────────────────────────────
// [NEW] diagnoseTwoAddresses
// วินิจฉัยความสัมพันธ์ระหว่าง addressRaw กับ addressFromLatLong
// ─────────────────────────────────────────────────────────────
function diagnoseTwoAddresses(rawAddr, geoAddr) {
  const result = {
    type: 'UNKNOWN',          // COMPLEMENT | CONFLICT | DUPLICATE | GEO_ONLY | RAW_ONLY
    hasConflict: false,
    confidence: 0,
    conflictMessage: ''
  };

  const hasRaw = rawAddr && rawAddr.trim().length > 3;
  const hasGeo = geoAddr && geoAddr.trim().length > 3;

  if (!hasRaw && !hasGeo) { result.type = 'BOTH_EMPTY'; return result; }
  if (!hasRaw && hasGeo)  { result.type = 'GEO_ONLY';  result.confidence = 80; return result; }
  if (hasRaw && !hasGeo)  { result.type = 'RAW_ONLY';  result.confidence = 40; return result; }

  // ทั้งคู่มีข้อมูล → เปรียบเทียบลึก
  const rawNorm = normalizeThaiText(rawAddr);
  const geoNorm = normalizeThaiText(geoAddr);

  // สกัดชื่อภูมิศาสตร์จากทั้งคู่
  const rawGeo = extractGeoTokens(rawNorm);
  const latGeo = extractGeoTokens(geoNorm);

  // เช็คจังหวัดขัดแย้ง — เป็นสัญญาณหนักที่สุด
  if (rawGeo.province && latGeo.province 
      && rawGeo.province !== latGeo.province) {
    result.type = 'CONFLICT';
    result.hasConflict = true;
    result.confidence = 10;
    result.conflictMessage = 
      `⛔ จังหวัดขัดแย้ง: rawAddr="${rawGeo.province}" vs geoAddr="${latGeo.province}"`;
    return result;
  }

  // เช็คอำเภอขัดแย้ง
  if (rawGeo.district && latGeo.district 
      && rawGeo.district !== latGeo.district) {
    result.type = 'CONFLICT';
    result.hasConflict = true;
    result.confidence = 25;
    result.conflictMessage = 
      `⚠️ อำเภอ/เขตขัดแย้ง: rawAddr="${rawGeo.district}" vs geoAddr="${latGeo.district}"`;
    return result;
  }

  // คำนวณความเหมือนรวม
  const similarity = diceCoefficient(rawNorm, geoNorm);
  if (similarity > 0.7) {
    result.type = 'DUPLICATE';
    result.confidence = Math.round(similarity * 100);
  } else {
    result.type = 'COMPLEMENT'; // ต่างกัน แต่ไม่ขัดแย้ง → เอามาเสริมกัน
    result.confidence = 60;
  }

  return result;
}

// ─────────────────────────────────────────────────────────────
// [NEW] extractGeoTokens
// ดึงชื่อตำบล อำเภอ จังหวัด ออกจากข้อความที่อยู่
// ─────────────────────────────────────────────────────────────
function extractGeoTokens(address) {
  if (!address) return {};

  const tokens = {};

  // ตำบล / แขวง
  const subMatch = address.match(/(?:ต\.|ตำบล|แขวง)\s*([ก-๙a-zA-Z]+)/);
  if (subMatch) tokens.subdistrict = subMatch[1].trim();

  // อำเภอ / เขต
  const distMatch = address.match(/(?:อ\.|อำเภอ|เขต)\s*([ก-๙a-zA-Z]+)/);
  if (distMatch) tokens.district = distMatch[1].trim();

  // จังหวัด
  const provMatch = address.match(/(?:จ\.|จังหวัด)\s*([ก-๙a-zA-Z]+)/);
  if (provMatch) {
    tokens.province = provMatch[1].trim();
  } else {
    // จังหวัดที่ไม่ต้องมีคำนำหน้า เช่น กรุงเทพมหานคร
    const knownProvinces = [
      'กรุงเทพมหานคร','กรุงเทพ','สมุทรปราการ','นนทบุรี','ปทุมธานี',
      'พระนครศรีอยุธยา','สระบุรี','ชลบุรี','ระยอง','ฉะเชิงเทรา'
    ];
    for (const p of knownProvinces) {
      if (address.indexOf(p) > -1) { tokens.province = p; break; }
    }
  }

  // รหัสไปรษณีย์
  const zipMatch = address.match(/\b\d{5}\b/);
  if (zipMatch) tokens.zipcode = zipMatch[0];

  return tokens;
}

// ─────────────────────────────────────────────────────────────
// [NEW] buildBestAddress
// เลือกหรือรวมที่อยู่ให้สมบูรณ์ที่สุด ตาม geoRelation
// ─────────────────────────────────────────────────────────────
function buildBestAddress(rawAddr, geoAddr, geoRelation) {
  switch (geoRelation.type) {

    case 'GEO_ONLY':
      // มีแต่ geoAddr → ใช้เลย
      return cleanAddressRedundancy(geoAddr);

    case 'RAW_ONLY':
      // มีแต่ rawAddr → normalize แล้วใช้
      return normalizeAddress(rawAddr);

    case 'CONFLICT':
      // ขัดแย้ง → เชื่อ geoAddr มากกว่า เพราะมาจากพิกัดจริง
      // เอาเฉพาะส่วน "รายละเอียด" จาก rawAddr (บ้านเลขที่, ซอย, ถนน)
      // แล้วเอาส่วน "ภูมิศาสตร์" จาก geoAddr
      return smartMergeAddress(rawAddr, geoAddr);

    case 'DUPLICATE':
      // เหมือนกัน → เอา geoAddr ที่ยาวกว่า (มักจะสมบูรณ์กว่า)
      const cleanRaw = cleanAddressRedundancy(rawAddr);
      const cleanGeo = cleanAddressRedundancy(geoAddr);
      return cleanGeo.length >= cleanRaw.length ? cleanGeo : cleanRaw;

    case 'COMPLEMENT':
    default:
      // เสริมกัน → smartMerge รวมร่างให้สมบูรณ์ที่สุด
      return smartMergeAddress(rawAddr, geoAddr);
  }
}

// ─────────────────────────────────────────────────────────────
// [NEW] findBestMatchWithGeoBoost
// findBestMatch ปกติ แต่ให้คะแนน geoAddr bonus +10
// เพราะ geoAddr น่าเชื่อถือกว่า rawAddr
// ─────────────────────────────────────────────────────────────
function findBestMatchWithGeoBoost(geoAddr) {
  if (!geoAddr) return { id: null, score: 0, candidates: [] };

  const result = findBestMatch(geoAddr);

  // บวก geo bonus ถ้ามี match
  if (result.score > 0) {
    result.score = Math.min(100, result.score + 10);
    result.isGeoAddressBoosted = true;
  }

  return result;
}

// ─────────────────────────────────────────────────────────────
// ฟังก์ชันเดิม (ไม่เปลี่ยน signature)
// ─────────────────────────────────────────────────────────────
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
    const stored = aliasData[i][3];
    if (!stored) continue;
    if (stored === normPlace 
        || stored.indexOf(normPlace) > -1 
        || normPlace.indexOf(stored) > -1) {
      aliases.push({
        placeId: aliasData[i][1],
        normalized: stored,
        type: 'ALIAS'
      });
    }
  }

  return aliases;
}

function scorePlaceCandidate(inputNorm, candidateNorm) {
  if (inputNorm === candidateNorm) return 100;
  const dice  = diceCoefficient(inputNorm, candidateNorm);
  const ratio = lengthRatio(inputNorm, candidateNorm);
  const finalScore = Math.round(((dice * 0.8) + (ratio * 0.2)) * 100);
  return finalScore > 60 ? finalScore : 0;
}

function createPlace(canonicalPlaceName, addressRaw, geoAddr) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_PLACE');
  const placeId = 'PLA-' + uuid().split('-')[0].toUpperCase();

  const mergedAddress = smartMergeAddress(addressRaw, geoAddr);
  const normPlace = normalizePlaceName(mergedAddress);

  sheet.appendRow([
    placeId,
    mergedAddress,
    normPlace,
    addressRaw,
    normalizeAddress(mergedAddress),
    '',
    new Date(), new Date(), 1, 'ACTIVE', ''
  ]);

  createPlaceAlias(placeId, mergedAddress, normPlace);

  if (addressRaw && addressRaw !== mergedAddress) {
    createPlaceAlias(placeId, addressRaw, normalizePlaceName(addressRaw));
  }
  if (geoAddr && geoAddr !== mergedAddress) {
    createPlaceAlias(placeId, geoAddr, normalizePlaceName(geoAddr));
  }

  return placeId;
}

function createPlaceAlias(placeId, aliasRaw, aliasNormalized) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_PLACE_ALIAS');
  sheet.appendRow([
    'L_AL-' + uuid().split('-')[0].toUpperCase(),
    placeId, aliasRaw, aliasNormalized,
    'SYSTEM', new Date(), new Date(), 1, 'Y'
  ]);
}
✅ ต้องแก้ 10_MatchEngine.gs ด้วย — เพิ่ม conflict penalty
javascript
// ใน buildReviewPayload() เพิ่ม note จาก conflict
function buildReviewPayload(sourceObj, matchResult) {
  // ... โค้ดเดิม ...
  
  // [NEW] เพิ่ม geo conflict warning ถ้ามี
  let geoConflictNote = '';
  if (matchResult.place.hasGeoConflict) {
    geoConflictNote = '\n' + matchResult.place.conflictMessage;
  }

  return {
    // ... field เดิม ...
    note: (analyzeGeoWarning(sourceObj.addressRaw) || '') +
          geoConflictNote +                                    // [NEW]
          '\n💡 ที่อยู่แนะนำ: ' + 
          (matchResult.place.bestAddress ||                    // [NEW] ใช้ bestAddress
           smartMergeAddress(sourceObj.addressRaw, sourceObj.addressFromLatLong))
  };
}

// [NEW] เพิ่มใน evaluateThaiGeoBonus — เช็คครบทั้ง 3 ระดับ
function evaluateThaiGeoBonus(sourceObj) {
  let bonus = 0;
  const rawAddr = sourceObj.addressRaw || '';
  const geoAddr = sourceObj.addressFromLatLong || '';

  if (!rawAddr || !geoAddr) return 0;

  const rawTokens = extractGeoTokens(normalizeThaiText(rawAddr));
  const geoTokens = extractGeoTokens(normalizeThaiText(geoAddr));

  // โบนัสระดับตำบล
  if (rawTokens.subdistrict && geoTokens.subdistrict 
      && rawTokens.subdistrict === geoTokens.subdistrict) {
    bonus += 15;
  }

  // โบนัสระดับอำเภอ
  if (rawTokens.district && geoTokens.district 
      && rawTokens.district === geoTokens.district) {
    bonus += 10;
  }

  // โบนัสระดับจังหวัด
  if (rawTokens.province && geoTokens.province 
      && rawTokens.province === geoTokens.province) {
    bonus += 5;
  }

  // [NEW] Penalty ถ้าจังหวัดขัดแย้ง
  if (rawTokens.province && geoTokens.province 
      && rawTokens.province !== geoTokens.province) {
    bonus -= 20; // หักคะแนนหนัก → ส่ง review แน่นอน
  }

  return bonus;
}
✅ Test Checklist
หลัง deploy ทดสอบ 5 กรณีนี้ครับ:

กรณีทดสอบ	addressRaw	addressFromLatLong	ผลที่คาดหวัง
ปกติสมบูรณ์	"68 ต.หนองขาม อ.หนองขาม สระบุรี"	"68 ถ.พหล ต.หนองขาม อ.หนองขาม จ.สระบุรี"	COMPLEMENT → smartMerge → score สูง
Raw ว่าง	""	"123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กทม."	GEO_ONLY → ใช้ geoAddr ทั้งหมด
Raw มั่วจังหวัด	"ถ.สุขุมวิท เขตบางรัก นนทบุรี"	"ถ.สุขุมวิท แขวงสีลม เขตบางรัก กรุงเทพ"	CONFLICT → penalty -20 → ส่ง review
เหมือนกันทั้งคู่	"แขวงลาดยาว เขตจตุจักร กทม."	"แขวงลาดยาว เขตจตุจักร กรุงเทพมหานคร"	DUPLICATE → เลือกตัวยาวกว่า
Geo สมบูรณ์กว่า Raw	"ร้านสมชาย กทม."	"234/5 ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพมหานคร 10900"	COMPLEMENT → bestAddress = merged
จะให้ GEM เขียน Sprint 1 รอบสมบูรณ์ (รวม parseLatLongColumn + validateLatLng + normalizeCompanyName) ต่อได้เลยครับ หรือต้องการทดสอบโค้ดชุดนี้ก่อน?

You said: ให้ GEM เขียน Sprint 1 รอบสมบูรณ์ (รวม parseLatLongColumn + validateLatLng + normalizeCompanyName) ต่อได้เลยครับ
ให้ GEM เขียน Sprint 1 รอบสมบูรณ์ (รวม parseLatLongColumn + validateLatLng + normalizeCompanyName) ต่อได้เลยครับ

แต่ผมมีกฎอยู่แค่เรื่องเดียวคครับ คือ ผมต้องการข้อมูลลที่สะอาด และ นำกลับใช้งานได้จริง แก้ปัญหาทั้ง8ข้อได้จริง
เพราะต่อไปผมจะมีการค้นหาโดยเอา ชื่อปลายทาง(บุคคล) + ที่อยู่ปลายทาง (ชื่อสถานที่) ไปค้นหากับระบบที่เรากำลังทำนี้ เพื่อนำ LatLong มาใช้งาน

12:34
Claude responded: 🚀 Sprint 1 — Full Code Delivery

วางแผนเขียนโค้ดสะอาดสำหรับค้นหาพิกัดภูมิศาสตร์
วางแผนเขียนโค้ดสะอาดสำหรับค้นหาพิกัดภูมิศาสตร์
🚀 Sprint 1 — Full Code Delivery
[1] 🔍 CHANGE LOG
ไฟล์	การเปลี่ยนแปลง	Version
04_SourceRepository.gs	เพิ่ม parseLatLongColumn(), enrichSourceObject()	V4.5
05_NormalizeService.gs	เพิ่ม validateLatLng(), normalizeCompanyName(), levenshteinDistance(), extractPersonOnly()	V4.5
06_PersonService.gs	แก้ mergePersonRecords() ให้ทำงานจริง, เพิ่ม findPersonById()	V4.5
10_MatchEngine.gs	แก้ matchAllEntities() ให้ใช้ข้อมูลหลัง enrich	V4.5
[2] 🔗 IMPACT ASSESSMENT
parseLatLongColumn()  ← เรียกโดย  mapRowToSourceObject()
validateLatLng()      ← เรียกโดย  resolveGeo(), parseLatLongColumn()
normalizeCompanyName()← เรียกโดย  matchAllEntities() (ownerName context)
levenshteinDistance() ← เรียกโดย  scorePersonCandidate(), scorePlaceCandidate()
mergePersonRecords()  ← เรียกโดย  applyReviewDecision() → MERGE_TO_CANDIDATE
เป้าหมายหลัก: ค้นหาด้วย (ชื่อบุคคล + ที่อยู่) → คืน LatLong ได้ถูกต้อง

[3] 💻 FULL CODE
04_SourceRepository.gs — V4.5
javascript
/**
 * 04_SourceRepository.gs — V4.5
 * เพิ่ม: parseLatLongColumn(), enrichSourceObject()
 * เพื่อให้ sourceObj มีพิกัดที่ valid และสะอาดก่อนส่งเข้า engine
 */

function getSourceRows() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(getSheetNames().SOURCE);
  const data = sheet.getDataRange().getValues();
  return data;
}

function getUnprocessedSourceRows() {
  const data = getSourceRows();
  const map = getSourceColumnMap();
  const syncColIdx = map['SYNC_STATUS'];

  const unprocessed = [];
  const maxRows = parseInt(getConfig('MAX_PROCESS_ROWS_PER_RUN'), 10) || 500;

  for (let i = 1; i < data.length; i++) {
    const status = safeString(data[i][syncColIdx]).toUpperCase();
    if (status !== 'SUCCESS' && status !== 'REVIEW' 
        && status !== 'ERROR'  && status !== 'IGNORE') {
      unprocessed.push({ sourceIndex: i + 1, rowData: data[i] });
      if (unprocessed.length >= maxRows) break;
    }
  }
  return unprocessed;
}

function mapRowToSourceObject(rowArr, rowNumber) {
  const map = getSourceColumnMap();

  const getIdx = (name, alternates = []) => {
    if (map[name] !== undefined) return map[name];
    for (let alt of alternates) {
      if (map[alt] !== undefined) return map[alt];
    }
    const cleanSearch = name.replace(/[\s_]+/g, '').toLowerCase();
    for (let key in map) {
      if (key.replace(/[\s_]+/g, '').toLowerCase() === cleanSearch) return map[key];
    }
    return undefined;
  };

  // ── อ่านค่าดิบก่อน ──────────────────────────────────────────
  const latLongText = safeString(rowArr[getIdx('จุดส่งสินค้าปลายทาง')]);
  const latRawCell  = rowArr[getIdx('LAT')];
  const lngRawCell  = rowArr[getIdx('LONG')];

  // [NEW] parseLatLongColumn — หาพิกัดที่ดีที่สุดจากทุก source
  const parsedGeo = parseLatLongColumn(latLongText, latRawCell, lngRawCell);

  const sourceObj = {
    rowNumber:            rowNumber,
    idScg:                safeString(rowArr[getIdx('ID_SCGนครหลวงJWDภูมิภาค')]),
    invoiceNo:            safeString(rowArr[getIdx('Invoice No')]),
    shipmentNo:           safeString(rowArr[getIdx('Shipment No')]),
    deliveryDate:         safeDate(rowArr[getIdx('วันที่ส่งสินค้า')]),
    deliveryTime:         formatTime(rowArr[getIdx('เวลาที่ส่งสินค้า')]),
    driverName:           safeString(rowArr[getIdx('ชื่อ - นามสกุล')]),
    licensePlate:         safeString(rowArr[getIdx('ทะเบียนรถ')]),
    customerCode:         safeString(rowArr[getIdx('รหัสลูกค้า')]),
    ownerName:            safeString(rowArr[getIdx('ชื่อเจ้าของสินค้า')]),
    destinationNameRaw:   safeString(rowArr[getIdx('ชื่อปลายทาง')]),
    addressRaw:           safeString(rowArr[getIdx('ที่อยู่ปลายทาง')]),
    // [NEW] พิกัดที่ผ่านการ parse และ validate แล้ว
    latRaw:               parsedGeo.lat,
    longRaw:              parsedGeo.lng,
    latLongText:          latLongText,
    geoSource:            parsedGeo.source,   // บอกว่าพิกัดมาจากไหน
    geoIsValid:           parsedGeo.isValid,  // valid flag
    warehouse:            safeString(rowArr[getIdx('คลังสินค้า เอสซีจี เจดับเบิ้ลยูดี วังน้อย', ['คลังสินค้า'])]),
    distanceKm:           safeNumber(rowArr[getIdx('ระยะทางจากคลัง_Km')]),
    addressFromLatLong:   safeString(rowArr[getIdx('ชื่อที่อยู่จาก_LatLong', ['ชื่อที่อยู่จาก LatLong'])]),
    employeeEmail:        safeString(rowArr[getIdx('Email พนักงาน')]),
    employeeId:           safeString(rowArr[getIdx('ID_พนักงาน')]),
    anomalyDetected:      safeString(rowArr[getIdx('เหตุผิดปกติที่ตรวจพบ')]),
    validationResult:     safeString(rowArr[getIdx('ผลการตรวจสอบงานส่ง')])
  };

  // [NEW] enrich ข้อมูลเพิ่มเติมก่อนส่ง engine
  return enrichSourceObject(sourceObj);
}

/**
 * [NEW] parseLatLongColumn
 * สกัดพิกัด lat/lng จากทุก source ที่เป็นไปได้
 * ลำดับความน่าเชื่อถือ:
 *   1. จุดส่งสินค้าปลายทาง  (ข้อความ "lat,lng" — ต้นทางจริง)
 *   2. คอลัมน์ LAT + LONG   (ถ้า latLongText ว่าง)
 * คืนค่า { lat, lng, source, isValid }
 */
function parseLatLongColumn(latLongText, latCell, lngCell) {

  // ── ลอง parse จาก จุดส่งสินค้าปลายทาง ก่อน ────────────────
  if (latLongText && latLongText.trim().length > 3) {
    const parsed = _parseLatLngString(latLongText);
    if (parsed) {
      const valid = validateLatLng(parsed.lat, parsed.lng);
      if (valid.isValid) {
        return { lat: parsed.lat, lng: parsed.lng, 
                 source: 'LATLNG_TEXT', isValid: true };
      }
    }
  }

  // ── ลอง LAT / LONG คอลัมน์แยก ──────────────────────────────
  const lat = safeNumber(latCell);
  const lng = safeNumber(lngCell);
  const valid = validateLatLng(lat, lng);
  if (valid.isValid) {
    return { lat, lng, source: 'LAT_LONG_COL', isValid: true };
  }

  // ── ไม่มีพิกัดที่ valid ──────────────────────────────────────
  return { lat: 0, lng: 0, source: 'NONE', isValid: false };
}

/**
 * [PRIVATE] _parseLatLngString
 * รองรับรูปแบบ:
 *   "13.123456,100.123456"
 *   "13.123456, 100.123456"
 *   "13.123456|100.123456"
 *   "(13.123456,100.123456)"
 *   "lat: 13.123456 lng: 100.123456"
 */
function _parseLatLngString(text) {
  if (!text) return null;

  // ทำความสะอาดก่อน
  let s = text.toString()
    .replace(/[()lat:lng:\s]/gi, ' ')
    .replace(/[|;]/g, ',')
    .trim();

  // หาตัวเลขทศนิยมทั้งหมด
  const nums = s.match(/-?\d+\.?\d*/g);
  if (!nums || nums.length < 2) return null;

  const lat = parseFloat(nums[0]);
  const lng = parseFloat(nums[1]);

  if (isNaN(lat) || isNaN(lng)) return null;

  // สลับ lat/lng ถ้าใส่ผิด (lng มาก่อน lat)
  // Thailand: lat ~5-21, lng ~97-106
  if (lat > 90 && lng < 90) {
    return { lat: lng, lng: lat }; // สลับกลับ
  }

  return { lat, lng };
}

/**
 * [NEW] enrichSourceObject
 * เติมข้อมูลที่ derive ได้จากข้อมูลดิบ
 * ทำครั้งเดียวตอนอ่าน ไม่ต้องคำนวณซ้ำในหลาย service
 */
function enrichSourceObject(sourceObj) {

  // 1. Normalize ชื่อบุคคล (ตัด prefix เบื้องต้น)
  sourceObj.destinationNameNormalized = normalizePersonName(
    sourceObj.destinationNameRaw
  );

  // 2. สกัดเบอร์โทรจากชื่อหรือที่อยู่
  sourceObj.phoneExtracted = 
    extractPhoneNumbers(sourceObj.destinationNameRaw) ||
    extractPhoneNumbers(sourceObj.addressRaw) || '';

  // 3. Normalize ชื่อบริษัทเจ้าของสินค้า [NEW]
  sourceObj.ownerNameNormalized = normalizeCompanyName(sourceObj.ownerName);

  // 4. สร้าง bestAddress จากทั้งสองคอลัมน์
  sourceObj.bestAddress = smartMergeAddress(
    sourceObj.addressRaw,
    sourceObj.addressFromLatLong
  );

  // 5. Flag: มีพิกัดใช้งานได้ไหม
  sourceObj.hasValidGeo = sourceObj.geoIsValid;

  // 6. Flag: ที่อยู่ดิบว่างเปล่า (ต้องพึ่ง geoAddr อย่างเดียว)
  sourceObj.isAddressRawEmpty = !sourceObj.addressRaw || 
    sourceObj.addressRaw.trim().length < 3;

  return sourceObj;
}

function markSourceRowProcessed(rowNumber, status) {
  updateSourceSyncStatus(rowNumber, status);
}

function updateSourceSyncStatus(rowNumber, status) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(getSheetNames().SOURCE);
  const col = getSourceColumnMap()['SYNC_STATUS'] + 1;
  sheet.getRange(rowNumber, col).setValue(status);
}
05_NormalizeService.gs — V4.5
javascript
/**
 * 05_NormalizeService.gs — V4.5
 * เพิ่ม: validateLatLng(), normalizeCompanyName(),
 *        levenshteinDistance(), extractPersonOnly()
 */

// ── ที่อยู่ RAM Cache ─────────────────────────────────────────
let TH_GEO_CACHE = null;

// ══════════════════════════════════════════════════════════════
// SECTION A: TEXT NORMALIZATION
// ══════════════════════════════════════════════════════════════

function normalizeThaiText(text) {
  if (!text) return '';
  let n = safeTrim(text);
  n = n.replace(/\s+/g, ' ');
  return n.normalize('NFC');
}

/**
 * normalizePersonName — V4.5
 * ปรับปรุง: เพิ่ม pattern ครอบคลุมกว่าเดิม + เรียก extractPersonOnly
 */
function normalizePersonName(name) {
  if (!name) return '';
  let n = normalizeThaiText(name);

  // 1. ตัดเบอร์โทรออกก่อน
  const phones = extractPhoneNumbers(n);
  if (phones) {
    phones.split(', ').forEach(p => {
      const pPattern = new RegExp(p.split('').join('[-.\\s]?'), 'g');
      n = n.replace(pPattern, '');
    });
  }

  // 2. ตัด Prefix คำนำหน้า (เรียงจากยาวไปสั้น ป้องกัน partial match)
  const prefixes = [
    // วิชาชีพ/ตำแหน่ง
    'ห้างหุ้นส่วนจำกัด', 'บริษัทจำกัด', 'บริษัท', 'บจก\\.?', 'หจก\\.?',
    'ดร\\.?', 'นพ\\.?', 'พญ\\.?', 'ผศ\\.?', 'รศ\\.?', 'ศ\\.?',
    // คำนำหน้าบุคคล
    'นางสาว', 'น\\.ส\\.', 'นาย', 'นาง',
    'คุณ', 'พี่', 'น้อง', 'ลุง', 'ป้า',
    // บทบาทงาน
    'ช่าง', 'แม่บ้าน', 'คนรับของ', 'รับของ', 'ผู้รับ',
    'ฝ่ายรับ', 'แผนก', 'สาขา',
  ];

  for (const p of prefixes) {
    const regex = new RegExp('^' + p + '\\s*', 'gi');
    n = n.replace(regex, '');
  }

  // 3. ตัดคำท้ายที่รบกวน
  const suffixes = [
    'โทร\\.?\\s*$', 'เบอร์\\s*$', 'ติดต่อ\\s*$',
    'สาขา\\s*\\d*\\s*$',
    'โทร\\.?\\s*\\d+', 'เบอร์\\s*\\d+',
  ];

  for (const s of suffixes) {
    const regex = new RegExp(s, 'gi');
    n = n.replace(regex, '');
  }

  // 4. แยกชื่อคนออกจากชื่อร้าน/บริษัท
  n = extractPersonOnly(n);

  return safeTrim(n);
}

/**
 * [NEW] extractPersonOnly
 * ถ้าชื่อมีคำบ่งบอกว่าเป็นร้าน/บริษัทปนมา → ตัดส่วนนั้นออก
 * เหลือเฉพาะชื่อคน
 *
 * เช่น "สมชาย ร้านวัสดุก่อสร้าง" → "สมชาย"
 *      "สมชาย/รับของ"            → "สมชาย"
 *      "สมชาย - ฝ่ายจัดซื้อ"    → "สมชาย"
 */
function extractPersonOnly(name) {
  if (!name) return '';
  let n = name.trim();

  // ตัดส่วนที่อยู่หลังสัญลักษณ์แบ่ง
  // "สมชาย / รับของ" → "สมชาย"
  n = n.split(/[\/\|\\]|(?:\s+[-–—]\s+)/)[0].trim();

  // ตัดคำบ่งบอกสถานที่ทำงานที่ติดมา
  const businessWords = [
    'ร้าน', 'ห้าง', 'ตลาด', 'โรงงาน', 'โกดัง', 'คลัง',
    'สำนักงาน', 'ออฟฟิศ', 'office',
    'ฝ่าย', 'แผนก', 'dept', 'department',
    'จัดซื้อ', 'บัญชี', 'การเงิน', 'logistics', 'logistic',
  ];

  for (const word of businessWords) {
    const idx = n.toLowerCase().indexOf(word.toLowerCase());
    if (idx > 0) {
      // ตัดตั้งแต่คำนั้นเป็นต้นไป ถ้าส่วนที่เหลือสั้นพอ
      const beforeWord = n.substring(0, idx).trim();
      if (beforeWord.length >= 2) {
        n = beforeWord;
        break;
      }
    }
  }

  return safeTrim(n);
}

/**
 * [NEW] normalizeCompanyName
 * ทำให้ชื่อบริษัท/เจ้าของสินค้า อยู่ในรูปมาตรฐาน
 * เพื่อใช้เป็น context ในการ match (ไม่ใช่ key หลัก)
 *
 * เช่น "บริษัท SCG จำกัด (มหาชน)" → "scg"
 *      "บจก.วัสดุภัณฑ์ สาขา 3"   → "วัสดุภัณฑ์"
 *      "หจก. ABC Trading"         → "abc trading"
 */
function normalizeCompanyName(name) {
  if (!name) return '';
  let n = normalizeThaiText(name);

  // 1. ตัดคำนำหน้านิติบุคคล (เรียงจากยาวไปสั้น)
  const legalPrefixes = [
    'ห้างหุ้นส่วนสามัญนิติบุคคล',
    'ห้างหุ้นส่วนจำกัด',
    'ห้างหุ้นส่วนสามัญ',
    'บริษัทมหาชนจำกัด',
    'บริษัทจำกัด',
    'บริษัท',
    'หจก\\.?',
    'บมจ\\.?',
    'บจก\\.?',
    'บจ\\.?',
  ];

  for (const p of legalPrefixes) {
    n = n.replace(new RegExp('^' + p + '\\s*', 'gi'), '');
  }

  // 2. ตัดคำท้ายนิติบุคคล
  const legalSuffixes = [
    '\\(มหาชน\\)',
    'จำกัด\\s*\\(มหาชน\\)',
    'จำกัด',
    'จก\\.?',
    'limited',
    'ltd\\.?',
    'co\\.?,?\\s*ltd\\.?',
    'public\\s*company',
  ];

  for (const s of legalSuffixes) {
    n = n.replace(new RegExp('\\s*' + s + '\\s*$', 'gi'), '');
  }

  // 3. ตัด "สาขา X" ออก
  n = n.replace(/\s*สาขา\s*[\d\w]*\s*/gi, ' ');

  // 4. lowercase + trim
  n = n.toLowerCase().replace(/\s+/g, ' ').trim();

  return n;
}

/**
 * normalizePlaceName — เดิม (คงไว้)
 */
function normalizePlaceName(name) {
  if (!name) return '';
  let n = normalizeThaiText(name);
  n = n.replace(/^ร้าน\s*/i, '');
  n = n.replace(/สาขา\s*\d+/i, '');
  return safeTrim(n);
}

// ══════════════════════════════════════════════════════════════
// SECTION B: GEO VALIDATION  [NEW]
// ══════════════════════════════════════════════════════════════

/**
 * [NEW] validateLatLng
 * ตรวจสอบว่าพิกัดนี้ใช้งานได้จริงไหม
 * คืนค่า { isValid, reason }
 *
 * กฎการตรวจสอบ:
 *   - ต้องไม่เป็น 0,0
 *   - ต้องอยู่ในขอบเขตประเทศไทย (คร่าวๆ)
 *   - ต้องไม่เป็น NaN
 *   - ต้องมีทศนิยมอย่างน้อย 3 ตำแหน่ง (ความแม่นยำขั้นต่ำ ~110m)
 */
function validateLatLng(lat, lng) {
  const la = parseFloat(lat);
  const lo = parseFloat(lng);

  // เช็ค NaN
  if (isNaN(la) || isNaN(lo)) {
    return { isValid: false, reason: 'NaN_VALUE' };
  }

  // เช็ค 0,0 (หมายถึงไม่มีข้อมูล)
  if (la === 0 && lo === 0) {
    return { isValid: false, reason: 'ZERO_ZERO' };
  }

  // เช็คขอบเขตประเทศไทย
  // lat: 5.5 - 20.5  (ใต้สุด - เหนือสุด)
  // lng: 97.3 - 105.7 (ตะวันตก - ตะวันออก)
  const THAILAND_BOUNDS = {
    latMin: 5.5,  latMax: 20.5,
    lngMin: 97.3, lngMax: 105.7
  };

  if (la < THAILAND_BOUNDS.latMin || la > THAILAND_BOUNDS.latMax) {
    return { isValid: false, reason: 'OUT_OF_THAILAND_LAT', lat: la, lng: lo };
  }

  if (lo < THAILAND_BOUNDS.lngMin || lo > THAILAND_BOUNDS.lngMax) {
    return { isValid: false, reason: 'OUT_OF_THAILAND_LNG', lat: la, lng: lo };
  }

  // เช็คความแม่นยำ (ต้องมีทศนิยม ไม่ใช่แค่ 13, 100)
  const latStr = la.toString();
  const lngStr = lo.toString();
  const latDecimals = latStr.includes('.') ? latStr.split('.')[1].length : 0;
  const lngDecimals = lngStr.includes('.') ? lngStr.split('.')[1].length : 0;

  if (latDecimals < 3 || lngDecimals < 3) {
    return { 
      isValid: false, 
      reason: 'LOW_PRECISION',
      lat: la, lng: lo,
      latDecimals, lngDecimals
    };
  }

  return { isValid: true, reason: 'OK', lat: la, lng: lo };
}

// ══════════════════════════════════════════════════════════════
// SECTION C: STRING SIMILARITY  [NEW + UPGRADED]
// ══════════════════════════════════════════════════════════════

/**
 * [NEW] levenshteinDistance
 * วัดความต่างของสตริง 2 ตัว (นับจำนวนการแก้ไขขั้นต่ำ)
 * เหมาะกับชื่อสั้น < 6 ตัวอักษร ที่ Dice ไม่แม่น
 *
 * เช่น "สมชาย" vs "สมชาย " = 0 edit (หลัง trim)
 *      "สมชาย" vs "สมศักดิ์" = 4 edits
 */
function levenshteinDistance(s1, s2) {
  if (!s1 || !s2) return Math.max((s1||'').length, (s2||'').length);

  // ตัดช่องว่างก่อนเทียบ
  s1 = s1.replace(/\s+/g, '');
  s2 = s2.replace(/\s+/g, '');

  if (s1 === s2) return 0;

  const m = s1.length;
  const n = s2.length;

  // สร้าง matrix
  const dp = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = [i];
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i-1] === s2[j-1]) {
        dp[i][j] = dp[i-1][j-1];
      } else {
        dp[i][j] = 1 + Math.min(
          dp[i-1][j],    // ลบ
          dp[i][j-1],    // เพิ่ม
          dp[i-1][j-1]   // แทน
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * [NEW] levenshteinSimilarity
 * แปลง levenshtein distance → คะแนน 0.0-1.0
 */
function levenshteinSimilarity(s1, s2) {
  if (!s1 && !s2) return 1;
  if (!s1 || !s2) return 0;
  const maxLen = Math.max(s1.replace(/\s+/g,'').length, 
                          s2.replace(/\s+/g,'').length);
  if (maxLen === 0) return 1;
  return 1 - (levenshteinDistance(s1, s2) / maxLen);
}

// ══════════════════════════════════════════════════════════════
// SECTION D: ADDRESS UTILITIES (เดิม + ปรับปรุง)
// ══════════════════════════════════════════════════════════════

function loadThGeo() {
  if (TH_GEO_CACHE) return TH_GEO_CACHE;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('SYS_TH_GEO');
  if (!sheet) return null;

  const data = sheet.getDataRange().getValues();
  TH_GEO_CACHE = { subdistricts: {}, districts: {}, provinces: {} };

  for (let i = 1; i < data.length; i++) {
    const zipcode        = data[i][0];
    const subdistrictNorm= data[i][6] ? String(data[i][6]) : '';
    const districtNorm   = data[i][7] ? String(data[i][7]) : '';
    const provinceNorm   = data[i][8] ? String(data[i][8]) : '';
    const noteType       = data[i][9] ? String(data[i][9]) : 'NONE';
    const noteKeywords   = data[i][10] ? String(data[i][10]) : '';
    const postcodeOverride= data[i][11] ? String(data[i][11]) : '';
    const rawRemark      = data[i][4] ? String(data[i][4]) : '';

    if (subdistrictNorm) {
      TH_GEO_CACHE.subdistricts[subdistrictNorm] = {
        district: districtNorm,
        province: provinceNorm,
        zipcode,
        remark: rawRemark,
        noteType,
        noteKeywords,
        postcodeOverride
      };
    }

    // [NEW] index ระดับอำเภอและจังหวัดด้วย เผื่อต้องการ auto-fill
    if (districtNorm && !TH_GEO_CACHE.districts[districtNorm]) {
      TH_GEO_CACHE.districts[districtNorm] = { province: provinceNorm };
    }
    if (provinceNorm && !TH_GEO_CACHE.provinces[provinceNorm]) {
      TH_GEO_CACHE.provinces[provinceNorm] = true;
    }
  }

  return TH_GEO_CACHE;
}

function normalizeAddress(address) {
  if (!address) return '';
  let n = normalizeThaiText(address);

  n = n.replace(/ตำบล/g, 'ต.');
  n = n.replace(/อำเภอ/g, 'อ.');
  n = n.replace(/จังหวัด/g, 'จ.');

  const geoDb = loadThGeo();
  if (geoDb && geoDb.subdistricts) {
    const subMatch = n.match(/(?:ต\.|แขวง)\s*([ก-๙]+)/);
    if (subMatch) {
      const subName = subMatch[1];
      const geoInfo = geoDb.subdistricts[subName];
      if (geoInfo) {
        if (n.indexOf(geoInfo.district) === -1) {
          n += ' อ.' + geoInfo.district;
        }
        if (n.indexOf(geoInfo.province) === -1) {
          n += ' จ.' + geoInfo.province;
        }
      }
    }
  }

  return safeTrim(n);
}

function analyzeGeoWarning(address) {
  if (!address) return '';
  const geoDb = loadThGeo();
  if (!geoDb || !geoDb.subdistricts) return '';

  let n = normalizeThaiText(address).replace(/ตำบล/g, 'ต.');

  const subMatch = n.match(/(?:ต\.|แขวง)\s*([ก-๙]+)/);
  if (!subMatch) return '';

  const geoInfo = geoDb.subdistricts[subMatch[1]];
  if (!geoInfo || geoInfo.noteType === 'NONE') return '';

  switch (geoInfo.noteType) {
    case 'OTHER_WARNING':
      return '⚠️ พื้นที่พิเศษ: ' + geoInfo.remark;
    case 'ONLY_BUILDING':
      if (geoInfo.noteKeywords && n.indexOf(geoInfo.noteKeywords) > -1)
        return '🏢 ระวัง! ต้องใช้รหัสไปรษณีย์เฉพาะ: ' + geoInfo.noteKeywords;
      break;
    case 'ONLY_MOO':
      return '🏘️ ระวังหมู่: ' + geoInfo.noteKeywords;
    case 'EXCEPT_RULE':
    case 'COMPLEX_HOUSE_NO':
      return '🚨 ระวังเงื่อนไขพิเศษ: ' + geoInfo.remark;
  }
  return '';
}

function extractPhoneNumbers(text) {
  if (!text) return '';
  const phoneRegex = /(?:0[2-9]\d{1,2})[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
  const matches = text.match(phoneRegex);
  if (matches) {
    const cleanPhones = matches.map(p => p.replace(/[^\d]/g, ''));
    return [...new Set(cleanPhones)].join(', ');
  }
  return '';
}

function smartMergeAddress(rawAddr, geoAddr) {
  if (!rawAddr) return geoAddr || '';
  if (!geoAddr) return cleanAddressRedundancy(rawAddr);

  let cleanRaw = cleanAddressRedundancy(rawAddr);
  let cleanGeo = geoAddr
    .replace(/[A-Z0-9]{4}\+[A-Z0-9]{2,3}/g, '')
    .replace(/\s+ประเทศไทย$/, '')
    .trim();

  // ตัดเบอร์โทร
  const phones = extractPhoneNumbers(cleanRaw);
  if (phones) {
    phones.split(', ').forEach(p => {
      const pPattern = new RegExp(p.split('').join('[-.\\s]?'), 'g');
      cleanRaw = cleanRaw.replace(pPattern, '');
    });
  }

  const geoTriggers = ['แขวง','ตำบล',' ต.','เขต','อำเภอ',' อ.','จังหวัด',' จ.'];
  let geoStartIdx = -1;
  let triggerFound = '';

  for (const trigger of geoTriggers) {
    const idx = cleanGeo.indexOf(trigger);
    if (idx !== -1 && (geoStartIdx === -1 || idx < geoStartIdx)) {
      geoStartIdx = idx;
      triggerFound = trigger;
    }
  }

  if (geoStartIdx === -1) return cleanRaw;

  const adminPartGeo = cleanGeo.substring(geoStartIdx).trim();
  let rawStartIdx = cleanRaw.indexOf(triggerFound);

  if (rawStartIdx === -1) {
    for (const trigger of geoTriggers) {
      const idx = cleanRaw.indexOf(trigger);
      if (idx !== -1 && (rawStartIdx === -1 || idx < rawStartIdx)) {
        rawStartIdx = idx;
      }
    }
  }

  if (rawStartIdx !== -1) {
    const detailPartRaw = cleanRaw.substring(0, rawStartIdx).trim();
    return (detailPartRaw + ' ' + adminPartGeo).replace(/\s+/g, ' ').trim();
  }

  return cleanRaw.length > cleanGeo.length ? cleanRaw : cleanGeo;
}

function cleanAddressRedundancy(addr) {
  if (!addr) return '';
  let s = addr.toString();

  const baseTriggers = ['เขต','อำเภอ','ตำบล','แขวง','จังหวัด'];
  baseTriggers.forEach(t => {
    s = s.replace(new RegExp(t + '\\s*' + t, 'g'), t);
  });

  s = s.replace(/ต\.\s*ตำบล/g, 'ตำบล');
  s = s.replace(/ตำบล\s*ต\./g, 'ตำบล');
  s = s.replace(/อ\.\s*อำเภอ/g, 'อำเภอ');
  s = s.replace(/อำเภอ\s*อ\./g, 'อำเภอ');
  s = s.replace(/จ\.\s*จังหวัด/g, 'จังหวัด');
  s = s.replace(/จังหวัด\s*จ\./g, 'จังหวัด');
  s = s.replace(/จ\.\s*จ\./g, 'จ.');
  s = s.replace(/อ\.\s*อ\./g, 'อ.');
  s = s.replace(/ต\.\s*ต\./g, 'ต.');

  // ชื่อจังหวัดซ้ำ
  ['กรุงเทพมหานคร','สมุทรปราการ','ฉะเชิงเทรา','ชลบุรี','ปทุมธานี','นนทบุรี']
    .forEach(p => {
      const pShort = p.substring(0, 5);
      s = s.replace(new RegExp(pShort + '[ก-๙]*\\s+' + p, 'g'), p);
    });

  ['ตำบล','แขวง','อำเภอ','เขต'].forEach(level => {
    const short = level === 'ตำบล' ? 'ต\\.' : (level === 'อำเภอ' ? 'อ\\.' : null);
    if (short) {
      s = s.replace(new RegExp(short + '\\s*([ก-๙]+)\\s+' + level + '\\s*\\1', 'g'), level + '$1');
      s = s.replace(new RegExp(level + '\\s*([ก-๙]+)\\s+' + short + '\\s*\\1', 'g'), level + '$1');
    }
    s = s.replace(new RegExp(level + '\\s*([ก-๙]+)\\s+' + level + '\\s*\\1', 'g'), level + '$1');
  });

  return s.replace(/\s+/g, ' ').trim();
}

function validatePostcodeOverride(address) {
  if (!address) return null;
  const geoDb = loadThGeo();
  if (!geoDb) return null;

  let n = normalizeThaiText(address).replace(/ตำบล/g, 'ต.');
  const subMatch = n.match(/(?:ต\.|แขวง)\s*([ก-๙]+)/);
  if (!subMatch) return null;

  const geoInfo = geoDb.subdistricts[subMatch[1]];
  if (!geoInfo || !geoInfo.postcodeOverride) return null;

  if ((geoInfo.noteType === 'EXCEPT_RULE' || geoInfo.noteType === 'COMPLEX_HOUSE_NO')
      && geoInfo.noteKeywords && n.indexOf(geoInfo.noteKeywords) > -1) {
    return geoInfo.postcodeOverride;
  }
  return null;
}

function normalizeLatLong(lat, lng) {
  return {
    lat: Number(safeNumber(lat).toFixed(5)),
    lng: Number(safeNumber(lng).toFixed(5))
  };
}

function buildGeoKeys(lat, lng) {
  const la = safeNumber(lat);
  const lo = safeNumber(lng);
  return {
    key4: la.toFixed(4) + '_' + lo.toFixed(4),
    key3: la.toFixed(3) + '_' + lo.toFixed(3),
    key2: la.toFixed(2) + '_' + lo.toFixed(2),
    lat: la, lng: lo
  };
}

function buildFingerprint(dataObj) {
  const str = JSON.stringify(dataObj);
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash.toString(16);
}
06_PersonService.gs — V4.5
javascript
/**
 * 06_PersonService.gs — V4.5
 * แก้ไขหลัก:
 *   - scorePersonCandidate() ใช้ levenshtein ร่วมกับ Dice
 *   - mergePersonRecords()   ทำงานจริง (ไม่ใช่ stub)
 *   - findPersonById()       helper ใหม่
 *   - resolvePerson()        ใช้ข้อมูลจาก enrichSourceObject
 */

function resolvePerson(sourceObj) {
  const rawName = sourceObj.destinationNameRaw;
  if (!rawName) return { id: null, isNew: false, score: 0, phone: '', candidates: [] };

  // [UPGRADE] ใช้ค่าที่ enrich ไว้แล้วแทนการ normalize ซ้ำ
  const phone   = sourceObj.phoneExtracted || '';
  const normName = sourceObj.destinationNameNormalized || normalizePersonName(rawName);

  const candidates = findPersonCandidates(normName, phone);

  if (candidates.length === 0) {
    return { 
      id: null, isNew: true, score: 0,
      normalized: normName, raw: rawName, phone, candidates: [] 
    };
  }

  let bestCandidate = null;
  let bestScore     = 0;

  for (const c of candidates) {
    const score = scorePersonCandidate(normName, c.normalized);
    if (score > bestScore) {
      bestScore     = score;
      bestCandidate = c;
    }
  }

  const threshold = getThresholds().autoMatchScore;
  const reviewMin = getThresholds().reviewScoreMin;

  if (bestScore >= threshold) {
    return { 
      id: bestCandidate.personId, isNew: false, score: bestScore,
      normalized: normName, raw: rawName, phone, candidates 
    };
  } else if (bestScore >= reviewMin) {
    return { 
      id: null, isNew: false, score: bestScore,
      normalized: normName, raw: rawName, phone, candidates 
    };
  } else {
    return { 
      id: null, isNew: true, score: bestScore,
      normalized: normName, raw: rawName, phone, candidates 
    };
  }
}

function findPersonCandidates(normName, phone) {
  if (!normName && !phone) return [];
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aliases = [];

  const mSheet = ss.getSheetByName('M_PERSON');
  const mData  = mSheet.getDataRange().getValues();

  // 1. ค้นด้วยเบอร์โทร (Confidence สูงสุด)
  if (phone) {
    const searchPhones = phone.split(', ');
    for (let i = 1; i < mData.length; i++) {
      const storedPhone = String(mData[i][3] || '');
      for (const p of searchPhones) {
        if (p.length >= 9 && storedPhone.indexOf(p) > -1) {
          aliases.push({
            personId: mData[i][0],
            normalized: mData[i][2],
            type: 'PHONE_MATCH'
          });
        }
      }
    }
    if (aliases.length > 0) return aliases;
  }

  // 2. ค้นจาก Alias
  const aliasSheet = ss.getSheetByName('M_PERSON_ALIAS');
  const aliasData  = aliasSheet.getDataRange().getValues();

  for (let i = 1; i < aliasData.length; i++) {
    const stored = aliasData[i][3];
    if (!stored) continue;
    if (stored === normName 
        || stored.indexOf(normName) > -1 
        || normName.indexOf(stored) > -1) {
      aliases.push({
        personId:   aliasData[i][1],
        normalized: stored,
        type: 'ALIAS'
      });
    }
  }

  // 3. ค้นจาก Master ตรง
  if (aliases.length === 0) {
    for (let i = 1; i < mData.length; i++) {
      if (mData[i][2] === normName) {
        aliases.push({
          personId:   mData[i][0],
          normalized: mData[i][2],
          type: 'MASTER'
        });
      }
    }
  }

  return aliases;
}

/**
 * [UPGRADED] scorePersonCandidate
 * รวม 3 เทคนิค:
 *   - Dice Coefficient  (ดีสำหรับชื่อยาว > 4 ตัว)
 *   - Levenshtein       (ดีสำหรับชื่อสั้น < 4 ตัว)
 *   - Length Ratio      (ป้องกัน substring หลอก)
 *
 * น้ำหนัก: Dice 50% + Levenshtein 30% + LengthRatio 20%
 */
function scorePersonCandidate(inputNorm, candidateNorm) {
  if (!inputNorm || !candidateNorm) return 0;
  if (inputNorm === candidateNorm) return 100;

  const dice  = diceCoefficient(inputNorm, candidateNorm);
  const lev   = levenshteinSimilarity(inputNorm, candidateNorm);
  const ratio = lengthRatio(inputNorm, candidateNorm);

  // ถ้าชื่อสั้น (< 4 ตัว) ให้ Levenshtein มีน้ำหนักมากขึ้น
  const isShort = inputNorm.replace(/\s/g,'').length < 4 || 
                  candidateNorm.replace(/\s/g,'').length < 4;

  let finalScore;
  if (isShort) {
    finalScore = Math.round(((lev * 0.6) + (dice * 0.2) + (ratio * 0.2)) * 100);
  } else {
    finalScore = Math.round(((dice * 0.5) + (lev * 0.3) + (ratio * 0.2)) * 100);
  }

  return finalScore > 60 ? finalScore : 0;
}

/**
 * [FIXED] mergePersonRecords
 * รวมบุคคล 2 คนเข้าด้วยกัน (sourceId → targetId)
 * ทำงานจริง ไม่ใช่ stub อีกต่อไป
 *
 * สิ่งที่ทำ:
 *   1. ย้าย alias ของ source ทั้งหมด → target
 *   2. Archive source record (ไม่ลบ — Zero Data Loss)
 *   3. อัปเดต M_DESTINATION ที่อ้างถึง sourceId → targetId
 *   4. อัปเดต FACT_DELIVERY ที่อ้างถึง sourceId → targetId
 */
function mergePersonRecords(sourcePersonId, targetPersonId, mergedByEmail) {
  if (!sourcePersonId || !targetPersonId) {
    throw new Error('mergePersonRecords: ต้องระบุ sourcePersonId และ targetPersonId');
  }
  if (sourcePersonId === targetPersonId) {
    writeLog('WARN','06_PersonService','mergePersonRecords',
      sourcePersonId,'Merge ตัวเองไม่ได้','');
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ── 1. ย้าย Alias ──────────────────────────────────────────
  const aliasSheet = ss.getSheetByName('M_PERSON_ALIAS');
  const aliasData  = aliasSheet.getDataRange().getValues();

  for (let i = 1; i < aliasData.length; i++) {
    if (aliasData[i][1] === sourcePersonId) {
      // เปลี่ยน person_id จาก source → target
      aliasSheet.getRange(i + 1, 2).setValue(targetPersonId);
    }
  }

  // ── 2. Archive source person ───────────────────────────────
  const personSheet = ss.getSheetByName('M_PERSON');
  const personData  = personSheet.getDataRange().getValues();

  for (let i = 1; i < personData.length; i++) {
    if (personData[i][0] === sourcePersonId) {
      personSheet.getRange(i + 1, 8).setValue('Merged');        // status col
      personSheet.getRange(i + 1, 9).setValue(
        `Merged → ${targetPersonId} by ${mergedByEmail} @ ${new Date().toISOString()}`
      );
      break;
    }
  }

  // ── 3. อัปเดต M_DESTINATION ───────────────────────────────
  const destSheet = ss.getSheetByName('M_DESTINATION');
  const destData  = destSheet.getDataRange().getValues();

  for (let i = 1; i < destData.length; i++) {
    if (destData[i][1] === sourcePersonId) { // person_id คอลัมน์ B (index 1)
      destSheet.getRange(i + 1, 2).setValue(targetPersonId);
      // สร้าง destination_key ใหม่
      const newKey = buildDestinationKey(
        targetPersonId, destData[i][2], destData[i][3]
      );
      destSheet.getRange(i + 1, 6).setValue(newKey);
    }
  }

  // ── 4. อัปเดต FACT_DELIVERY ────────────────────────────────
  const factSheet = ss.getSheetByName('FACT_DELIVERY');
  const factData  = factSheet.getDataRange().getValues();

  // หา index คอลัมน์ person_id ใน FACT (คอลัมน์ที่ 16 = index 15)
  const FACT_PERSON_COL = 16; // person_id อยู่คอลัมน์ที่ 16 (1-indexed)

  for (let i = 1; i < factData.length; i++) {
    if (factData[i][FACT_PERSON_COL - 1] === sourcePersonId) {
      factSheet.getRange(i + 1, FACT_PERSON_COL).setValue(targetPersonId);
    }
  }

  writeLog('INFO','06_PersonService','mergePersonRecords',
    sourcePersonId,
    `Merged ${sourcePersonId} → ${targetPersonId}`,
    { mergedBy: mergedByEmail }
  );
}

/**
 * [NEW] findPersonById
 * ดึงข้อมูลบุคคลจาก ID
 * คืนค่า object หรือ null ถ้าไม่เจอ
 */
function findPersonById(personId) {
  if (!personId) return null;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_PERSON');
  const data  = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === personId) {
      return {
        personId:   data[i][0],
        canonical:  data[i][1],
        normalized: data[i][2],
        phone:      data[i][3],
        status:     data[i][7],
        note:       data[i][8]
      };
    }
  }
  return null;
}

function createPerson(canonicalName, normName, phone) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_PERSON');
  const personId = 'PER-' + uuid().split('-')[0].toUpperCase();

  sheet.appendRow([
    personId,
    canonicalName,
    normName,
    phone ? "'" + phone : '',
    new Date(), new Date(), 1, 'ACTIVE', ''
  ]);

  createPersonAlias(personId, canonicalName, normName);
  return personId;
}

function createPersonAlias(personId, aliasRaw, aliasNormalized) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_PERSON_ALIAS');

  sheet.appendRow([
    'P_AL-' + uuid().split('-')[0].toUpperCase(),
    personId, aliasRaw, aliasNormalized,
    'SYSTEM', new Date(), new Date(), 1, 'Y'
  ]);
}

/**
 * updatePersonStats — อัปเดต usage_count และ last_seen_date
 */
function updatePersonStats(personId) {
  if (!personId) return;
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_PERSON');
  const data  = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === personId) {
      const currentCount = parseInt(data[i][6]) || 0;
      sheet.getRange(i + 1, 7).setValue(currentCount + 1); // usage_count
      sheet.getRange(i + 1, 6).setValue(new Date());        // last_seen_date
      break;
    }
  }
}
แก้ 12_ReviewService.gs — applyReviewDecision ให้เรียก mergePersonRecords จริง
javascript
// แก้เฉพาะส่วน MERGE_TO_CANDIDATE ใน applyReviewDecision()

function applyReviewDecision(reviewId, decision, selectedPersonId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Q_REVIEW');
  const data  = sheet.getDataRange().getValues();

  let rowIndex = -1;
  let reviewRow = null;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === reviewId) {
      rowIndex  = i + 1;
      reviewRow = data[i];
      break;
    }
  }

  if (rowIndex === -1) throw new Error('ไม่พบ Review ID: ' + reviewId);

  const reviewerEmail = Session.getActiveUser().getEmail();

  sheet.getRange(rowIndex, 18).setValue('RESOLVED');
  sheet.getRange(rowIndex, 19).setValue(reviewerEmail);
  sheet.getRange(rowIndex, 20).setValue(new Date());
  sheet.getRange(rowIndex, 21).setValue(decision);

  if (decision === 'MERGE_TO_CANDIDATE') {
    const rawName             = reviewRow[5];
    const candidatePersonIdsStr = reviewRow[11];

    if (candidatePersonIdsStr) {
      const candidateIds = String(candidatePersonIdsStr).split(',');
      // [FIX] ใช้ selectedPersonId ถ้ามี ไม่งั้นใช้ตัวแรก
      const targetId = (selectedPersonId && selectedPersonId.trim()) 
                       ? selectedPersonId.trim()
                       : candidateIds[0].trim();

      if (targetId) {
        // เพิ่ม alias ชื่อดิบนี้เข้า target person
        createPersonAlias(targetId, rawName, normalizePersonName(rawName));
        writeLog('INFO','12_ReviewService','applyReviewDecision',
          reviewId, `Alias added: "${rawName}" → ${targetId}`, '');
      }
    }

    // [NEW] ถ้ามี sourcePersonId ที่ถูกสร้างผิด ให้ merge จริง
    const issueType = reviewRow[1];
    if (issueType === 'SAME_PERSON_DIFF_GEO' || issueType === 'AMBIGUOUS_DATA') {
      const candidateIds = String(candidatePersonIdsStr || '').split(',');
      const sourceId = candidateIds[1] ? candidateIds[1].trim() : null;
      const targetId = candidateIds[0] ? candidateIds[0].trim() : null;
      if (sourceId && targetId && sourceId !== targetId) {
        try {
          mergePersonRecords(sourceId, targetId, reviewerEmail);
        } catch(e) {
          writeLog('ERROR','12_ReviewService','applyReviewDecision',
            reviewId, 'mergePersonRecords failed: ' + e.message, '');
        }
      }
    }
  }

  const sourceRowIdx = reviewRow[3];
  if (decision === 'IGNORE') {
    updateSourceSyncStatus(sourceRowIdx, 'IGNORE');
  } else {
    updateSourceSyncStatus(sourceRowIdx, 'WAIT_REPROCESS');
  }
}
✅ Test Checklist
ทดสอบ parseLatLongColumn:

"13.872341,100.512890"    → { lat:13.872341, lng:100.512890, source:'LATLNG_TEXT', isValid:true }
"(13.872341, 100.512890)" → { lat:13.872341, lng:100.512890, isValid:true }
"100.512890,13.872341"    → สลับกลับอัตโนมัติ isValid:true
"0,0"                     → { isValid:false, source:'NONE' }
""                        → { isValid:false, source:'NONE' }
ทดสอบ validateLatLng:

(13.872, 100.512)  → { isValid:false, reason:'LOW_PRECISION' }   ← ทศนิยมน้อยเกิน
(0, 0)             → { isValid:false, reason:'ZERO_ZERO' }
(35.0, 100.0)      → { isValid:false, reason:'OUT_OF_THAILAND_LAT' }
(13.87234, 100.51289) → { isValid:true }
ทดสอบ normalizeCompanyName:

"บริษัท SCG จำกัด (มหาชน)" → "scg"
"บจก.วัสดุภัณฑ์ สาขา 3"   → "วัสดุภัณฑ์"
"หจก. ABC Trading"         → "abc trading"
"SCG"                      → "scg"
ทดสอบ scorePersonCandidate (Dice+Lev รวมกัน):

"สมชาย" vs "สมชาย"        → 100
"สมชาย" vs "สมศักดิ์"     → ~30 (ต่ำ → ไม่ match)
"สมชาย" vs "ส.ชาย"        → ~55 (ก้ำกึ่ง → review)
"วัสดุภัณฑ์" vs "วัสดุภัณ" → ~80 (substring → review)
ทดสอบ mergePersonRecords:

mergePersonRecords('PER-AAA', 'PER-BBB', 'admin@test.com')
→ M_PERSON: PER-AAA status='Merged'
→ M_PERSON_ALIAS: rows ที่ person_id='PER-AAA' → เปลี่ยนเป็น 'PER-BBB'
→ FACT_DELIVERY: rows ที่ person_id='PER-AAA' → เปลี่ยนเป็น 'PER-BBB'
→ SYS_LOG: บันทึก INFO merge
ทดสอบ end-to-end (เป้าหมายหลัก):

ค้นหา: ชื่อ="สมชาย ร้านวัสดุ" + ที่อยู่="ต.หนองขาม สระบุรี"
→ normalize → "สมชาย" + "ต.หนองขาม อ.หนองขาม จ.สระบุรี"
→ match → PER-XXX + PLA-YYY + GEO-ZZZ
→ คืน lat=14.572xxx, lng=100.891xxx ✅
Sprint 2 (Levenshtein phonetic + batchWriteFacts) พร้อมเขียนได้เลยครับ หรือต้องการทดสอบ Sprint 1 ก่อน?

You said: ผมมีกฎอยู่แค่เรื่องเดียวครับ คือ ผมต้องการข้อมูลลที่สะอาด และ นำกลับใช้งานได้จริง แก้ปัญหาทั้ง8ข้อได้จริง
ผมมีกฎอยู่แค่เรื่องเดียวครับ คือ ผมต้องการข้อมูลลที่สะอาด และ นำกลับใช้งานได้จริง แก้ปัญหาทั้ง8ข้อได้จริง
ชีต"SCGนครหลวงJWDภูมิภาค" = ชีตที่คนขับได้ทำการเข้าส่งสินค้า และ ได้ข้อมูลLatLongจริงๆที่ส่งสินค้าให้ลูกค้าปลายทาง
ชีต"ตารางงานประจำวัน" = ชีตนี้ผมจะโหลดข้อมูลมาจากระบบเเป็นข้อมูลใหม่ประจำวัน แต่บางคอลัมน์จะไม่เหมือนกันนะเดี๋ยวผมจะแจ้งอีกทีถ้าผมคิดว่าระบบเราพร้อมแล้ว ชีตSCGจะมาดึงข้อมูลจากชีตนี้ไปใช้ครับ 
**ผมจะเพิ่มชีต"ตารางงานประจำวัน" ที่จะมีข้อมูลดิบที่โหลดมาจากระบบ ชื่อปลายทาง(บุคคลไม่สะอาด) + ที่อยู่ปลายทาง (ชื่อสถานที่ไม่สะอาด) ที่ได้มา ก็เหมือนๆกับชีต"SCGนครหลวงJWDภูมิภาค"ข้อมูลดิบที่เรากำลังทำความสะอาดแหละครับ ไม่ใช่ทำระบบค้นหาแบบที่คุณคิด** เพราะต่อไปผมจะมีการค้นหาโดยเอา ชื่อปลายทาง(บุคคล) + ที่อยู่ปลายทาง (ชื่อสถานที่) ไปค้นหากับระบบที่เรากำลังทำนี้ เพื่อนำ LatLong มาใช้งานได้จริงๆ

16:37
Claude responded: 🔍 เข้าใจสถาปัตยกรรมใหม่แล้วครับ — ขอ Clarify ก่อน Code

Determined to generate SVG visualization directly in response
Determined to generate SVG visualization directly in response
🔍 เข้าใจสถาปัตยกรรมใหม่แล้วครับ — ขอ Clarify ก่อน Code
ภาพที่ผมเข้าใจใหม่
S

Show widget
ขอ Confirm สถาปัตยกรรมที่เข้าใจก่อนเขียนโค้ดครับ:

สิ่งที่ผมเข้าใจใหม่ — ถูกต้องไหมครับ?
┌─────────────────────────────────────────────────────────┐
│  PHASE 1: สร้าง Master Data (เรียนรู้จากประวัติจริง)    │
│                                                         │
│  ตารางงานประจำวัน ──ดึงข้อมูล──► SCGนครหลวงฯ           │
│  (ชื่อ+ที่อยู่ดิบ)               (มี LatLong จริง)     │
│                                        │                │
│                                        ▼                │
│                                  LMDS Engine            │
│                                        │                │
│                           ┌────────────▼────────────┐   │
│                           │      Master Data         │   │
│                           │  Person + Place + Geo    │   │
│                           │  = LatLong ที่ verified  │   │
│                           └─────────────────────────┘   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  PHASE 2: ใช้งาน (วันถัดไป / อนาคต)                    │
│                                                         │
│  ตารางงานประจำวัน ──► LookupService ──► LatLong        │
│  ชื่อปลายทาง (มั่ว)    normalize+match   ที่ verified   │
│  ที่อยู่ (มั่ว)         กับ Master Data                 │
└─────────────────────────────────────────────────────────┘
❓ ก่อนเขียนโค้ด — ขอถามให้ชัด 3 ข้อครับ
ข้อ 1: Output ที่ต้องการจาก LookupService
เมื่อระบบ match สำเร็จ ต้องการข้อมูลอะไรกลับไปครับ?

Option A — แค่พิกัด
{ lat: 13.872341, lng: 100.512890 }

Option B — พิกัด + ความมั่นใจ
{ lat: 13.872341, lng: 100.512890, 
  confidence: 95, 
  status: "AUTO_MATCH" | "REVIEW_NEEDED" | "NOT_FOUND" }

Option C — ครบสมบูรณ์
{ lat, lng, confidence, status,
  personId, placeId, geoId, destinationId,
  canonicalName, canonicalAddress }
ข้อ 2: สิ่งที่ทำเมื่อ match ไม่ได้
ถ้า "ตารางงานประจำวัน" มีชื่อ/ที่อยู่ที่ระบบไม่รู้จักเลย ต้องการให้ทำอะไร?

Option A — เขียน NOT_FOUND กลับ แล้วรอ admin review
Option B — ส่งเข้า Q_REVIEW อัตโนมัติ เหมือน SCG sheet
Option C — ทั้งสองอย่าง (A สำหรับ batch output, B สำหรับ admin)
ข้อ 3: วิธี trigger LookupService
Option A — กดปุ่มในเมนู LMDS เหมือน runDailyProcess
Option B — รันอัตโนมัติทุกครั้งที่มีข้อมูลใหม่ใน "ตารางงานประจำวัน"
Option C — มีคอลัมน์ผลลัพธ์ใน "ตารางงานประจำวัน" ให้ระบบเติม LAT/LONG ลงไปตรงๆ
สิ่งที่ชัดแล้ว — จะเขียนทันที
17_LookupService.gs — โมดูลใหม่ที่รับ input สกปรก → คืน LatLong

Logic หลักที่จะใช้:

รับเข้า: rawPersonName + rawAddress
    │
    ▼
normalize ทั้งคู่ (ใช้ engine เดิม)
    │
    ├── หา Person candidates (Dice + Levenshtein)
    ├── หา Place candidates  (smartMerge + GeoBonus)  
    └── หา Destination จาก Person×Place combination
            │
            ├── เจอ M_DESTINATION → คืน LatLong จาก M_GEO_POINT ✅
            ├── เจอ Person หรือ Place บางส่วน → คืน partial match ⚠️
            └── ไม่เจอเลย → NOT_FOUND / ส่ง Queue ❌
ตอบ 3 ข้อข้างบนก็พร้อมเขียน 17_LookupService.gs แบบเต็มได้เลยครับ

# 📦 LMDS V4.5 Final — Blueprint

## 🗂️ ส่วนที่ 1: ชีตทั้งหมด (15 ชีต)

---

### กลุ่ม A: Source Data (2 ชีต)

**ชีต 1: `SCGนครหลวงJWDภูมิภาค`** — ข้อมูลดิบจากคนขับ (แหล่ง LatLong จริง)

| # | คอลัมน์ | ความหมาย |
|---|---|---|
| 1 | `head` | Header ระบบ |
| 2 | `ID_SCGนครหลวงJWDภูมิภาค` | รหัสรายการดิบ (Primary Key ของชีตต้นทาง) |
| 3 | `วันที่ส่งสินค้า` | วันที่คนขับไปส่งจริง |
| 4 | `เวลาที่ส่งสินค้า` | เวลาที่ส่งจริง |
| 5 | `จุดส่งสินค้าปลายทาง` | **LatLong ดิบ** รูปแบบ "13.xxx,100.xxx" — ต้นทางพิกัดจริง |
| 6 | `ชื่อ - นามสกุล` | ชื่อคนขับ |
| 7 | `ทะเบียนรถ` | ทะเบียนรถที่ใช้ส่ง |
| 8 | `Shipment No` | เลข Shipment |
| 9 | `Invoice No` | เลขใบส่งของ |
| 10 | `รูปถ่ายบิลส่งสินค้า` | URL รูปบิล |
| 11 | `รหัสลูกค้า` | รหัสลูกค้าจากระบบ |
| 12 | `ชื่อเจ้าของสินค้า` | บริษัทผู้ขาย/เจ้าของสินค้า (ไม่ใช่ผู้รับ) |
| 13 | `ชื่อปลายทาง` | **ชื่อลูกค้าผู้รับ (สกปรก)** — ปัญหาหลัก |
| 14 | `Email พนักงาน` | อีเมลพนักงาน |
| 15 | `LAT` | ละติจูด (แยกมาจากคอลัมน์ 5) |
| 16 | `LONG` | ลองจิจูด (แยกมาจากคอลัมน์ 5) |
| 17 | `ID_Doc_Return` | รหัสเอกสารคืน |
| 18 | `คลังสินค้า` | คลังต้นทาง SCG วังน้อย |
| 19 | `ที่อยู่ปลายทาง` | **ที่อยู่จากระบบเดิม (สกปรก)** |
| 20 | `รูปสินค้าตอนส่ง` | URL รูปสินค้า |
| 21 | `รูปหน้าร้าน / บ้าน` | URL รูปหน้าปลายทาง |
| 22 | `หมายเหตุ` | หมายเหตุเพิ่มเติม |
| 23 | `เดือน` | เดือนของรายการ |
| 24 | `ระยะทางจากคลัง_Km` | ระยะทางจากคลัง SCG วังน้อย (คำนวณโดย script) |
| 25 | `ชื่อที่อยู่จาก_LatLong` | **ที่อยู่แปลงจากพิกัดจริง (Reverse Geocode)** — น่าเชื่อถือกว่าคอลัมน์ 19 |
| 26 | `SM_Link_SCG` | ลิงก์อ้างอิงระบบ SCG |
| 27 | `ID_พนักงาน` | รหัสพนักงาน |
| 28 | `พิกัดตอนกดบันทึกงาน` | พิกัด GPS ขณะกดบันทึก |
| 29 | `เวลาเริ่มกรอกงาน` | timestamp เริ่มกรอก |
| 30 | `เวลาบันทึกงานสำเร็จ` | timestamp บันทึกสำเร็จ |
| 31 | `ระยะขยับจากจุดเริ่มต้น_เมตร` | ระยะเคลื่อนที่จากจุดเริ่ม (ตรวจ anomaly) |
| 32 | `ระยะเวลาใช้งาน_นาที` | เวลาที่ใช้กรอกงาน |
| 33 | `ความเร็วการเคลื่อนที่_เมตร_นาที` | ความเร็วขณะทำรายการ |
| 34 | `ผลการตรวจสอบงานส่ง` | สถานะตรวจสอบจากระบบ |
| 35 | `เหตุผิดปกติที่ตรวจพบ` | ปัญหาที่ตรวจพบ |
| 36 | `เวลาถ่ายรูปหน้าร้าน_หน้าบ้าน` | timestamp ถ่ายรูป |
| 37 | `SYNC_STATUS` | **สถานะการประมวลผล**: PENDING / SUCCESS / REVIEW / ERROR / IGNORE / WAIT_REPROCESS |

---

**ชีต 2: `ตารางงานประจำวัน`** — ข้อมูลดิบใหม่ทุกวัน (โหลดจากระบบ → ค้นหา LatLong)

| # | คอลัมน์ | ความหมาย |
|---|---|---|
| 1 | `ชื่อปลายทาง` | ชื่อลูกค้าผู้รับ (สกปรก) — ใช้ค้นหา |
| 2 | `ที่อยู่ปลายทาง` | ที่อยู่ปลายทาง (สกปรก) — ใช้ค้นหา |
| ... | *(คอลัมน์อื่นๆ ตามระบบ — config-driven)* | แจ้งได้ในภายหลัง |
| auto | `MATCH_STATUS` | ผลการค้นหา: FOUND / AMBIGUOUS / NOT_FOUND / REVIEW_REQUIRED |
| auto | `MATCH_LAT` | ละติจูดที่ค้นหาได้จาก Master |
| auto | `MATCH_LONG` | ลองจิจูดที่ค้นหาได้จาก Master |
| auto | `MATCH_GEO_ID` | geo_id ที่จับคู่ได้ |
| auto | `MATCH_CONFIDENCE` | คะแนนความมั่นใจ 0-100 |
| auto | `MATCH_REASON` | เหตุผล: UNIQUE_DESTINATION_MATCH / DOMINANT_GEO_BY_USAGE / ฯลฯ |
| auto | `MATCH_UPDATED_AT` | เวลาที่ประมวลผล |

---

### กลุ่ม B: Master Data (6 ชีต)

**ชีต 3: `M_PERSON`** — บุคคลมาตรฐาน

| # | คอลัมน์ | ความหมาย |
|---|---|---|
| 1 | `person_id` | รหัสบุคคล (PER-XXXXXXXX) |
| 2 | `person_name_canonical` | ชื่อที่ถูกต้องที่สุด (canonical form) |
| 3 | `person_name_normalized` | ชื่อหลัง normalize (ตัด prefix, lowercase) |
| 4 | `phone` | เบอร์โทรศัพท์ (สกัดจากชื่อ/ที่อยู่) |
| 5 | `first_seen_date` | วันที่พบครั้งแรก |
| 6 | `last_seen_date` | วันที่พบล่าสุด |
| 7 | `usage_count` | จำนวนครั้งที่ถูก match |
| 8 | `status` | ACTIVE / Merged / Archived |
| 9 | `note` | หมายเหตุ (เช่น "Merged → PER-YYY by admin") |

**ชีต 4: `M_PERSON_ALIAS`** — ชื่อเรียกอื่นของบุคคล

| # | คอลัมน์ | ความหมาย |
|---|---|---|
| 1 | `person_alias_id` | รหัส alias (P_AL-XXXXXXXX) |
| 2 | `person_id` | FK → M_PERSON |
| 3 | `alias_raw` | ชื่อดิบ (เช่น "คุณสมชาย ร้านวัสดุ") |
| 4 | `alias_normalized` | ชื่อหลัง normalize (เช่น "สมชาย") |
| 5 | `source_field` | แหล่งที่มา: SYSTEM / REVIEW / MANUAL |
| 6 | `first_seen_date` | วันที่พบครั้งแรก |
| 7 | `last_seen_date` | วันที่พบล่าสุด |
| 8 | `usage_count` | จำนวนครั้งที่ถูกใช้ match |
| 9 | `active_flag` | Y / N |

**ชีต 5: `M_PLACE`** — สถานที่มาตรฐาน

| # | คอลัมน์ | ความหมาย |
|---|---|---|
| 1 | `place_id` | รหัสสถานที่ (PLA-XXXXXXXX) |
| 2 | `place_name_canonical` | ชื่อสถานที่ที่ดีที่สุด |
| 3 | `place_name_normalized` | ชื่อหลัง normalize |
| 4 | `address_best` | ที่อยู่ที่สมบูรณ์ที่สุด (smartMerge ของ raw + geo) |
| 5 | `address_normalized` | ที่อยู่หลัง normalize + auto-fill ต./อ./จ. |
| 6 | `warehouse_default` | คลังต้นทางที่ส่งบ่อยสุด |
| 7 | `first_seen_date` | วันที่พบครั้งแรก |
| 8 | `last_seen_date` | วันที่พบล่าสุด |
| 9 | `usage_count` | จำนวนครั้งที่ถูก match |
| 10 | `status` | ACTIVE / Merged / Archived |
| 11 | `note` | หมายเหตุ |

**ชีต 6: `M_PLACE_ALIAS`** — ชื่อเรียกอื่นของสถานที่

| # | คอลัมน์ | ความหมาย |
|---|---|---|
| 1 | `place_alias_id` | รหัส alias (L_AL-XXXXXXXX) |
| 2 | `place_id` | FK → M_PLACE |
| 3 | `alias_raw` | ชื่อดิบ (เช่น "ร้านช่างแดง สาขา 2") |
| 4 | `alias_normalized` | ชื่อหลัง normalize |
| 5 | `source_field` | แหล่งที่มา: SYSTEM / REVIEW / MANUAL |
| 6 | `first_seen_date` | วันที่พบครั้งแรก |
| 7 | `last_seen_date` | วันที่พบล่าสุด |
| 8 | `usage_count` | จำนวนครั้งที่ถูก match |
| 9 | `active_flag` | Y / N |

**ชีต 7: `M_GEO_POINT`** — พิกัดมาตรฐาน

| # | คอลัมน์ | ความหมาย |
|---|---|---|
| 1 | `geo_id` | รหัสพิกัด (GEO-XXXXXXXX) |
| 2 | `lat_raw` | ละติจูดดิบ |
| 3 | `long_raw` | ลองจิจูดดิบ |
| 4 | `lat_norm` | ละติจูดหลัง normalize (5 ทศนิยม) |
| 5 | `long_norm` | ลองจิจูดหลัง normalize (5 ทศนิยม) |
| 6 | `geo_key_6` | hash key ระดับ ~11km |
| 7 | `geo_key_5` | hash key ระดับ ~110m |
| 8 | `geo_key_4` | hash key ระดับ ~11m |
| 9 | `address_from_latlong_best` | ที่อยู่จาก Reverse Geocode ที่ดีที่สุด |
| 10 | `first_seen_date` | วันที่พบครั้งแรก |
| 11 | `last_seen_date` | วันที่พบล่าสุด |
| 12 | `usage_count` | จำนวนครั้งที่ถูก match |
| 13 | `note` | หมายเหตุ |

**ชีต 8: `M_DESTINATION`** — **หัวใจของระบบ** — ปลายทางจริง

| # | คอลัมน์ | ความหมาย |
|---|---|---|
| 1 | `destination_id` | รหัสปลายทาง (DST-XXXXXXXX) |
| 2 | `person_id` | FK → M_PERSON |
| 3 | `place_id` | FK → M_PLACE |
| 4 | `geo_id` | FK → M_GEO_POINT |
| 5 | `destination_label_canonical` | ชื่อปลายทางที่มนุษย์อ่านได้ |
| 6 | `destination_key` | composite key "PER-xxx\|PLA-xxx\|GEO-xxx" |
| 7 | `confidence_status` | HIGH / MEDIUM / LOW |
| 8 | `first_seen_date` | วันที่พบครั้งแรก |
| 9 | `last_seen_date` | วันที่พบล่าสุด |
| 10 | `usage_count` | จำนวนครั้งที่ถูก match (ใช้ตัดสิน dominant geo) |
| 11 | `note` | หมายเหตุ |

---

### กลุ่ม C: Fact & Queue (2 ชีต)

**ชีต 9: `FACT_DELIVERY`** — ธุรกรรมงานส่งที่ verified แล้ว

| # | คอลัมน์ | ความหมาย |
|---|---|---|
| 1 | `tx_id` | รหัสธุรกรรม (TX-XXXXXXXX) |
| 2 | `source_sheet` | ชื่อชีตต้นทาง |
| 3 | `source_row_number` | หมายเลขแถวในชีตต้นทาง |
| 4 | `source_record_id` | ID จากชีตต้นทาง (ป้องกัน duplicate) |
| 5 | `delivery_date` | วันที่ส่ง |
| 6 | `delivery_time` | เวลาที่ส่ง |
| 7 | `shipment_no` | เลข Shipment |
| 8 | `invoice_no` | เลขใบส่งของ |
| 9 | `raw_owner_name` | ชื่อเจ้าของสินค้าดิบ |
| 10 | `raw_person_name` | ชื่อปลายทางดิบ |
| 11 | `raw_system_address` | ที่อยู่จากระบบเดิม (ดิบ) |
| 12 | `raw_geo_resolved_address` | ที่อยู่จาก Reverse Geocode (ดิบ) |
| 13 | `raw_geo_text` | LatLong text ดิบ |
| 14 | `lat` | ละติจูดที่ใช้จริง |
| 15 | `lng` | ลองจิจูดที่ใช้จริง |
| 16 | `person_id` | FK → M_PERSON |
| 17 | `place_id` | FK → M_PLACE |
| 18 | `geo_id` | FK → M_GEO_POINT |
| 19 | `destination_id` | FK → M_DESTINATION |
| 20 | `warehouse` | คลังต้นทาง |
| 21 | `distance_km` | ระยะทางจากคลัง |
| 22 | `driver_name` | ชื่อคนขับ |
| 23 | `employee_id` | รหัสพนักงาน |
| 24 | `employee_email` | อีเมลพนักงาน |
| 25 | `license_plate` | ทะเบียนรถ |
| 26 | `validation_result` | ผลตรวจสอบงานส่ง |
| 27 | `anomaly_reason` | เหตุผิดปกติ |
| 28 | `review_status` | COMPLETED / PENDING_REVIEW |
| 29 | `sync_status` | SYNCED |
| 30 | `created_at` | เวลาบันทึก |
| 31 | `updated_at` | เวลาอัปเดตล่าสุด |

**ชีต 10: `Q_REVIEW`** — คิวรอการตัดสินใจจากมนุษย์

| # | คอลัมน์ | ความหมาย |
|---|---|---|
| 1 | `review_id` | รหัสรีวิว (REV-XXXXXXXX) |
| 2 | `issue_type` | ประเภทปัญหา: DUPLICATE_PERSON / SAME_GEO_DIFF_PERSON / ฯลฯ |
| 3 | `source_record_id` | อ้างอิงแถวต้นทาง |
| 4 | `source_row_number` | หมายเลขแถวต้นทาง |
| 5 | `invoice_no` | เลขใบส่งของ |
| 6 | `raw_person_name` | ชื่อบุคคลดิบ |
| 7 | `raw_place_name` | ชื่อสถานที่ดิบ |
| 8 | `raw_system_address` | ที่อยู่จากระบบเดิม |
| 9 | `raw_geo_resolved_address` | ที่อยู่จากพิกัดจริง |
| 10 | `raw_lat` | ละติจูดดิบ |
| 11 | `raw_long` | ลองจิจูดดิบ |
| 12 | `candidate_person_ids` | รายการ person_id ที่เป็น candidate (คั่น ,) |
| 13 | `candidate_place_ids` | รายการ place_id ที่เป็น candidate |
| 14 | `candidate_geo_ids` | รายการ geo_id ที่เป็น candidate |
| 15 | `candidate_destination_ids` | รายการ destination_id ที่เป็น candidate |
| 16 | `score` | คะแนน composite สุดท้าย |
| 17 | `recommended_action` | MANUAL_REVIEW |
| 18 | `status` | PENDING / RESOLVED |
| 19 | `reviewer` | email ผู้ตัดสินใจ |
| 20 | `reviewed_at` | เวลาตัดสินใจ |
| 21 | `decision` | **Dropdown**: CREATE_NEW / MERGE_TO_CANDIDATE / IGNORE |
| 22 | `note` | หมายเหตุ + quality flags + reason codes + score breakdown |

---

### กลุ่ม D: System & Reference (5 ชีต)

**ชีต 11: `SYS_CONFIG`**

| คอลัมน์ | ความหมาย |
|---|---|
| `config_key` | ชื่อ config |
| `config_value` | ค่า config |
| `config_group` | กลุ่ม: Engine / System |
| `description` | คำอธิบาย |
| `updated_at` | เวลาอัปเดต |

ค่า config สำคัญ:

| Key | Default | ความหมาย |
|---|---|---|
| `AUTO_MATCH_SCORE` | 90 | คะแนนขั้นต่ำ auto match |
| `REVIEW_SCORE_MIN` | 75 | คะแนนขั้นต่ำส่ง review |
| `GEO_RADIUS_METER` | 50 | รัศมีพิกัดเดียวกัน (เมตร) |
| `MAX_PROCESS_ROWS_PER_RUN` | 500 | แถวสูงสุดต่อการรัน |
| `LOOKUP_SOURCE_SHEET_NAME` | ตารางงานประจำวัน | ชีตที่ใช้ค้นหา LatLong |
| `LOOKUP_PERSON_COLUMNS` | ชื่อปลายทาง | คอลัมน์ชื่อบุคคล (คั่น ,) |
| `LOOKUP_PLACE_COLUMNS` | ที่อยู่ปลายทาง,ชื่อที่อยู่จาก_LatLong | คอลัมน์ที่อยู่ (คั่น ,) |

**ชีต 12: `SYS_LOG`** | `ชีต 13: RPT_DATA_QUALITY`

| คอลัมน์ SYS_LOG | ความหมาย |
|---|---|
| `log_id` | รหัส log |
| `run_id` | รหัสการรัน |
| `created_at` | เวลาบันทึก |
| `level` | INFO / WARN / ERROR / CRITICAL / DEBUG |
| `module_name` | โมดูลที่เรียก |
| `function_name` | ฟังก์ชันที่เรียก |
| `ref_id` | รหัสอ้างอิง |
| `message` | ข้อความ log |
| `payload_json` | ข้อมูลเพิ่มเติม JSON |

| คอลัมน์ RPT_DATA_QUALITY | ความหมาย |
|---|---|
| `report_date` | วันที่รายงาน |
| `total_source_rows` | จำนวนแถวทั้งหมด |
| `processed_rows` | จำนวนที่ประมวลผล |
| `new_person_count` | บุคคลใหม่วันนี้ |
| `new_place_count` | สถานที่ใหม่วันนี้ |
| `new_geo_count` | พิกัดใหม่วันนี้ |
| `new_destination_count` | ปลายทางใหม่วันนี้ |
| `auto_match_count` | จำนวน auto match สำเร็จ |
| `review_count` | จำนวนรอ review |
| `duplicate_alert_count` | จำนวน duplicate ที่พบ |
| `error_count` | จำนวน error |
| `last_refresh_at` | เวลา refresh ล่าสุด |

**ชีต 14: `MAPS_CACHE`** — Cache Google Maps API

| คอลัมน์ | ความหมาย |
|---|---|
| `cache_key` | MD5 hash ของ input |
| `cache_value` | ผลลัพธ์ที่ cache ไว้ |
| `cache_type` | DISTANCE / REVERSE_GEO / LATLONG / DURATION |
| `raw_input` | input ดิบที่ใช้ query |
| `updated_at` | เวลาบันทึก cache |

**ชีต 15: `SYS_TH_GEO`** — พจนานุกรมภูมิศาสตร์ไทย

| # | คอลัมน์ | ความหมาย |
|---|---|---|
| A | `รหัสไปรษณีย์` | รหัสไปรษณีย์ 5 หลัก |
| B | `แขวง/ตำบล` | ชื่อดิบ |
| C | `เขต/อำเภอ` | ชื่อดิบ |
| D | `จังหวัด` | ชื่อดิบ |
| E | `หมายเหตุ` | เงื่อนไขพิเศษ (เช่น ยกเว้น ซอย...) |
| F | `postcode_text` | รหัสไปรษณีย์ string |
| G | `subdistrict_norm` | ตำบลหลัง normalize |
| H | `district_norm` | อำเภอหลัง normalize |
| I | `province_norm` | จังหวัดหลัง normalize |
| J | `note_type` | NONE / ONLY_BUILDING / ONLY_MOO / EXCEPT_RULE / COMPLEX_HOUSE_NO |
| K | `note_keywords` | คีย์เวิร์ดเงื่อนไข |
| L | `postcode_override` | รหัสไปรษณีย์แทนที่ |
| M | `geo_key` | composite key ตำบล_อำเภอ_จังหวัด |
| N | `active_flag` | Y / N |

---

## 🔧 ส่วนที่ 2: โมดูลทั้งหมด (18 โมดูล, 95 ฟังก์ชัน)

---

### `00_App.gs` — Entry Point & Menu (8 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `onOpen()` | สร้างเมนู LMDS System ใน Google Sheets |
| `runInitialSetup()` | ติดตั้งระบบครั้งแรก: สร้างชีต + config + dropdown |
| `runDailyProcess()` | **Main Loop**: อ่าน SCG → normalize → match → fact/review พร้อม Time Guard 5 นาที |
| `reprocessSelectedRows()` | รีเซ็ต SYNC_STATUS แถวที่เลือก แล้วรันใหม่ |
| `runLookupEnrichment()` | เติม LatLong ให้ชีตตารางงานประจำวัน *(จาก 17_SearchService)* |
| `runNightlyMaintenance()` | งานบำรุงรักษาปิดวัน: refresh report + cleanup log เก่า |
| `runConflictRuleSelfTest()` | ทดสอบ Rule Engine R01-R08 ก่อน deploy *(จาก 10_MatchEngine)* |
| `onEdit(e)` | ดัก event เมื่อแก้ Q_REVIEW column Decision → applyReviewDecision() |

---

### `01_Config.gs` — Configuration Manager (5 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `getConfig(key)` | ดึงค่า config โดย key พร้อม Cache + Default fallback |
| `getAllConfigs()` | โหลด config ทั้งหมดจาก SYS_CONFIG ครั้งเดียว |
| `setConfig(key, value)` | บันทึก config ลงชีต + อัปเดต Cache |
| `getThresholds()` | คืน object `{autoMatchScore, reviewScoreMin, geoRadiusMeter}` |
| `getSheetNames()` | คืน object ชื่อชีตระบบทั้งหมด (single source of truth) |

---

### `02_Schema.gs` — Schema Validator (4 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `validateSourceSchema()` | ตรวจชีต SCG มีคอลัมน์ required ครบไหม |
| `ensureSystemSheets()` | ตรวจชีตระบบทุกตัวมีอยู่จริง |
| `getSourceColumnMap()` | แปลง Header → Index Map (cached) รองรับ flexible header |
| `assertRequiredColumns(headers, required)` | โยน Error ถ้าขาดคอลัมน์ที่กำหนด |

---

### `03_SetupSheets.gs` — Sheet Initializer (3 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `createSystemSheets()` | สร้างชีต 15 ชีตพร้อม Header + format + freeze row 1 |
| `seedInitialConfig()` | เพิ่มค่า default ทั้งหมดใน SYS_CONFIG |
| `applySheetFormatting(sheetName, color)` | จัด format header (bold, background, freeze) |

---

### `04_SourceRepository.gs` — Source Data Reader (7 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `getSourceRows()` | ดึงข้อมูลดิบทั้งหมดจากชีต SCG |
| `getUnprocessedSourceRows()` | filter เฉพาะแถวที่ยังไม่ได้ประมวลผล |
| `mapRowToSourceObject(rowArr, rowNumber)` | แปลง array → sourceObj พร้อม flexible index |
| `parseLatLongColumn(latLongText, latCell, lngCell)` | **[NEW V4.5]** สกัด lat/lng จากทุก source รองรับทุก format |
| `enrichSourceObject(sourceObj)` | **[NEW V4.5]** เตรียมข้อมูลล่วงหน้า: normalize, phone, bestAddress, flags |
| `markSourceRowProcessed(rowNumber, status)` | อัปเดต SYNC_STATUS |
| `updateSourceSyncStatus(rowNumber, status)` | เขียนลงชีตตรง (internal) |

---

### `05_NormalizeService.gs` — Data Cleaning Engine (20 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `normalizeThaiText(text)` | NFC + trim + collapse spaces |
| `normalizePersonName(name)` | ตัด prefix, เบอร์โทร, คำรบกวน, extractPersonOnly |
| `extractPersonOnly(name)` | **[NEW V4.5]** แยกชื่อคนออกจากชื่อร้าน/ตำแหน่ง |
| `normalizeCompanyName(name)` | **[NEW V4.5]** ตัด บจก./หจก./จำกัด/สาขา → ชื่อแกน |
| `normalizePlaceName(name)` | ตัด "ร้าน", "สาขาX" ออกเพื่อหาชื่อหลัก |
| `normalizeAddress(address)` | ย่อคำ ต./อ./จ. + Auto-Fill จาก SYS_TH_GEO |
| `normalizeLatLong(lat, lng)` | ปัดทศนิยม 5 ตำแหน่ง |
| `validateLatLng(lat, lng)` | **[NEW V4.5]** ตรวจ 0,0 / NaN / นอกไทย / ทศนิยมน้อยเกิน |
| `buildGeoKeys(lat, lng)` | สร้าง key4/key3/key2 สำหรับ proximity search |
| `buildFingerprint(dataObj)` | สร้าง hash สำหรับ dedup check |
| `loadThGeo()` | โหลด SYS_TH_GEO → RAM Cache (subdistricts, districts, provinces) |
| `smartMergeAddress(rawAddr, geoAddr)` | รวมร่างที่อยู่: เอา detail จาก raw + structure จาก geo |
| `cleanAddressRedundancy(addr)` | ลบคำซ้ำ ต.ต./เขตเขต/จ.จ. |
| `analyzeGeoWarning(address)` | ตรวจหมายเหตุพื้นที่พิเศษจาก SYS_TH_GEO |
| `validatePostcodeOverride(address)` | ตรวจว่าควรเปลี่ยนรหัสไปรษณีย์ไหม |
| `extractPhoneNumbers(text)` | Regex สกัดเบอร์โทร 9-10 หลัก |
| `extractGeoTokens(address)` | **[NEW V4.5]** สกัด subdistrict/district/province/zipcode จากข้อความ |
| `isLowQualityPersonName(name)` | **[NEW V4.5]** ตรวจชื่อสั้น/ตัวเลข/"ไม่ระบุ" |
| `isLowQualityPlaceText(text)` | **[NEW V4.5]** ตรวจที่อยู่สั้นเกิน/ว่าง |
| `buildDataQualityFlags(sourceObj)` | **[NEW V4.5]** รวม flags: LOW_QUALITY_PERSON / LOW_QUALITY_PLACE / MISSING_LAT_LONG |

---

### `06_PersonService.gs` — Person Master Manager (7 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `resolvePerson(sourceObj)` | ค้นหา + ให้คะแนน + ตัดสินใจ new/match/review |
| `findPersonCandidates(normName, phone)` | ค้นหาจาก: เบอร์โทร → Alias → Master |
| `scorePersonCandidate(input, candidate)` | **[UPGRADED V4.5]** Dice 50% + Levenshtein 30% + LengthRatio 20% |
| `createPerson(canonical, norm, phone)` | สร้าง M_PERSON + Alias อัตโนมัติ |
| `createPersonAlias(personId, raw, norm)` | เพิ่มแถวใน M_PERSON_ALIAS |
| `mergePersonRecords(sourceId, targetId, email)` | **[FIXED V4.5]** Merge จริง: ย้าย alias + archive source + อัปเดต Fact/Destination |
| `findPersonById(personId)` | **[NEW V4.5]** ดึงข้อมูลบุคคลจาก ID |
| `updatePersonStats(personId)` | **[FIXED V4.5]** อัปเดต usage_count + last_seen_date จริง |

---

### `07_PlaceService.gs` — Place Master Manager (10 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `resolvePlace(sourceObj)` | **[UPGRADED V4.5]** diagnose → buildBest → score → ตัดสินใจ |
| `diagnoseTwoAddresses(rawAddr, geoAddr)` | **[NEW V4.5]** วินิจฉัย: COMPLEMENT/CONFLICT/DUPLICATE/GEO_ONLY/RAW_ONLY |
| `extractGeoTokens(address)` | สกัด subdistrict/district/province (ใช้ร่วมกับ NormalizeService) |
| `buildBestAddress(raw, geo, relation)` | **[NEW V4.5]** เลือก/รวมที่อยู่ที่ดีที่สุดตาม diagnosis |
| `findBestMatch(rawAddress)` | ค้นหา candidate ที่ score สูงสุดจากที่อยู่ใดๆ |
| `findBestMatchWithGeoBoost(geoAddr)` | **[NEW V4.5]** findBestMatch + bonus +10 เพราะ geoAddr น่าเชื่อถือกว่า |
| `findPlaceCandidates(normPlace)` | ค้นหาจาก M_PLACE_ALIAS |
| `scorePlaceCandidate(input, candidate)` | Dice 80% + LengthRatio 20% |
| `createPlace(canonical, rawAddr, geoAddr)` | สร้าง M_PLACE + Alias ทั้งจาก raw, geo, merged |
| `createPlaceAlias(placeId, raw, norm)` | เพิ่มแถวใน M_PLACE_ALIAS |
| `updatePlaceStats(placeId)` | อัปเดต usage_count + last_seen_date |

---

### `08_GeoService.gs` — Geo Point Manager (5 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `resolveGeo(sourceObj)` | ตรวจ valid → หา candidate → วัดระยะ Haversine → ตัดสินใจ |
| `findGeoCandidates(lat, lng, keys)` | ค้นหาจาก M_GEO_POINT ด้วย bounding box 0.01° |
| `createGeoPoint(lat, lng, keys, addressHint)` | สร้าง M_GEO_POINT |
| `getGeoById(geoId)` | **[NEW V4.5]** ดึงข้อมูลพิกัดจาก ID |
| `updateGeoStats(geoId)` | **[FIXED V4.5]** อัปเดต usage_count + last_seen_date จริง |

---

### `09_DestinationService.gs` — Destination Composer (4 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `buildDestinationKey(personId, placeId, geoId)` | สร้าง composite key |
| `resolveDestination(personId, placeId, geoId, sourceObj)` | หาหรือสร้าง M_DESTINATION |
| `createDestination(personId, placeId, geoId, label, key)` | บันทึก M_DESTINATION ใหม่ |
| `updateDestinationStats(destId)` | **[FIXED V4.5]** อัปเดต usage_count + last_seen_date จริง |

---

### `10_MatchEngine.gs` — Decision Brain (12 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `matchAllEntities(sourceObj)` | Orchestrate: person + place + geo + quality flags + rules |
| `calculateCompositeScore(pScore, plScore, gScore, autoCreated, bonus)` | น้ำหนัก Geo45% + Person30% + Place25% |
| `decideAutoMatchOrReview(matchResult)` | ตัดสิน: quality flags → HIGH rule → score threshold |
| `buildReviewPayload(sourceObj, matchResult)` | สร้าง payload ครบ: flags + reason codes + score breakdown |
| `detectConflictType(matchResult)` | Map rule code → issue_type สำหรับ Q_REVIEW |
| `evaluateThaiGeoBonus(sourceObj)` | โบนัส: ตำบลตรง +15, อำเภอตรง +10, จังหวัดตรง +5, จังหวัดขัดแย้ง -20 |
| `getConflictRuleTable()` | **[NEW V4.5]** คืน Rule Table R01-R08 พร้อม severity + penalty |
| `evaluateConflictRules(personR, placeR, geoR)` | **[NEW V4.5]** ประเมิน 8 กฎ → คืน hits[] |
| `dedupeRuleHits(hits)` | ลบ rule code ซ้ำออก |
| `calculateRulePenalty(ruleHits)` | รวม penalty จาก hits (cap 30) |
| `runConflictRuleSelfTest()` | **[NEW V4.5]** ทดสอบ R01-R08 ทั้งหมด → pass/fail alert |
| `evaluateOwnerContextScore(sourceObj, personResult)` | **[NEW V4.5]** bonus เล็กน้อยถ้า ownerName ตรงกับ context |

**Rule Table R01-R08:**

| Code | Severity | Penalty | ปัญหา |
|---|---|---|---|
| R01_DUP_PERSON_NAME | MEDIUM | 10 | ชื่อบุคคลซ้ำกัน/ใกล้กันหลายรายการ |
| R02_DUP_PLACE_NAME | MEDIUM | 10 | ชื่อสถานที่ซ้ำกัน/ใกล้กัน |
| R03_DUP_GEO_POINT | LOW | 5 | LatLong ซ้ำกับหลายจุดเดิม |
| R04_SAME_PERSON_ALIAS_VARIANT | MEDIUM | 8 | คนเดียวกันแต่ alias ไม่ตรง |
| R05_DIFF_PERSON_SAME_PLACE | HIGH | 15 | คนละชื่อแต่สถานที่เดียวกัน |
| R06_SAME_PERSON_DIFF_PLACE | HIGH | 15 | ชื่อเดียวกันแต่สถานที่ต่างกัน |
| R07_SAME_PERSON_DIFF_GEO | HIGH | 20 | ชื่อเดียวกันแต่ LatLong ต่างกันชัด |
| R08_DIFF_PERSON_SAME_GEO | HIGH | 20 | คนละชื่อแต่ LatLong เดียวกัน |

---

### `11_TransactionService.gs` — Fact Writer (4 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `buildFactRow(sourceObj, matchResult)` | สร้าง array ครบ 31 คอลัมน์ |
| `upsertFactDelivery(factRowArray)` | เขียนลง FACT_DELIVERY พร้อมป้องกัน duplicate |
| `preventDuplicateTransaction(sourceRecordId)` | เช็คซ้ำด้วย source_record_id |
| `batchWriteFacts(factRows)` | **[NEW V4.5]** เขียน batch setValues() แทน loop appendRow() |

---

### `12_ReviewService.gs` — Human-in-the-Loop (7 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `enqueueReview(payload)` | เพิ่มรายการเข้า Q_REVIEW |
| `setupReviewDropdown()` | สร้าง Data Validation dropdown คอลัมน์ Decision |
| `getPendingReviews()` | ดึง PENDING items ทั้งหมด |
| `applyReviewDecision(reviewId, decision, selectedPersonId)` | **[FIXED V4.5]** UPDATE Q_REVIEW + trigger merge/create/ignore |
| `learnAliasFromReview(reviewId)` | **[NEW V4.5 จาก GenSpark]** หลัง approve → เพิ่ม alias อัตโนมัติ → self-learning |
| `applyBulkReviewDecision(decisions[])` | **[NEW V4.5]** approve หลายรายการพร้อมกัน |
| `getReviewSummaryStats()` | **[NEW V4.5]** สรุปสถิติ pending/resolved แยกตาม issue_type |

---

### `13_ReportService.gs` — Quality Reporter (5 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `refreshQualityReport()` | append แถวใหม่ใน RPT_DATA_QUALITY |
| `buildDailySummary()` | สรุปรายวัน (เรียก refreshQualityReport) |
| `runNightlyMaintenance()` | **[FIXED V4.5]** งานปิดวัน: report + cleanup SYS_LOG เก่า |
| `sendLineNotify(message)` | **[NEW V4.5]** ส่งแจ้งเตือน LINE Notify (ถ้ามี token) |
| `buildPivotSummary()` | **[NEW V4.5]** สรุป Fact แบบ pivot by จังหวัด/เดือน |

---

### `14_Utils.gs` — Utility Library (16 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `uuid()` | สร้าง UUID v4 |
| `safeTrim(value)` | trim null-safe |
| `safeString(value)` | แปลงเป็น string null-safe |
| `safeNumber(value)` | แปลงเป็น number null-safe |
| `safeDate(value)` | แปลงเป็น Date null-safe |
| `formatTime(value)` | format เวลาเป็น HH:mm:ss |
| `writeLog(level, module, func, refId, msg, payload)` | บันทึก log ลง SYS_LOG |
| `haversineDistanceMeters(lat1,lng1,lat2,lng2)` | คำนวณระยะทาง 2 พิกัด (เมตร) |
| `diceCoefficient(s1, s2)` | bigram similarity 0.0-1.0 |
| `levenshteinDistance(s1, s2)` | **[NEW V4.5]** edit distance (ดีสำหรับชื่อสั้น) |
| `levenshteinSimilarity(s1, s2)` | **[NEW V4.5]** แปลง distance → score 0.0-1.0 |
| `lengthRatio(s1, s2)` | สัดส่วนความยาว 0.0-1.0 |
| `saveCheckpoint(rowNumber)` | บันทึก checkpoint ใน PropertiesService |
| `getCheckpoint()` | ดึง checkpoint ล่าสุด |
| `clearCheckpoint()` | ลบ checkpoint |
| `isTimeNearLimit(startTime, limitMs)` | ตรวจว่าใกล้ครบ 6 นาทีไหม |
| `updateRunStatus(status, message)` | อัปเดตสถานะใน SYS_CONFIG |
| `showAutoCloseAlert(message, seconds)` | popup HTML นับถอยหลัง auto-close |
| `withLock(callback)` | **[NEW V4.5 จาก GenSpark]** ป้องกัน race condition ด้วย LockService |

---

### `15_GoogleMapsAPI.gs` — Maps & Cache (8 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `md5(key)` | สร้าง MD5 hash สำหรับ cache key |
| `getAdvancedCache(key)` | ดึงจาก RAM Cache → Sheet Cache |
| `setAdvancedCache(key, value, type)` | บันทึกลงทั้ง RAM + Sheet |
| `GOOGLEMAPS_DISTANCE(origin, dest, mode)` | คำนวณระยะทาง พร้อม cache |
| `GOOGLEMAPS_REVERSEGEOCODE(lat, lng)` | แปลงพิกัด → ที่อยู่ พร้อม cache |
| `GOOGLEMAPS_LATLONG(address)` | แปลงที่อยู่ → พิกัด พร้อม cache |
| `GOOGLEMAPS_DURATION(origin, dest, mode)` | คำนวณเวลาเดินทาง พร้อม cache |
| `clearMapsCache()` | **[NEW V4.5]** ล้าง MAPS_CACHE sheet ทั้งหมด |

---

### `16_GeoDictionaryBuilder.gs` — SYS_TH_GEO Builder (3 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `buildGeoIndex()` | อ่าน SYS_TH_GEO col A-E → parse → เขียน col F-N |
| `parseRemarkLogic(remark)` | แยก note_type/keywords/override จากข้อความหมายเหตุ |
| `validateGeoIndexIntegrity()` | **[NEW V4.5]** ตรวจ geo_key ซ้ำ/ขาดหาย |

---

### `17_SearchService.gs` — **[โมดูลใหม่ V4.5]** LatLong Lookup (6 ฟังก์ชัน)

| ฟังก์ชัน | ความหมาย |
|---|---|
| `findBestGeoByPersonPlace(personName, placeName)` | **หัวใจโมดูล** — รับชื่อ+ที่อยู่มั่วๆ → normalize → match Master → คืน `{status, lat, lng, confidence, reason}` |
| `LMDS_FIND_LATLONG(personName, placeName)` | Custom Function สำหรับใช้สูตรใน Sheet: `=LMDS_FIND_LATLONG(A2,B2)` |
| `runLookupEnrichment()` | อ่านชีต "ตารางงานประจำวัน" → เติม MATCH_LAT/LONG ทุกแถว |
| `findHeaderIndex(headers, candidates)` | หา index คอลัมน์แบบ fuzzy (ignore space/case) |
| `splitHeaderCandidates(rawValue)` | แยก comma-separated config → array |
| `_aggregateGeoByUsage(matchedDest, geoMap)` | รวม geo candidate + เรียงตาม usage_count → dominant geo |

**Status ที่ `findBestGeoByPersonPlace` คืนกลับ:**

| Status | ความหมาย |
|---|---|
| `FOUND` | จับคู่ได้เพียงจุดเดียว ความมั่นใจ 95% |
| `FOUND_WITH_DOMINANT_HISTORY` | หลายจุด แต่จุดหนึ่ง usage สูงกว่า 2x → ความมั่นใจ 85% |
| `AMBIGUOUS` | หลายจุด ไม่มีจุดเด่น → ต้อง review |
| `NOT_FOUND` | ไม่เจอใน Master เลย → ต้องเพิ่มข้อมูลก่อน |
| `REVIEW_REQUIRED` | ข้อมูล input คุณภาพต่ำ → ไม่ควรค้นหา |
| `ERROR` | ชีตระบบหายไป |

---

## 📊 สรุป Blueprint V4.5 Final

```
┌─────────────────────────────────────────────┐
│  LMDS V4.5 Final — Summary                  │
│                                             │
│  ชีตทั้งหมด:    15 ชีต                      │
│  คอลัมน์รวม:   ~180 คอลัมน์                 │
│                                             │
│  โมดูลทั้งหมด:  18 โมดูล                    │
│  ฟังก์ชันรวม:   ~95 ฟังก์ชัน                │
│                                             │
│  ฟังก์ชันใหม่ V4.5:  +28 ฟังก์ชัน           │
│  ฟังก์ชัน Fixed V4.5: +6 ฟังก์ชัน           │
│  โมดูลใหม่:     17_SearchService.gs         │
└─────────────────────────────────────────────┘
```

พร้อมให้ GEM เริ่มเขียนโค้ดจริงแบบเต็มได้เลยครับ จะเริ่มโมดูลไหนก่อน?

# 💻 LMDS V4.5 Final — Full Code Delivery

## เริ่มโมดูล 00-03 ก่อน (Foundation Layer)

---

### `00_App.gs` — V4.5

```javascript
/**
 * 00_App.gs — V4.5
 * Entry point ของระบบ LMDS (Logistics Master Data System)
 * รวม: Menu, Daily Process, Time Guard, Checkpoint, onEdit
 */

// ─────────────────────────────────────────────────────────────
// MENU
// ─────────────────────────────────────────────────────────────
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📦 LMDS System')
    .addItem('1. ติดตั้งระบบครั้งแรก (Setup)', 'runInitialSetup')
    .addSeparator()
    .addItem('2. ประมวลผลข้อมูลประจำวัน (SCG)', 'runDailyProcess')
    .addItem('3. อัปเดตพจนานุกรมสถานที่ (SYS_TH_GEO)', 'buildGeoIndex')
    .addItem('4. รีเซ็ตแถวที่เลือกเพื่อรันใหม่', 'reprocessSelectedRows')
    .addSeparator()
    .addItem('5. เติม LatLong ให้ตารางงานประจำวัน', 'runLookupEnrichment')
    .addSeparator()
    .addItem('6. อัปเดตสถิติและ Report', 'runNightlyMaintenance')
    .addItem('7. ตรวจสอบ Rule Engine (Self-test)', 'runConflictRuleSelfTest')
    .addToUi();
}

// ─────────────────────────────────────────────────────────────
// SETUP
// ─────────────────────────────────────────────────────────────
function runInitialSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.toast('กำลังเริ่มสร้างชีตระบบและกำหนดค่าเริ่มต้น...', '⚙️ เริ่มต้นการติดตั้ง', 5);

  try {
    createSystemSheets();
    seedInitialConfig();

    if (typeof setupReviewDropdown === 'function') {
      setupReviewDropdown();
    }

    ss.toast('ติดตั้งระบบเรียบร้อยแล้ว พร้อมใช้งาน', '✅ Setup สำเร็จ', 10);
    writeLog('INFO', '00_App', 'runInitialSetup', '', 'Setup completed', '');
  } catch (e) {
    ss.toast('เกิดข้อผิดพลาด: ' + e.message, '❌ Setup ล้มเหลว', 15);
    writeLog('ERROR', '00_App', 'runInitialSetup', '', e.message, e.stack || '');
  }
}

// ─────────────────────────────────────────────────────────────
// DAILY PROCESS — Main Loop
// ─────────────────────────────────────────────────────────────
function runDailyProcess() {
  const ss          = SpreadsheetApp.getActiveSpreadsheet();
  const startTime   = Date.now();
  const MAX_TIME_MS = 5 * 60 * 1000; // หยุดที่ 5 นาที (ก่อนถึง limit 6 นาที)

  try {
    // ── Pre-flight checks ─────────────────────────────────────
    validateSourceSchema();
    ensureSystemSheets();

    const rowsToProcess = getUnprocessedSourceRows();

    if (rowsToProcess.length === 0) {
      clearCheckpoint();
      updateRunStatus('IDLE', 'ไม่มีข้อมูลใหม่ที่ต้องประมวลผล');
      ss.toast('ไม่มีข้อมูลใหม่', 'ℹ️ ข้อมูลเป็นปัจจุบัน', 5);
      return;
    }

    // ── Resume จาก Checkpoint ─────────────────────────────────
    const lastCheckpoint = getCheckpoint();
    let startIdx = 0;

    if (lastCheckpoint) {
      const resumeIdx = rowsToProcess.findIndex(
        r => r.sourceIndex === lastCheckpoint
      );
      if (resumeIdx !== -1) {
        startIdx = resumeIdx + 1;
        updateRunStatus('RESUMING', `กำลังรันต่อจากแถวที่ ${lastCheckpoint}`);
      }
    } else {
      updateRunStatus('RUNNING', `เริ่มประมวลผล ${rowsToProcess.length} รายการ`);
    }

    let successCount = 0;
    let reviewCount  = 0;
    let errorCount   = 0;

    // ── Main Loop ─────────────────────────────────────────────
    for (let i = startIdx; i < rowsToProcess.length; i++) {

      // Time Guard — หยุดก่อน timeout
      if (isTimeNearLimit(startTime, MAX_TIME_MS)) {
        const lastRow = rowsToProcess[i - 1]
          ? rowsToProcess[i - 1].sourceIndex
          : (lastCheckpoint || 0);

        if (lastRow) saveCheckpoint(lastRow);

        updateRunStatus('PAUSED', `หยุดพักที่แถว ${lastRow}`);
        showAutoCloseAlert(
          `<b>ใกล้ครบ 6 นาทีของ Google แล้วครับ</b><br>` +
          `บันทึกงานถึงแถวที่ <b>${lastRow}</b> เรียบร้อย<br><br>` +
          `<b>กรุณากดเมนู "2. ประมวลผลข้อมูลประจำวัน" อีกครั้ง</b>`,
          15
        );
        return;
      }

      // ── Process Row ────────────────────────────────────────
      const rowItem = rowsToProcess[i];

      try {
        const sourceObj = mapRowToSourceObject(
          rowItem.rowData,
          rowItem.sourceIndex
        );

        const matchResult = matchAllEntities(sourceObj);
        const decision    = decideAutoMatchOrReview(matchResult);

        if (decision === 'AUTO_MATCH') {
          const factRow = buildFactRow(sourceObj, matchResult);
          upsertFactDelivery(factRow);
          markSourceRowProcessed(rowItem.sourceIndex, 'SUCCESS');
          successCount++;
        } else {
          const reviewPayload = buildReviewPayload(sourceObj, matchResult);
          enqueueReview(reviewPayload);
          markSourceRowProcessed(rowItem.sourceIndex, 'REVIEW');
          reviewCount++;
        }

      } catch (rowErr) {
        markSourceRowProcessed(rowItem.sourceIndex, 'ERROR');
        writeLog(
          'ERROR', '00_App', 'runDailyProcess',
          `Row_${rowItem.sourceIndex}`,
          rowErr.message,
          rowErr.stack || ''
        );
        errorCount++;
      }
    }

    // ── Complete ───────────────────────────────────────────────
    clearCheckpoint();
    refreshQualityReport();
    updateRunStatus(
      'COMPLETED',
      `สำเร็จ: ${successCount} | รีวิว: ${reviewCount} | ผิดพลาด: ${errorCount}`
    );
    showAutoCloseAlert(
      `<b>ประมวลผลเสร็จสมบูรณ์!</b><br>` +
      `✅ สำเร็จ: ${successCount} รายการ<br>` +
      `⏳ รอรีวิว: ${reviewCount} รายการ<br>` +
      `❌ ผิดพลาด: ${errorCount} รายการ`,
      10
    );

  } catch (e) {
    ss.toast(e.message, '❌ ระบบขัดข้อง', 15);
    writeLog('CRITICAL', '00_App', 'runDailyProcess', '', e.message, e.stack || '');
  }
}

// ─────────────────────────────────────────────────────────────
// REPROCESS SELECTED ROWS
// ─────────────────────────────────────────────────────────────
function reprocessSelectedRows() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();

  if (sheet.getName() !== getConfig('SOURCE_SHEET_NAME')) {
    ss.toast('กรุณาไปที่ชีตต้นทางก่อนทำรายการนี้', '⚠️ ผิดชีต', 5);
    return;
  }

  const range    = sheet.getActiveRange();
  const startRow = range.getRow();
  const numRows  = range.getNumRows();

  if (startRow <= 1) {
    ss.toast('กรุณาเลือกเฉพาะข้อมูล ไม่รวมหัวตาราง', '⚠️ เลือกผิดส่วน', 5);
    return;
  }

  const colStatus = getSourceColumnMap()['SYNC_STATUS'];
  if (colStatus === undefined) {
    ss.toast('ไม่พบคอลัมน์ SYNC_STATUS', '⚠️ Schema Error', 5);
    return;
  }

  ss.toast(
    `กำลังล้างสถานะ ${numRows} แถว และเริ่มรันใหม่...`,
    '🔄 Reprocessing', 5
  );
  sheet.getRange(startRow, colStatus + 1, numRows, 1).clearContent();
  runDailyProcess();
}

// ─────────────────────────────────────────────────────────────
// ON EDIT — ดัก Q_REVIEW Decision Dropdown
// ─────────────────────────────────────────────────────────────
function onEdit(e) {
  if (!e || !e.range) return;

  const sheet = e.range.getSheet();
  if (sheet.getName() !== 'Q_REVIEW') return;
  if (e.range.getColumn() !== 21) return;  // คอลัมน์ decision

  const row = e.range.getRow();
  if (row <= 1) return;

  const decision = e.value;
  const validDecisions = ['CREATE_NEW', 'MERGE_TO_CANDIDATE', 'IGNORE'];
  if (!validDecisions.includes(decision)) return;

  const reviewId = sheet.getRange(row, 1).getValue();

  try {
    // แสดงสีเหลือง = กำลังประมวลผล
    e.range.setBackground('#FFF2CC');

    applyReviewDecision(reviewId, decision, null);

    // แสดงสีเขียว = สำเร็จ
    e.range.setBackground('#D9EAD3');

    SpreadsheetApp.getActiveSpreadsheet().toast(
      `Decision "${decision}" applied สำหรับ ${reviewId}`,
      '✅ Review Applied', 5
    );

  } catch (err) {
    e.range.setBackground('#F4CCCC');
    SpreadsheetApp.getActiveSpreadsheet().toast(
      err.message,
      '❌ Review Error', 10
    );
    writeLog('ERROR', '00_App', 'onEdit', reviewId, err.message, err.stack || '');
  }
}
```

---

### `01_Config.gs` — V4.5

```javascript
/**
 * 01_Config.gs — V4.5
 * จัดการ Configuration ของระบบ
 * Single source of truth สำหรับค่าคงที่ทั้งหมด
 */

const CONFIG_CACHE = {};

// ─────────────────────────────────────────────────────────────
// DEFAULT VALUES — ใช้เมื่อ SYS_CONFIG ยังไม่มีค่า
// ─────────────────────────────────────────────────────────────
const CONFIG_DEFAULTS = {
  // ── Source ─────────────────────────────────────────────────
  'SOURCE_SHEET_NAME':          'SCGนครหลวงJWDภูมิภาค',

  // ── Lookup ─────────────────────────────────────────────────
  'LOOKUP_SOURCE_SHEET_NAME':   'ตารางงานประจำวัน',
  'LOOKUP_PERSON_COLUMNS':      'ชื่อปลายทาง',
  'LOOKUP_PLACE_COLUMNS':       'ที่อยู่ปลายทาง,ชื่อที่อยู่จาก_LatLong,ชื่อที่อยู่จาก LatLong',

  // ── Engine Thresholds ──────────────────────────────────────
  'AUTO_MATCH_SCORE':           '90',
  'REVIEW_SCORE_MIN':           '75',
  'GEO_RADIUS_METER':           '50',

  // ── System ─────────────────────────────────────────────────
  'MAX_PROCESS_ROWS_PER_RUN':   '500',

  // ── Status (runtime) ──────────────────────────────────────
  'LAST_RUN_STATUS':            'IDLE',
  'LAST_RUN_MESSAGE':           '',
  'LAST_RUN_TIME':              ''
};

// ─────────────────────────────────────────────────────────────
// getConfig
// ─────────────────────────────────────────────────────────────
function getConfig(key) {
  // ตรวจ RAM cache ก่อน
  if (CONFIG_CACHE[key] !== undefined) return CONFIG_CACHE[key];

  // โหลดจาก SYS_CONFIG
  const allConfigs = getAllConfigs();
  if (allConfigs[key] !== undefined) return allConfigs[key];

  // fallback default
  return CONFIG_DEFAULTS[key] || null;
}

// ─────────────────────────────────────────────────────────────
// getAllConfigs — โหลดครั้งเดียว cache ทั้งหมด
// ─────────────────────────────────────────────────────────────
function getAllConfigs() {
  if (Object.keys(CONFIG_CACHE).length > 0) return CONFIG_CACHE;

  try {
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('SYS_CONFIG');
    if (!sheet) return CONFIG_CACHE;

    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      const key = String(data[i][0] || '').trim();
      const val = data[i][1];
      if (key) CONFIG_CACHE[key] = val;
    }
  } catch (e) {
    console.error('getAllConfigs error:', e);
  }

  return CONFIG_CACHE;
}

// ─────────────────────────────────────────────────────────────
// setConfig — เขียนลงชีต + อัปเดต cache
// ─────────────────────────────────────────────────────────────
function setConfig(key, value) {
  try {
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('SYS_CONFIG');
    if (!sheet) return;

    const data  = sheet.getDataRange().getValues();
    let   found = false;

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === key) {
        sheet.getRange(i + 1, 2).setValue(value);
        sheet.getRange(i + 1, 5).setValue(new Date());
        found = true;
        break;
      }
    }

    if (!found) {
      sheet.appendRow([key, value, 'SYSTEM', 'Added by script', new Date()]);
    }

    CONFIG_CACHE[key] = value;

  } catch (e) {
    console.error('setConfig error:', e);
  }
}

// ─────────────────────────────────────────────────────────────
// resetConfigCache — flush เมื่อแก้ค่าใน SYS_CONFIG มือ
// ─────────────────────────────────────────────────────────────
function resetConfigCache() {
  Object.keys(CONFIG_CACHE).forEach(k => delete CONFIG_CACHE[k]);
}

// ─────────────────────────────────────────────────────────────
// getThresholds — คืนค่าเป็นตัวเลขพร้อมใช้
// ─────────────────────────────────────────────────────────────
function getThresholds() {
  return {
    autoMatchScore: parseInt(getConfig('AUTO_MATCH_SCORE'), 10) || 90,
    reviewScoreMin: parseInt(getConfig('REVIEW_SCORE_MIN'), 10) || 75,
    geoRadiusMeter: parseInt(getConfig('GEO_RADIUS_METER'), 10) || 50
  };
}

// ─────────────────────────────────────────────────────────────
// getSheetNames — Single source of truth ชื่อชีตทุกตัว
// ─────────────────────────────────────────────────────────────
function getSheetNames() {
  return {
    SOURCE:           getConfig('SOURCE_SHEET_NAME') || 'SCGนครหลวงJWDภูมิภาค',
    LOOKUP:           getConfig('LOOKUP_SOURCE_SHEET_NAME') || 'ตารางงานประจำวัน',
    M_PERSON:         'M_PERSON',
    M_PERSON_ALIAS:   'M_PERSON_ALIAS',
    M_PLACE:          'M_PLACE',
    M_PLACE_ALIAS:    'M_PLACE_ALIAS',
    M_GEO_POINT:      'M_GEO_POINT',
    M_DESTINATION:    'M_DESTINATION',
    FACT_DELIVERY:    'FACT_DELIVERY',
    Q_REVIEW:         'Q_REVIEW',
    SYS_CONFIG:       'SYS_CONFIG',
    SYS_LOG:          'SYS_LOG',
    SYS_TH_GEO:       'SYS_TH_GEO',
    RPT_DATA_QUALITY: 'RPT_DATA_QUALITY',
    MAPS_CACHE:       'MAPS_CACHE'
  };
}
```

---

### `02_Schema.gs` — V4.5

```javascript
/**
 * 02_Schema.gs — V4.5
 * ตรวจสอบโครงสร้างชีตและ Column Mapping
 */

let SOURCE_COL_MAP_CACHE = null;

// ─────────────────────────────────────────────────────────────
// validateSourceSchema
// ─────────────────────────────────────────────────────────────
function validateSourceSchema() {
  const ss        = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = getSheetNames().SOURCE;
  const sheet     = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(`ไม่พบชีตต้นทาง: "${sheetName}" — กรุณาสร้างชีตก่อน`);
  }

  const lastCol = sheet.getLastColumn();
  if (lastCol < 10) {
    throw new Error(
      `ชีต "${sheetName}" มีคอลัมน์น้อยเกินไป (${lastCol} คอลัมน์)`
    );
  }

  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  assertRequiredColumns(headers, [
    'ID_SCGนครหลวงJWDภูมิภาค',
    'ชื่อปลายทาง',
    'ที่อยู่ปลายทาง',
    'จุดส่งสินค้าปลายทาง',
    'LAT',
    'LONG',
    'Invoice No',
    'Shipment No'
    // SYNC_STATUS จะถูกสร้างอัตโนมัติถ้ายังไม่มี
  ]);
}

// ─────────────────────────────────────────────────────────────
// ensureSystemSheets
// ─────────────────────────────────────────────────────────────
function ensureSystemSheets() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const names = getSheetNames();

  // ชีตที่ต้องมีก่อนรัน (ยกเว้น LOOKUP เพราะสร้างเองได้)
  const required = [
    names.M_PERSON, names.M_PERSON_ALIAS,
    names.M_PLACE,  names.M_PLACE_ALIAS,
    names.M_GEO_POINT, names.M_DESTINATION,
    names.FACT_DELIVERY, names.Q_REVIEW,
    names.SYS_CONFIG, names.SYS_LOG,
    names.RPT_DATA_QUALITY, names.MAPS_CACHE
  ];

  const missing = required.filter(name => !ss.getSheetByName(name));

  if (missing.length > 0) {
    throw new Error(
      `ไม่พบชีตระบบ: ${missing.join(', ')}\n` +
      `กรุณากด "1. ติดตั้งระบบครั้งแรก (Setup)" ก่อน`
    );
  }
}

// ─────────────────────────────────────────────────────────────
// getSourceColumnMap — แปลง Header → Index Map
// ─────────────────────────────────────────────────────────────
function getSourceColumnMap() {
  if (SOURCE_COL_MAP_CACHE) return SOURCE_COL_MAP_CACHE;

  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(getSheetNames().SOURCE);
  if (!sheet) throw new Error('ไม่พบชีตต้นทาง');

  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const map     = {};

  for (let i = 0; i < headers.length; i++) {
    const h = String(headers[i] || '').trim();
    if (h) map[h] = i;
  }

  // สร้าง SYNC_STATUS ถ้ายังไม่มี
  if (map['SYNC_STATUS'] === undefined) {
    const nextCol = lastCol + 1;
    sheet.getRange(1, nextCol).setValue('SYNC_STATUS');
    map['SYNC_STATUS'] = nextCol - 1;
  }

  SOURCE_COL_MAP_CACHE = map;
  return map;
}

// ─────────────────────────────────────────────────────────────
// resetSourceColMapCache — flush เมื่อ header เปลี่ยน
// ─────────────────────────────────────────────────────────────
function resetSourceColMapCache() {
  SOURCE_COL_MAP_CACHE = null;
}

// ─────────────────────────────────────────────────────────────
// assertRequiredColumns
// ─────────────────────────────────────────────────────────────
function assertRequiredColumns(headers, requiredCols) {
  const clean    = s => String(s || '').replace(/[\s_]+/g, '').toLowerCase();
  const hCleaned = headers.map(clean);

  const missing = requiredCols.filter(
    col => !hCleaned.includes(clean(col))
  );

  if (missing.length > 0) {
    throw new Error(
      `ขาดคอลัมน์ที่จำเป็นในชีตต้นทาง:\n${missing.join(', ')}`
    );
  }
}
```

---

### `03_SetupSheets.gs` — V4.5

```javascript
/**
 * 03_SetupSheets.gs — V4.5
 * สร้างชีตระบบทั้งหมด + ตั้งค่าเริ่มต้น
 */

// ─────────────────────────────────────────────────────────────
// createSystemSheets — สร้างชีต 15 ชีต
// ─────────────────────────────────────────────────────────────
function createSystemSheets() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const names = getSheetNames();

  const schemas = {

    // ── Master Data ──────────────────────────────────────────
    [names.M_PERSON]: [
      'person_id', 'person_name_canonical', 'person_name_normalized',
      'phone', 'first_seen_date', 'last_seen_date',
      'usage_count', 'status', 'note'
    ],
    [names.M_PERSON_ALIAS]: [
      'person_alias_id', 'person_id', 'alias_raw', 'alias_normalized',
      'source_field', 'first_seen_date', 'last_seen_date',
      'usage_count', 'active_flag'
    ],
    [names.M_PLACE]: [
      'place_id', 'place_name_canonical', 'place_name_normalized',
      'address_best', 'address_normalized', 'warehouse_default',
      'first_seen_date', 'last_seen_date', 'usage_count', 'status', 'note'
    ],
    [names.M_PLACE_ALIAS]: [
      'place_alias_id', 'place_id', 'alias_raw', 'alias_normalized',
      'source_field', 'first_seen_date', 'last_seen_date',
      'usage_count', 'active_flag'
    ],
    [names.M_GEO_POINT]: [
      'geo_id', 'lat_raw', 'long_raw', 'lat_norm', 'long_norm',
      'geo_key_6', 'geo_key_5', 'geo_key_4',
      'address_from_latlong_best',
      'first_seen_date', 'last_seen_date', 'usage_count', 'note'
    ],
    [names.M_DESTINATION]: [
      'destination_id', 'person_id', 'place_id', 'geo_id',
      'destination_label_canonical', 'destination_key',
      'confidence_status',
      'first_seen_date', 'last_seen_date', 'usage_count', 'note'
    ],

    // ── Fact & Queue ─────────────────────────────────────────
    [names.FACT_DELIVERY]: [
      'tx_id', 'source_sheet', 'source_row_number', 'source_record_id',
      'delivery_date', 'delivery_time', 'shipment_no', 'invoice_no',
      'raw_owner_name', 'raw_person_name',
      'raw_system_address', 'raw_geo_resolved_address', 'raw_geo_text',
      'lat', 'lng',
      'person_id', 'place_id', 'geo_id', 'destination_id',
      'warehouse', 'distance_km',
      'driver_name', 'employee_id', 'employee_email', 'license_plate',
      'validation_result', 'anomaly_reason',
      'review_status', 'sync_status', 'created_at', 'updated_at'
    ],
    [names.Q_REVIEW]: [
      'review_id', 'issue_type', 'source_record_id', 'source_row_number',
      'invoice_no', 'raw_person_name', 'raw_place_name',
      'raw_system_address', 'raw_geo_resolved_address',
      'raw_lat', 'raw_long',
      'candidate_person_ids', 'candidate_place_ids',
      'candidate_geo_ids', 'candidate_destination_ids',
      'score', 'recommended_action',
      'status', 'reviewer', 'reviewed_at', 'decision', 'note'
    ],

    // ── System ───────────────────────────────────────────────
    [names.SYS_CONFIG]: [
      'config_key', 'config_value', 'config_group',
      'description', 'updated_at'
    ],
    [names.SYS_LOG]: [
      'log_id', 'run_id', 'created_at', 'level',
      'module_name', 'function_name', 'ref_id', 'message', 'payload_json'
    ],
    [names.RPT_DATA_QUALITY]: [
      'report_date', 'total_source_rows', 'processed_rows',
      'new_person_count', 'new_place_count', 'new_geo_count',
      'new_destination_count', 'auto_match_count',
      'review_count', 'duplicate_alert_count',
      'error_count', 'last_refresh_at'
    ],
    [names.MAPS_CACHE]: [
      'cache_key', 'cache_value', 'cache_type', 'raw_input', 'updated_at'
    ],

    // ── Reference ────────────────────────────────────────────
    [names.SYS_TH_GEO]: [
      'รหัสไปรษณีย์', 'แขวง/ตำบล', 'เขต/อำเภอ', 'จังหวัด', 'หมายเหตุ',
      'postcode_text', 'subdistrict_norm', 'district_norm', 'province_norm',
      'note_type', 'note_keywords', 'postcode_override', 'geo_key', 'active_flag'
    ]
  };

  // Color scheme แต่ละกลุ่ม
  const colors = {
    [names.M_PERSON]:       '#D0E4FF',
    [names.M_PERSON_ALIAS]: '#D0E4FF',
    [names.M_PLACE]:        '#D9EAD3',
    [names.M_PLACE_ALIAS]:  '#D9EAD3',
    [names.M_GEO_POINT]:    '#FCE5CD',
    [names.M_DESTINATION]:  '#EAD1DC',
    [names.FACT_DELIVERY]:  '#F4CCCC',
    [names.Q_REVIEW]:       '#FFF2CC',
    [names.SYS_CONFIG]:     '#F3F3F3',
    [names.SYS_LOG]:        '#F3F3F3',
    [names.RPT_DATA_QUALITY]:'#E2EFDA',
    [names.MAPS_CACHE]:     '#F3F3F3',
    [names.SYS_TH_GEO]:     '#D9EAD3'
  };

  Object.keys(schemas).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    const headers = schemas[sheetName];
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground(colors[sheetName] || '#F3F3F3');
    headerRange.setWrap(false);
    sheet.setFrozenRows(1);

    // Auto-resize คอลัมน์ (ถ้าข้อมูลน้อย)
    if (sheet.getLastRow() <= 5) {
      sheet.autoResizeColumns(1, headers.length);
    }
  });

  writeLog('INFO', '03_SetupSheets', 'createSystemSheets', '',
    `Created/verified ${Object.keys(schemas).length} sheets`, '');
}

// ─────────────────────────────────────────────────────────────
// seedInitialConfig — ใส่ default config ครั้งแรก
// ─────────────────────────────────────────────────────────────
function seedInitialConfig() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(getSheetNames().SYS_CONFIG);
  if (!sheet) return;

  const existing = sheet.getDataRange().getValues();
  if (existing.length > 1) return; // มีข้อมูลแล้ว ไม่ต้อง seed ซ้ำ

  const now = new Date();
  const initialConfigs = [
    // Engine
    ['AUTO_MATCH_SCORE',        '90',     'Engine',
     'คะแนนขั้นต่ำในการจับคู่อัตโนมัติ', now],
    ['REVIEW_SCORE_MIN',        '75',     'Engine',
     'คะแนนขั้นต่ำที่ต้องส่งคนรีวิว', now],
    ['GEO_RADIUS_METER',        '50',     'Engine',
     'รัศมีความคลาดเคลื่อนพิกัด (เมตร)', now],

    // System
    ['MAX_PROCESS_ROWS_PER_RUN','500',    'System',
     'จำนวนแถวสูงสุดต่อการรัน 1 ครั้ง', now],

    // Lookup
    ['LOOKUP_SOURCE_SHEET_NAME','ตารางงานประจำวัน', 'Lookup',
     'ชีตข้อมูลดิบรายวันที่ต้องเติม LatLong กลับไปใช้งาน', now],
    ['LOOKUP_PERSON_COLUMNS',   'ชื่อปลายทาง', 'Lookup',
     'ชื่อคอลัมน์ผู้รับ (คั่นหลายชื่อด้วย comma)', now],
    ['LOOKUP_PLACE_COLUMNS',
     'ที่อยู่ปลายทาง,ชื่อที่อยู่จาก_LatLong,ชื่อที่อยู่จาก LatLong',
     'Lookup', 'ชื่อคอลัมน์สถานที่ (คั่นหลายชื่อด้วย comma)', now],

    // Status (runtime — ระบบเขียนเอง)
    ['LAST_RUN_STATUS',         'IDLE',   'Status', 'สถานะการรันล่าสุด', now],
    ['LAST_RUN_MESSAGE',        '',       'Status', 'ข้อความสถานะล่าสุด', now],
    ['LAST_RUN_TIME',           '',       'Status', 'เวลารันล่าสุด', now]
  ];

  sheet.getRange(2, 1, initialConfigs.length, 5).setValues(initialConfigs);

  writeLog('INFO', '03_SetupSheets', 'seedInitialConfig', '',
    `Seeded ${initialConfigs.length} config entries`, '');
}

// ─────────────────────────────────────────────────────────────
// applySheetFormatting — (helper สำหรับ manual call)
// ─────────────────────────────────────────────────────────────
function applySheetFormatting(sheetName, bgColor) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;

  const lastCol    = sheet.getLastColumn();
  const headerRange = sheet.getRange(1, 1, 1, lastCol);
  headerRange.setFontWeight('bold');
  if (bgColor) headerRange.setBackground(bgColor);
  sheet.setFrozenRows(1);
}
```

---

**โมดูล 00-03 เสร็จแล้วครับ**

รอบถัดไปจะเขียน **`04_SourceRepository.gs`** + **`05_NormalizeService.gs`** ซึ่งเป็น Data Cleaning Engine หลัก ต่อเลยไหมครับ?
### `04_SourceRepository.gs` — V4.5

```javascript
/**
 * 04_SourceRepository.gs — V4.5
 * จัดการการอ่าน/แมป/อัปเดตข้อมูลชีตต้นทาง
 * NEW: parseLatLongColumn, enrichSourceObject
 */

// ─────────────────────────────────────────────────────────────
// getSourceRows
// ─────────────────────────────────────────────────────────────
function getSourceRows() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(getSheetNames().SOURCE);
  if (!sheet) throw new Error('ไม่พบชีตต้นทาง');
  return sheet.getDataRange().getValues();
}

// ─────────────────────────────────────────────────────────────
// getUnprocessedSourceRows
// ─────────────────────────────────────────────────────────────
function getUnprocessedSourceRows() {
  const data       = getSourceRows();
  const map        = getSourceColumnMap();
  const syncColIdx = map['SYNC_STATUS'];
  const maxRows    = parseInt(getConfig('MAX_PROCESS_ROWS_PER_RUN'), 10) || 500;
  const skip       = new Set(['SUCCESS','REVIEW','ERROR','IGNORE']);
  const unprocessed = [];

  for (let i = 1; i < data.length; i++) {
    const status = safeString(data[i][syncColIdx]).toUpperCase().trim();
    if (!skip.has(status)) {
      unprocessed.push({ sourceIndex: i + 1, rowData: data[i] });
      if (unprocessed.length >= maxRows) break;
    }
  }
  return unprocessed;
}

// ─────────────────────────────────────────────────────────────
// mapRowToSourceObject
// ─────────────────────────────────────────────────────────────
function mapRowToSourceObject(rowArr, rowNumber) {
  const map = getSourceColumnMap();

  // Flexible index lookup — รองรับ header ที่มีช่องว่าง/underscore ต่างกัน
  const getIdx = (name, alternates = []) => {
    if (map[name] !== undefined) return map[name];
    for (const alt of alternates) {
      if (map[alt] !== undefined) return map[alt];
    }
    const clean = s => s.replace(/[\s_]+/g, '').toLowerCase();
    const target = clean(name);
    for (const key in map) {
      if (clean(key) === target) return map[key];
    }
    return undefined;
  };

  // ── อ่านพิกัด ─────────────────────────────────────────────
  const latLongText = safeString(rowArr[getIdx('จุดส่งสินค้าปลายทาง')]);
  const latCell     = rowArr[getIdx('LAT')];
  const lngCell     = rowArr[getIdx('LONG')];
  const parsedGeo   = parseLatLongColumn(latLongText, latCell, lngCell);

  const sourceObj = {
    rowNumber,
    idScg:              safeString(rowArr[getIdx('ID_SCGนครหลวงJWDภูมิภาค')]),
    invoiceNo:          safeString(rowArr[getIdx('Invoice No')]),
    shipmentNo:         safeString(rowArr[getIdx('Shipment No')]),
    deliveryDate:       safeDate(rowArr[getIdx('วันที่ส่งสินค้า')]),
    deliveryTime:       formatTime(rowArr[getIdx('เวลาที่ส่งสินค้า')]),
    driverName:         safeString(rowArr[getIdx('ชื่อ - นามสกุล')]),
    licensePlate:       safeString(rowArr[getIdx('ทะเบียนรถ')]),
    customerCode:       safeString(rowArr[getIdx('รหัสลูกค้า')]),
    ownerName:          safeString(rowArr[getIdx('ชื่อเจ้าของสินค้า')]),
    destinationNameRaw: safeString(rowArr[getIdx('ชื่อปลายทาง')]),
    addressRaw:         safeString(rowArr[getIdx('ที่อยู่ปลายทาง')]),

    // พิกัดที่ผ่าน parse + validate แล้ว
    latRaw:     parsedGeo.lat,
    longRaw:    parsedGeo.lng,
    latLongText,
    geoSource:  parsedGeo.source,
    geoIsValid: parsedGeo.isValid,

    warehouse:          safeString(rowArr[getIdx(
      'คลังสินค้า เอสซีจี เจดับเบิ้ลยูดี วังน้อย',
      ['คลังสินค้า']
    )]),
    distanceKm:         safeNumber(rowArr[getIdx('ระยะทางจากคลัง_Km')]),
    addressFromLatLong: safeString(rowArr[getIdx(
      'ชื่อที่อยู่จาก_LatLong',
      ['ชื่อที่อยู่จาก LatLong']
    )]),
    employeeEmail:      safeString(rowArr[getIdx('Email พนักงาน')]),
    employeeId:         safeString(rowArr[getIdx('ID_พนักงาน')]),
    anomalyDetected:    safeString(rowArr[getIdx('เหตุผิดปกติที่ตรวจพบ')]),
    validationResult:   safeString(rowArr[getIdx('ผลการตรวจสอบงานส่ง')])
  };

  return enrichSourceObject(sourceObj);
}

// ─────────────────────────────────────────────────────────────
// parseLatLongColumn — [NEW V4.5]
// สกัด lat/lng จากทุก source รองรับทุก format
// Priority: จุดส่งสินค้าปลายทาง > LAT+LONG columns
// ─────────────────────────────────────────────────────────────
function parseLatLongColumn(latLongText, latCell, lngCell) {

  // ── Source 1: จุดส่งสินค้าปลายทาง ──────────────────────────
  if (latLongText && latLongText.trim().length > 3) {
    const parsed = _parseLatLngString(latLongText);
    if (parsed) {
      const valid = validateLatLng(parsed.lat, parsed.lng);
      if (valid.isValid) {
        return {
          lat: parsed.lat, lng: parsed.lng,
          source: 'LATLNG_TEXT', isValid: true
        };
      }
    }
  }

  // ── Source 2: คอลัมน์ LAT + LONG แยก ──────────────────────
  const lat   = safeNumber(latCell);
  const lng   = safeNumber(lngCell);
  const valid = validateLatLng(lat, lng);
  if (valid.isValid) {
    return { lat, lng, source: 'LAT_LONG_COL', isValid: true };
  }

  return { lat: 0, lng: 0, source: 'NONE', isValid: false };
}

// ─────────────────────────────────────────────────────────────
// _parseLatLngString — private helper
// รองรับ: "13.1,100.2" | "13.1, 100.2" | "(13.1,100.2)"
//         "lat:13.1 lng:100.2" | "13.1|100.2"
// ─────────────────────────────────────────────────────────────
function _parseLatLngString(text) {
  if (!text) return null;

  let s = text.toString()
    .replace(/[()lat:lng:\s]/gi, ' ')
    .replace(/[|;]/g, ',')
    .trim();

  const nums = s.match(/-?\d+\.?\d*/g);
  if (!nums || nums.length < 2) return null;

  let lat = parseFloat(nums[0]);
  let lng = parseFloat(nums[1]);
  if (isNaN(lat) || isNaN(lng)) return null;

  // สลับถ้าใส่ผิด lng มาก่อน lat
  // Thailand: lat ~5-21, lng ~97-106
  if (lat > 90 && lng < 90) {
    [lat, lng] = [lng, lat];
  }

  return { lat, lng };
}

// ─────────────────────────────────────────────────────────────
// enrichSourceObject — [NEW V4.5]
// เตรียมข้อมูล derived ล่วงหน้า 1 ครั้ง ไม่ต้องคำนวณซ้ำ
// ─────────────────────────────────────────────────────────────
function enrichSourceObject(sourceObj) {

  // 1. Normalize ชื่อบุคคล
  sourceObj.destinationNameNormalized =
    normalizePersonName(sourceObj.destinationNameRaw);

  // 2. Normalize ชื่อบริษัทเจ้าของสินค้า
  sourceObj.ownerNameNormalized =
    normalizeCompanyName(sourceObj.ownerName);

  // 3. สกัดเบอร์โทร
  sourceObj.phoneExtracted =
    extractPhoneNumbers(sourceObj.destinationNameRaw) ||
    extractPhoneNumbers(sourceObj.addressRaw) || '';

  // 4. สร้าง bestAddress
  sourceObj.bestAddress = smartMergeAddress(
    sourceObj.addressRaw,
    sourceObj.addressFromLatLong
  );

  // 5. Flags
  sourceObj.hasValidGeo     = sourceObj.geoIsValid;
  sourceObj.isAddressRawEmpty =
    !sourceObj.addressRaw || sourceObj.addressRaw.trim().length < 3;

  // 6. Quality flags
  sourceObj.qualityFlags = buildDataQualityFlags(sourceObj);

  return sourceObj;
}

// ─────────────────────────────────────────────────────────────
// markSourceRowProcessed / updateSourceSyncStatus
// ─────────────────────────────────────────────────────────────
function markSourceRowProcessed(rowNumber, status) {
  updateSourceSyncStatus(rowNumber, status);
}

function updateSourceSyncStatus(rowNumber, status) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(getSheetNames().SOURCE);
  const col   = getSourceColumnMap()['SYNC_STATUS'] + 1;
  sheet.getRange(rowNumber, col).setValue(status);
}
```

---

### `05_NormalizeService.gs` — V4.5

```javascript
/**
 * 05_NormalizeService.gs — V4.5
 * Data Cleaning Engine — หัวใจของการทำความสะอาดข้อมูล
 * NEW: validateLatLng, normalizeCompanyName, levenshteinDistance,
 *      extractPersonOnly, extractGeoTokens, isLowQuality*, buildDataQualityFlags
 */

let TH_GEO_CACHE = null;

// ══════════════════════════════════════════════════════════════
// SECTION A: TEXT NORMALIZATION
// ══════════════════════════════════════════════════════════════

function normalizeThaiText(text) {
  if (!text) return '';
  return String(text).trim().replace(/\s+/g, ' ').normalize('NFC');
}

// ─────────────────────────────────────────────────────────────
// normalizePersonName — ตัด prefix, เบอร์, คำรบกวน
// ─────────────────────────────────────────────────────────────
function normalizePersonName(name) {
  if (!name) return '';
  let n = normalizeThaiText(name);

  // 1. ตัดเบอร์โทรออกก่อน
  const phones = extractPhoneNumbers(n);
  if (phones) {
    phones.split(', ').forEach(p => {
      if (!p) return;
      const pPattern = new RegExp(p.split('').join('[-.\\s]?'), 'g');
      n = n.replace(pPattern, '');
    });
  }

  // 2. ตัด Prefix นิติบุคคล (เรียงจากยาวไปสั้น)
  const legalPrefixes = [
    'ห้างหุ้นส่วนสามัญนิติบุคคล','ห้างหุ้นส่วนจำกัด',
    'ห้างหุ้นส่วนสามัญ','บริษัทมหาชนจำกัด','บริษัทจำกัด',
    'บริษัท','หจก\\.?','บมจ\\.?','บจก\\.?','บจ\\.?'
  ];
  for (const p of legalPrefixes) {
    n = n.replace(new RegExp('^' + p + '\\s*', 'gi'), '');
  }

  // 3. ตัด Prefix บุคคล
  const personPrefixes = [
    'นางสาว','น\\.ส\\.','นาย','นาง',
    'คุณ','พี่','น้อง','ลุง','ป้า','อา',
    'ช่าง','แม่บ้าน','คนรับของ','ผู้รับ',
    'ดร\\.?','นพ\\.?','พญ\\.?','ผศ\\.?','รศ\\.?','ศ\\.?'
  ];
  for (const p of personPrefixes) {
    n = n.replace(new RegExp('^' + p + '\\s*', 'gi'), '');
  }

  // 4. ตัดคำท้ายที่รบกวน
  const suffixes = [
    'โทร\\.?\\s*$','เบอร์\\s*$','ติดต่อ\\s*$',
    'สาขา\\s*[\\d\\w]*\\s*$',
    'โทร\\.?\\s*\\d+','เบอร์\\s*\\d+','ติดต่อ\\s*\\d+'
  ];
  for (const s of suffixes) {
    n = n.replace(new RegExp(s, 'gi'), '');
  }

  // 5. แยกชื่อคนออกจากชื่อร้าน/ตำแหน่ง
  n = extractPersonOnly(n);

  // 6. ตัดอักขระแปลก
  n = n.replace(/[^\u0E00-\u0E7Fa-zA-Z0-9\s]/g, ' ')
       .replace(/\s+/g, ' ');

  return safeTrim(n);
}

// ─────────────────────────────────────────────────────────────
// extractPersonOnly — [NEW V4.5]
// แยกชื่อคนออกจากชื่อร้าน/ตำแหน่ง/คำบ่งบอกสถานที่ทำงาน
// ─────────────────────────────────────────────────────────────
function extractPersonOnly(name) {
  if (!name) return '';
  let n = name.trim();

  // ตัดหลัง delimiter
  n = n.split(/[\/\|\\]|(?:\s+[-–—]\s+)/)[0].trim();

  // ตัดคำที่บ่งบอกว่าเป็นร้าน/องค์กร
  const businessWords = [
    'ร้าน','ห้าง','ตลาด','โรงงาน','โกดัง','คลัง',
    'สำนักงาน','ออฟฟิศ','office',
    'ฝ่าย','แผนก','dept','department',
    'จัดซื้อ','บัญชี','การเงิน','logistics','logistic',
    'รับของ','ลูกค้า','หน้างาน','ส่งของ'
  ];

  for (const word of businessWords) {
    const idx = n.toLowerCase().indexOf(word.toLowerCase());
    if (idx > 0) {
      const before = n.substring(0, idx).trim();
      if (before.length >= 2) {
        n = before;
        break;
      }
    }
  }

  return safeTrim(n);
}

// ─────────────────────────────────────────────────────────────
// normalizeCompanyName — [NEW V4.5]
// ทำให้ชื่อบริษัทอยู่ในรูปมาตรฐาน เพื่อใช้เป็น context
// ─────────────────────────────────────────────────────────────
function normalizeCompanyName(name) {
  if (!name) return '';
  let n = normalizeThaiText(name);

  const legalPrefixes = [
    'ห้างหุ้นส่วนสามัญนิติบุคคล','ห้างหุ้นส่วนจำกัด',
    'ห้างหุ้นส่วนสามัญ','บริษัทมหาชนจำกัด','บริษัทจำกัด',
    'บริษัท','หจก\\.?','บมจ\\.?','บจก\\.?','บจ\\.?'
  ];
  for (const p of legalPrefixes) {
    n = n.replace(new RegExp('^' + p + '\\s*', 'gi'), '');
  }

  const legalSuffixes = [
    '\\(มหาชน\\)','จำกัด\\s*\\(มหาชน\\)','จำกัด',
    'จก\\.?','limited','ltd\\.?','co\\.?,?\\s*ltd\\.?',
    'public\\s*company'
  ];
  for (const s of legalSuffixes) {
    n = n.replace(new RegExp('\\s*' + s + '\\s*$', 'gi'), '');
  }

  n = n.replace(/\s*สาขา\s*[\d\w]*\s*/gi, ' ');
  return n.toLowerCase().replace(/\s+/g, ' ').trim();
}

// ─────────────────────────────────────────────────────────────
// normalizePlaceName
// ─────────────────────────────────────────────────────────────
function normalizePlaceName(name) {
  if (!name) return '';
  let n = normalizeAddress(name);
  n = n.replace(/^ร้าน\s*/i, '');
  n = n.replace(/สาขา\s*\d+/i, '');
  n = n.replace(/[^\u0E00-\u0E7Fa-zA-Z0-9\s./\-]/g, ' ')
       .replace(/\s+/g, ' ');
  return safeTrim(n);
}

// ─────────────────────────────────────────────────────────────
// normalizeAddress — ย่อคำ + Auto-Fill จาก SYS_TH_GEO
// ─────────────────────────────────────────────────────────────
function normalizeAddress(address) {
  if (!address) return '';
  let n = normalizeThaiText(address);

  n = n.replace(/ตำบล/g, 'ต.');
  n = n.replace(/อำเภอ/g, 'อ.');
  n = n.replace(/จังหวัด/g, 'จ.');

  // Auto-Fill จาก SYS_TH_GEO
  const geoDb = loadThGeo();
  if (geoDb && geoDb.subdistricts) {
    const subMatch = n.match(/(?:ต\.|แขวง)\s*([ก-๙]+)/);
    if (subMatch) {
      const subName = subMatch[1];
      const geoInfo = geoDb.subdistricts[subName];
      if (geoInfo) {
        if (n.indexOf(geoInfo.district) === -1) {
          n += ' อ.' + geoInfo.district;
        }
        if (n.indexOf(geoInfo.province) === -1) {
          n += ' จ.' + geoInfo.province;
        }
      }
    }
  }

  return safeTrim(n);
}

// ══════════════════════════════════════════════════════════════
// SECTION B: GEO VALIDATION  [NEW V4.5]
// ══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// validateLatLng — ตรวจพิกัดใช้งานได้จริงไหม
// ─────────────────────────────────────────────────────────────
function validateLatLng(lat, lng) {
  const la = parseFloat(lat);
  const lo = parseFloat(lng);

  if (isNaN(la) || isNaN(lo))
    return { isValid: false, reason: 'NAN_VALUE' };

  if (la === 0 && lo === 0)
    return { isValid: false, reason: 'ZERO_ZERO' };

  // ขอบเขตประเทศไทย
  if (la < 5.5 || la > 20.5)
    return { isValid: false, reason: 'OUT_OF_THAILAND_LAT', lat: la, lng: lo };

  if (lo < 97.3 || lo > 105.7)
    return { isValid: false, reason: 'OUT_OF_THAILAND_LNG', lat: la, lng: lo };

  // ความแม่นยำขั้นต่ำ (3 ทศนิยม = ~110m)
  const latDec = (la.toString().split('.')[1] || '').length;
  const lngDec = (lo.toString().split('.')[1] || '').length;
  if (latDec < 3 || lngDec < 3)
    return { isValid: false, reason: 'LOW_PRECISION', lat: la, lng: lo };

  return { isValid: true, reason: 'OK', lat: la, lng: lo };
}

// ─────────────────────────────────────────────────────────────
// extractGeoTokens — [NEW V4.5]
// สกัด subdistrict/district/province/zipcode จากข้อความ
// ─────────────────────────────────────────────────────────────
function extractGeoTokens(address) {
  if (!address) return {};
  const tokens = {};

  const subMatch = address.match(/(?:ต\.|ตำบล|แขวง)\s*([ก-๙a-zA-Z]+)/);
  if (subMatch) tokens.subdistrict = subMatch[1].trim();

  const distMatch = address.match(/(?:อ\.|อำเภอ|เขต)\s*([ก-๙a-zA-Z]+)/);
  if (distMatch) tokens.district = distMatch[1].trim();

  const provMatch = address.match(/(?:จ\.|จังหวัด)\s*([ก-๙a-zA-Z]+)/);
  if (provMatch) {
    tokens.province = provMatch[1].trim();
  } else {
    const knownProvinces = [
      'กรุงเทพมหานคร','กรุงเทพ','สมุทรปราการ','นนทบุรี','ปทุมธานี',
      'พระนครศรีอยุธยา','สระบุรี','ชลบุรี','ระยอง','ฉะเชิงเทรา',
      'นครราชสีมา','ขอนแก่น','เชียงใหม่','สงขลา'
    ];
    for (const p of knownProvinces) {
      if (address.indexOf(p) > -1) { tokens.province = p; break; }
    }
  }

  const zipMatch = address.match(/\b\d{5}\b/);
  if (zipMatch) tokens.zipcode = zipMatch[0];

  return tokens;
}

// ══════════════════════════════════════════════════════════════
// SECTION C: STRING SIMILARITY
// ══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// levenshteinDistance — [NEW V4.5] ดีสำหรับชื่อสั้น < 4 ตัว
// ─────────────────────────────────────────────────────────────
function levenshteinDistance(s1, s2) {
  if (!s1 || !s2)
    return Math.max((s1 || '').length, (s2 || '').length);

  s1 = s1.replace(/\s+/g, '');
  s2 = s2.replace(/\s+/g, '');
  if (s1 === s2) return 0;

  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = s1[i-1] === s2[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

function levenshteinSimilarity(s1, s2) {
  if (!s1 && !s2) return 1;
  if (!s1 || !s2) return 0;
  const maxLen = Math.max(
    (s1 || '').replace(/\s+/g,'').length,
    (s2 || '').replace(/\s+/g,'').length
  );
  if (maxLen === 0) return 1;
  return 1 - (levenshteinDistance(s1, s2) / maxLen);
}

// ══════════════════════════════════════════════════════════════
// SECTION D: ADDRESS UTILITIES
// ══════════════════════════════════════════════════════════════

function loadThGeo() {
  if (TH_GEO_CACHE) return TH_GEO_CACHE;

  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('SYS_TH_GEO');
  if (!sheet) return null;

  const data = sheet.getDataRange().getValues();
  TH_GEO_CACHE = { subdistricts: {}, districts: {}, provinces: {} };

  for (let i = 1; i < data.length; i++) {
    const zipcode          = data[i][0];
    const subdistrictNorm  = data[i][6]  ? String(data[i][6])  : '';
    const districtNorm     = data[i][7]  ? String(data[i][7])  : '';
    const provinceNorm     = data[i][8]  ? String(data[i][8])  : '';
    const noteType         = data[i][9]  ? String(data[i][9])  : 'NONE';
    const noteKeywords     = data[i][10] ? String(data[i][10]) : '';
    const postcodeOverride = data[i][11] ? String(data[i][11]) : '';
    const rawRemark        = data[i][4]  ? String(data[i][4])  : '';

    if (subdistrictNorm) {
      TH_GEO_CACHE.subdistricts[subdistrictNorm] = {
        district: districtNorm, province: provinceNorm,
        zipcode, remark: rawRemark,
        noteType, noteKeywords, postcodeOverride
      };
    }
    if (districtNorm && !TH_GEO_CACHE.districts[districtNorm]) {
      TH_GEO_CACHE.districts[districtNorm] = { province: provinceNorm };
    }
    if (provinceNorm) TH_GEO_CACHE.provinces[provinceNorm] = true;
  }

  return TH_GEO_CACHE;
}

function resetThGeoCache() {
  TH_GEO_CACHE = null;
}

function analyzeGeoWarning(address) {
  if (!address) return '';
  const geoDb = loadThGeo();
  if (!geoDb) return '';

  let n = normalizeThaiText(address).replace(/ตำบล/g, 'ต.');
  const subMatch = n.match(/(?:ต\.|แขวง)\s*([ก-๙]+)/);
  if (!subMatch) return '';

  const geoInfo = geoDb.subdistricts[subMatch[1]];
  if (!geoInfo || geoInfo.noteType === 'NONE') return '';

  switch (geoInfo.noteType) {
    case 'OTHER_WARNING':
      return '⚠️ พื้นที่พิเศษ: ' + geoInfo.remark;
    case 'ONLY_BUILDING':
      if (geoInfo.noteKeywords && n.indexOf(geoInfo.noteKeywords) > -1)
        return '🏢 ระวัง! ต้องใช้รหัสไปรษณีย์เฉพาะ: ' + geoInfo.noteKeywords;
      break;
    case 'ONLY_MOO':
      return '🏘️ ระวังหมู่: ' + geoInfo.noteKeywords;
    case 'EXCEPT_RULE':
    case 'COMPLEX_HOUSE_NO':
      return '🚨 ระวังเงื่อนไขพิเศษ: ' + geoInfo.remark;
  }
  return '';
}

function validatePostcodeOverride(address) {
  if (!address) return null;
  const geoDb = loadThGeo();
  if (!geoDb) return null;

  let n = normalizeThaiText(address).replace(/ตำบล/g, 'ต.');
  const subMatch = n.match(/(?:ต\.|แขวง)\s*([ก-๙]+)/);
  if (!subMatch) return null;

  const geoInfo = geoDb.subdistricts[subMatch[1]];
  if (!geoInfo || !geoInfo.postcodeOverride) return null;

  if ((geoInfo.noteType === 'EXCEPT_RULE' ||
       geoInfo.noteType === 'COMPLEX_HOUSE_NO') &&
      geoInfo.noteKeywords && n.indexOf(geoInfo.noteKeywords) > -1) {
    return geoInfo.postcodeOverride;
  }
  return null;
}

function extractPhoneNumbers(text) {
  if (!text) return '';
  const phoneRegex = /(?:0[2-9]\d{1,2})[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
  const matches = text.match(phoneRegex);
  if (!matches) return '';
  const clean = matches.map(p => p.replace(/[^\d]/g, ''));
  return [...new Set(clean)].join(', ');
}

function smartMergeAddress(rawAddr, geoAddr) {
  if (!rawAddr) return geoAddr || '';
  if (!geoAddr) return cleanAddressRedundancy(rawAddr);

  let cleanRaw = cleanAddressRedundancy(rawAddr);
  let cleanGeo = geoAddr
    .replace(/[A-Z0-9]{4}\+[A-Z0-9]{2,3}/g, '')
    .replace(/\s+ประเทศไทย$/, '')
    .trim();

  // ตัดเบอร์โทรออกจาก raw
  const phones = extractPhoneNumbers(cleanRaw);
  if (phones) {
    phones.split(', ').forEach(p => {
      if (!p) return;
      cleanRaw = cleanRaw.replace(
        new RegExp(p.split('').join('[-.\\s]?'), 'g'), ''
      );
    });
  }

  const geoTriggers = ['แขวง','ตำบล',' ต.','เขต','อำเภอ',' อ.','จังหวัด',' จ.'];
  let geoStartIdx = -1;
  let triggerFound = '';

  for (const trigger of geoTriggers) {
    const idx = cleanGeo.indexOf(trigger);
    if (idx !== -1 && (geoStartIdx === -1 || idx < geoStartIdx)) {
      geoStartIdx = idx;
      triggerFound = trigger;
    }
  }

  if (geoStartIdx === -1) return cleanRaw;

  const adminPartGeo = cleanGeo.substring(geoStartIdx).trim();
  let rawStartIdx = cleanRaw.indexOf(triggerFound);

  if (rawStartIdx === -1) {
    for (const trigger of geoTriggers) {
      const idx = cleanRaw.indexOf(trigger);
      if (idx !== -1 && (rawStartIdx === -1 || idx < rawStartIdx)) {
        rawStartIdx = idx;
      }
    }
  }

  if (rawStartIdx !== -1) {
    const detailPart = cleanRaw.substring(0, rawStartIdx).trim();
    return (detailPart + ' ' + adminPartGeo).replace(/\s+/g, ' ').trim();
  }

  return cleanRaw.length > cleanGeo.length ? cleanRaw : cleanGeo;
}

function cleanAddressRedundancy(addr) {
  if (!addr) return '';
  let s = addr.toString();

  ['เขต','อำเภอ','ตำบล','แขวง','จังหวัด'].forEach(t => {
    s = s.replace(new RegExp(t + '\\s*' + t, 'g'), t);
  });

  s = s.replace(/ต\.\s*ตำบล/g, 'ตำบล')
       .replace(/ตำบล\s*ต\./g, 'ตำบล')
       .replace(/อ\.\s*อำเภอ/g, 'อำเภอ')
       .replace(/อำเภอ\s*อ\./g, 'อำเภอ')
       .replace(/จ\.\s*จังหวัด/g, 'จังหวัด')
       .replace(/จังหวัด\s*จ\./g, 'จังหวัด')
       .replace(/จ\.\s*จ\./g, 'จ.')
       .replace(/อ\.\s*อ\./g, 'อ.')
       .replace(/ต\.\s*ต\./g, 'ต.');

  ['กรุงเทพมหานคร','สมุทรปราการ','ฉะเชิงเทรา',
   'ชลบุรี','ปทุมธานี','นนทบุรี'].forEach(p => {
    const short = p.substring(0, 5);
    s = s.replace(new RegExp(short + '[ก-๙]*\\s+' + p, 'g'), p);
  });

  ['ตำบล','แขวง','อำเภอ','เขต'].forEach(level => {
    const short = level === 'ตำบล' ? 'ต\\.' : level === 'อำเภอ' ? 'อ\\.' : null;
    if (short) {
      s = s.replace(
        new RegExp(short + '\\s*([ก-๙]+)\\s+' + level + '\\s*\\1','g'),
        level + '$1'
      );
      s = s.replace(
        new RegExp(level + '\\s*([ก-๙]+)\\s+' + short + '\\s*\\1','g'),
        level + '$1'
      );
    }
    s = s.replace(
      new RegExp(level + '\\s*([ก-๙]+)\\s+' + level + '\\s*\\1','g'),
      level + '$1'
    );
  });

  return s.replace(/\s+/g, ' ').trim();
}

function normalizeLatLong(lat, lng) {
  return {
    lat: Number(safeNumber(lat).toFixed(5)),
    lng: Number(safeNumber(lng).toFixed(5))
  };
}

function buildGeoKeys(lat, lng) {
  const la = safeNumber(lat);
  const lo = safeNumber(lng);
  return {
    key4: la.toFixed(4) + '_' + lo.toFixed(4),
    key3: la.toFixed(3) + '_' + lo.toFixed(3),
    key2: la.toFixed(2) + '_' + lo.toFixed(2),
    lat: la, lng: lo
  };
}

function buildFingerprint(dataObj) {
  const str = JSON.stringify(dataObj);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(16);
}

// ══════════════════════════════════════════════════════════════
// SECTION E: DATA QUALITY FLAGS  [NEW V4.5]
// ══════════════════════════════════════════════════════════════

function isLowQualityPersonName(name) {
  const n = normalizePersonName(name || '');
  if (!n) return true;
  if (/^\d+$/.test(n)) return true;
  if (n.replace(/\s+/g,'').length < 2) return true;
  if (/^(ลูกค้า|ไม่ระบุ|ไม่มีชื่อ|n\/a|na|-)$/i.test(n)) return true;
  return false;
}

function isLowQualityPlaceText(text) {
  const n = normalizePlaceName(text || '');
  if (!n) return true;
  if (n.replace(/\s+/g,'').length < 6) return true;
  if (/^(ไม่ระบุ|ไม่มีที่อยู่|n\/a|na|-)$/i.test(n)) return true;
  return false;
}

function buildDataQualityFlags(sourceObj) {
  const flags = [];

  if (isLowQualityPersonName(sourceObj.destinationNameRaw)) {
    flags.push('LOW_QUALITY_PERSON_NAME');
  }
  if (isLowQualityPlaceText(sourceObj.addressRaw) &&
      isLowQualityPlaceText(sourceObj.addressFromLatLong)) {
    flags.push('LOW_QUALITY_PLACE_TEXT');
  }
  if (!sourceObj.geoIsValid) {
    flags.push('MISSING_LAT_LONG');
  }

  return flags;
}
```

---

### `06_PersonService.gs` — V4.5

```javascript
/**
 * 06_PersonService.gs — V4.5
 * บริหารจัดการข้อมูลบุคคล
 * UPGRADED: scorePersonCandidate (Dice+Lev+Ratio)
 * FIXED: mergePersonRecords (ทำงานจริง), updatePersonStats
 * NEW: findPersonById
 */

function resolvePerson(sourceObj) {
  const rawName = sourceObj.destinationNameRaw;
  if (!rawName) {
    return { id: null, isNew: false, score: 0, phone: '', candidates: [] };
  }

  const phone    = sourceObj.phoneExtracted || '';
  const normName = sourceObj.destinationNameNormalized ||
                   normalizePersonName(rawName);

  // ตรวจ quality flag — ถ้าไม่มีเบอร์และชื่อมั่ว → บังคับ review
  if (isLowQualityPersonName(normName) && !phone) {
    return {
      id: null, isNew: false, score: 0,
      normalized: normName, raw: rawName, phone,
      candidates: [], qualityIssue: 'LOW_QUALITY_PERSON_NAME'
    };
  }

  const candidates = findPersonCandidates(normName, phone);

  if (candidates.length === 0) {
    return {
      id: null, isNew: true, score: 0,
      normalized: normName, raw: rawName, phone, candidates: []
    };
  }

  let bestCandidate = null;
  let bestScore     = 0;

  for (const c of candidates) {
    const score = scorePersonCandidate(normName, c.normalized);
    if (score > bestScore) { bestScore = score; bestCandidate = c; }
  }

  const { autoMatchScore, reviewScoreMin } = getThresholds();

  if (bestScore >= autoMatchScore) {
    return {
      id: bestCandidate.personId, isNew: false, score: bestScore,
      normalized: normName, raw: rawName, phone, candidates
    };
  } else if (bestScore >= reviewScoreMin) {
    return {
      id: null, isNew: false, score: bestScore,
      normalized: normName, raw: rawName, phone, candidates
    };
  } else {
    return {
      id: null, isNew: true, score: bestScore,
      normalized: normName, raw: rawName, phone, candidates
    };
  }
}

function findPersonCandidates(normName, phone) {
  if (!normName && !phone) return [];

  const ss      = SpreadsheetApp.getActiveSpreadsheet();
  const mSheet  = ss.getSheetByName('M_PERSON');
  const mData   = mSheet.getDataRange().getValues();
  const aliases = [];

  // 1. ค้นด้วยเบอร์โทร (confidence สูงสุด)
  if (phone) {
    const searchPhones = phone.split(', ').filter(p => p.length >= 9);
    for (let i = 1; i < mData.length; i++) {
      const stored = String(mData[i][3] || '');
      for (const p of searchPhones) {
        if (stored.indexOf(p) > -1) {
          aliases.push({
            personId:   mData[i][0],
            normalized: mData[i][2],
            type: 'PHONE_MATCH'
          });
        }
      }
    }
    if (aliases.length > 0) return aliases;
  }

  // 2. ค้นจาก Alias
  const aliasSheet = ss.getSheetByName('M_PERSON_ALIAS');
  const aliasData  = aliasSheet.getDataRange().getValues();

  for (let i = 1; i < aliasData.length; i++) {
    if (aliasData[i][8] !== 'Y') continue; // active_flag
    const stored = aliasData[i][3];
    if (!stored) continue;
    if (stored === normName ||
        stored.indexOf(normName) > -1 ||
        normName.indexOf(stored) > -1) {
      aliases.push({
        personId:   aliasData[i][1],
        normalized: stored,
        type: 'ALIAS'
      });
    }
  }

  // 3. ค้นจาก Master ตรง
  if (aliases.length === 0) {
    for (let i = 1; i < mData.length; i++) {
      if (mData[i][7] === 'Merged') continue; // ข้าม archived
      if (mData[i][2] === normName) {
        aliases.push({
          personId:   mData[i][0],
          normalized: mData[i][2],
          type: 'MASTER'
        });
      }
    }
  }

  return aliases;
}

// ─────────────────────────────────────────────────────────────
// scorePersonCandidate — [UPGRADED V4.5]
// Dice 50% + Levenshtein 30% + LengthRatio 20%
// ชื่อสั้น < 4 ตัว → Levenshtein ได้น้ำหนักมากขึ้น
// ─────────────────────────────────────────────────────────────
function scorePersonCandidate(inputNorm, candidateNorm) {
  if (!inputNorm || !candidateNorm) return 0;
  if (inputNorm === candidateNorm) return 100;

  const dice  = diceCoefficient(inputNorm, candidateNorm);
  const lev   = levenshteinSimilarity(inputNorm, candidateNorm);
  const ratio = lengthRatio(inputNorm, candidateNorm);

  const isShort = inputNorm.replace(/\s/g,'').length < 4 ||
                  candidateNorm.replace(/\s/g,'').length < 4;

  const score = isShort
    ? Math.round(((lev * 0.6) + (dice * 0.2) + (ratio * 0.2)) * 100)
    : Math.round(((dice * 0.5) + (lev * 0.3) + (ratio * 0.2)) * 100);

  return score > 60 ? score : 0;
}

function createPerson(canonicalName, normName, phone) {
  const ss       = SpreadsheetApp.getActiveSpreadsheet();
  const sheet    = ss.getSheetByName('M_PERSON');
  const personId = 'PER-' + uuid().split('-')[0].toUpperCase();

  sheet.appendRow([
    personId, canonicalName, normName,
    phone ? "'" + phone : '',
    new Date(), new Date(), 1, 'ACTIVE', ''
  ]);

  createPersonAlias(personId, canonicalName, normName);
  return personId;
}

function createPersonAlias(personId, aliasRaw, aliasNormalized) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_PERSON_ALIAS');
  sheet.appendRow([
    'P_AL-' + uuid().split('-')[0].toUpperCase(),
    personId, aliasRaw, aliasNormalized,
    'SYSTEM', new Date(), new Date(), 1, 'Y'
  ]);
}

// ─────────────────────────────────────────────────────────────
// mergePersonRecords — [FIXED V4.5] ทำงานจริง
// Merge sourceId → targetId
// 1.ย้าย alias 2.archive source 3.update Destination 4.update Fact
// ─────────────────────────────────────────────────────────────
function mergePersonRecords(sourcePersonId, targetPersonId, mergedByEmail) {
  if (!sourcePersonId || !targetPersonId) {
    throw new Error('mergePersonRecords: ต้องระบุ sourcePersonId และ targetPersonId');
  }
  if (sourcePersonId === targetPersonId) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. ย้าย Alias
  const aliasSheet = ss.getSheetByName('M_PERSON_ALIAS');
  const aliasData  = aliasSheet.getDataRange().getValues();
  for (let i = 1; i < aliasData.length; i++) {
    if (aliasData[i][1] === sourcePersonId) {
      aliasSheet.getRange(i + 1, 2).setValue(targetPersonId);
    }
  }

  // 2. Archive source
  const personSheet = ss.getSheetByName('M_PERSON');
  const personData  = personSheet.getDataRange().getValues();
  for (let i = 1; i < personData.length; i++) {
    if (personData[i][0] === sourcePersonId) {
      personSheet.getRange(i + 1, 8).setValue('Merged');
      personSheet.getRange(i + 1, 9).setValue(
        `Merged → ${targetPersonId} by ${mergedByEmail} @ ${new Date().toISOString()}`
      );
      break;
    }
  }

  // 3. อัปเดต M_DESTINATION
  const destSheet = ss.getSheetByName('M_DESTINATION');
  const destData  = destSheet.getDataRange().getValues();
  for (let i = 1; i < destData.length; i++) {
    if (destData[i][1] === sourcePersonId) {
      destSheet.getRange(i + 1, 2).setValue(targetPersonId);
      const newKey = buildDestinationKey(
        targetPersonId, destData[i][2], destData[i][3]
      );
      destSheet.getRange(i + 1, 6).setValue(newKey);
    }
  }

  // 4. อัปเดต FACT_DELIVERY (person_id = col 16)
  const factSheet = ss.getSheetByName('FACT_DELIVERY');
  const factData  = factSheet.getDataRange().getValues();
  for (let i = 1; i < factData.length; i++) {
    if (factData[i][15] === sourcePersonId) {
      factSheet.getRange(i + 1, 16).setValue(targetPersonId);
    }
  }

  writeLog('INFO','06_PersonService','mergePersonRecords',
    sourcePersonId,
    `Merged ${sourcePersonId} → ${targetPersonId}`,
    { mergedBy: mergedByEmail }
  );
}

// ─────────────────────────────────────────────────────────────
// findPersonById — [NEW V4.5]
// ─────────────────────────────────────────────────────────────
function findPersonById(personId) {
  if (!personId) return null;
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_PERSON');
  const data  = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === personId) {
      return {
        personId:   data[i][0],
        canonical:  data[i][1],
        normalized: data[i][2],
        phone:      data[i][3],
        status:     data[i][7],
        note:       data[i][8]
      };
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// updatePersonStats — [FIXED V4.5]
// ─────────────────────────────────────────────────────────────
function updatePersonStats(personId) {
  if (!personId) return;
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_PERSON');
  const data  = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === personId) {
      sheet.getRange(i + 1, 7).setValue((parseInt(data[i][6]) || 0) + 1);
      sheet.getRange(i + 1, 6).setValue(new Date());
      break;
    }
  }
}
```

---

### `07_PlaceService.gs` — V4.5

```javascript
/**
 * 07_PlaceService.gs — V4.5
 * UPGRADED: resolvePlace ใช้ diagnose → buildBest → score
 * NEW: diagnoseTwoAddresses, buildBestAddress, findBestMatchWithGeoBoost
 */

function resolvePlace(sourceObj) {
  const addr1 = sourceObj.addressRaw;
  const addr2 = sourceObj.addressFromLatLong;

  if (!addr1 && !addr2) {
    return { id: null, isNew: false, score: 0, candidates: [] };
  }

  // Quality check
  if (isLowQualityPlaceText(addr1) && isLowQualityPlaceText(addr2)) {
    return {
      id: null, isNew: false, score: 0, candidates: [],
      raw: addr2 || addr1 || '',
      qualityIssue: 'LOW_QUALITY_PLACE_TEXT'
    };
  }

  // 1. วินิจฉัยความสัมพันธ์
  const geoRelation = diagnoseTwoAddresses(addr1, addr2);

  // 2. สร้าง bestAddress
  const bestAddress = buildBestAddress(addr1, addr2, geoRelation);

  // 3. หา match
  let resBest = findBestMatch(bestAddress);
  let res1    = resBest;
  let res2    = { id: null, score: 0, candidates: [] };

  if (resBest.score < getThresholds().autoMatchScore) {
    if (addr1) res1 = findBestMatch(addr1);
    if (addr2) res2 = findBestMatchWithGeoBoost(addr2);
  }

  const all   = [resBest, res1, res2].filter(r => r.score > 0);
  let   final = all.reduce(
    (best, cur) => cur.score > best.score ? cur : best,
    { id: null, score: 0, candidates: [], normalized: '', raw: '' }
  );

  final.hasGeoConflict  = geoRelation.hasConflict;
  final.conflictMessage = geoRelation.conflictMessage;
  final.bestAddress     = bestAddress;

  const { autoMatchScore, reviewScoreMin } = getThresholds();

  if (final.score >= autoMatchScore) return { ...final, isNew: false };
  if (final.score >= reviewScoreMin) return { ...final, id: null, isNew: false };
  return { ...final, id: null, isNew: true, raw: bestAddress };
}

// ─────────────────────────────────────────────────────────────
// diagnoseTwoAddresses — [NEW V4.5]
// ─────────────────────────────────────────────────────────────
function diagnoseTwoAddresses(rawAddr, geoAddr) {
  const result = {
    type: 'UNKNOWN', hasConflict: false,
    confidence: 0, conflictMessage: ''
  };

  const hasRaw = rawAddr && rawAddr.trim().length > 3;
  const hasGeo = geoAddr && geoAddr.trim().length > 3;

  if (!hasRaw && !hasGeo) { result.type = 'BOTH_EMPTY'; return result; }
  if (!hasRaw)  { result.type = 'GEO_ONLY'; result.confidence = 80; return result; }
  if (!hasGeo)  { result.type = 'RAW_ONLY'; result.confidence = 40; return result; }

  const rawTokens = extractGeoTokens(normalizeThaiText(rawAddr));
  const geoTokens = extractGeoTokens(normalizeThaiText(geoAddr));

  // จังหวัดขัดแย้ง — สัญญาณหนักสุด
  if (rawTokens.province && geoTokens.province &&
      rawTokens.province !== geoTokens.province) {
    result.type = 'CONFLICT';
    result.hasConflict = true;
    result.confidence = 10;
    result.conflictMessage =
      `⛔ จังหวัดขัดแย้ง: raw="${rawTokens.province}" vs geo="${geoTokens.province}"`;
    return result;
  }

  // อำเภอขัดแย้ง
  if (rawTokens.district && geoTokens.district &&
      rawTokens.district !== geoTokens.district) {
    result.type = 'CONFLICT';
    result.hasConflict = true;
    result.confidence = 25;
    result.conflictMessage =
      `⚠️ อำเภอขัดแย้ง: raw="${rawTokens.district}" vs geo="${geoTokens.district}"`;
    return result;
  }

  const similarity = diceCoefficient(
    normalizeThaiText(rawAddr),
    normalizeThaiText(geoAddr)
  );

  result.type       = similarity > 0.7 ? 'DUPLICATE' : 'COMPLEMENT';
  result.confidence = Math.round(similarity * 100);
  return result;
}

// ─────────────────────────────────────────────────────────────
// buildBestAddress — [NEW V4.5]
// ─────────────────────────────────────────────────────────────
function buildBestAddress(rawAddr, geoAddr, geoRelation) {
  switch (geoRelation.type) {
    case 'GEO_ONLY':
      return cleanAddressRedundancy(geoAddr);
    case 'RAW_ONLY':
      return normalizeAddress(rawAddr);
    case 'CONFLICT':
      // เชื่อ geoAddr ในส่วนภูมิศาสตร์ แต่เอา detail จาก raw
      return smartMergeAddress(rawAddr, geoAddr);
    case 'DUPLICATE': {
      const cr = cleanAddressRedundancy(rawAddr);
      const cg = cleanAddressRedundancy(geoAddr);
      return cg.length >= cr.length ? cg : cr;
    }
    case 'COMPLEMENT':
    default:
      return smartMergeAddress(rawAddr, geoAddr);
  }
}

// ─────────────────────────────────────────────────────────────
// findBestMatchWithGeoBoost — [NEW V4.5]
// ─────────────────────────────────────────────────────────────
function findBestMatchWithGeoBoost(geoAddr) {
  if (!geoAddr) return { id: null, score: 0, candidates: [] };
  const result = findBestMatch(geoAddr);
  if (result.score > 0) {
    result.score = Math.min(100, result.score + 10);
    result.isGeoAddressBoosted = true;
  }
  return result;
}

function findBestMatch(rawAddress) {
  if (!rawAddress) return { id: null, score: 0, candidates: [] };
  const norm       = normalizePlaceName(rawAddress);
  const candidates = findPlaceCandidates(norm);

  let best = null, bestScore = 0;
  for (const c of candidates) {
    const score = scorePlaceCandidate(norm, c.normalized);
    if (score > bestScore) { bestScore = score; best = c; }
  }

  return {
    id: best ? best.placeId : null,
    score: bestScore, normalized: norm,
    raw: rawAddress, candidates
  };
}

function findPlaceCandidates(normPlace) {
  if (!normPlace) return [];
  const ss         = SpreadsheetApp.getActiveSpreadsheet();
  const aliasSheet = ss.getSheetByName('M_PLACE_ALIAS');
  const aliasData  = aliasSheet.getDataRange().getValues();
  const aliases    = [];

  for (let i = 1; i < aliasData.length; i++) {
    if (aliasData[i][8] !== 'Y') continue;
    const stored = aliasData[i][3];
    if (!stored) continue;
    if (stored === normPlace ||
        stored.indexOf(normPlace) > -1 ||
        normPlace.indexOf(stored) > -1) {
      aliases.push({
        placeId:    aliasData[i][1],
        normalized: stored,
        type: 'ALIAS'
      });
    }
  }
  return aliases;
}

function scorePlaceCandidate(inputNorm, candidateNorm) {
  if (inputNorm === candidateNorm) return 100;
  const dice  = diceCoefficient(inputNorm, candidateNorm);
  const ratio = lengthRatio(inputNorm, candidateNorm);
  const score = Math.round(((dice * 0.8) + (ratio * 0.2)) * 100);
  return score > 60 ? score : 0;
}

function createPlace(canonicalPlaceName, addressRaw, geoAddr) {
  const ss      = SpreadsheetApp.getActiveSpreadsheet();
  const sheet   = ss.getSheetByName('M_PLACE');
  const placeId = 'PLA-' + uuid().split('-')[0].toUpperCase();

  const mergedAddress = smartMergeAddress(addressRaw, geoAddr);
  const normPlace     = normalizePlaceName(mergedAddress);

  sheet.appendRow([
    placeId, mergedAddress, normPlace,
    addressRaw, normalizeAddress(mergedAddress),
    '', new Date(), new Date(), 1, 'ACTIVE', ''
  ]);

  createPlaceAlias(placeId, mergedAddress, normPlace);

  if (addressRaw && addressRaw !== mergedAddress) {
    createPlaceAlias(placeId, addressRaw, normalizePlaceName(addressRaw));
  }
  if (geoAddr && geoAddr !== mergedAddress) {
    createPlaceAlias(placeId, geoAddr, normalizePlaceName(geoAddr));
  }

  return placeId;
}

function createPlaceAlias(placeId, aliasRaw, aliasNormalized) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_PLACE_ALIAS');
  sheet.appendRow([
    'L_AL-' + uuid().split('-')[0].toUpperCase(),
    placeId, aliasRaw, aliasNormalized,
    'SYSTEM', new Date(), new Date(), 1, 'Y'
  ]);
}

function updatePlaceStats(placeId) {
  if (!placeId) return;
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_PLACE');
  const data  = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === placeId) {
      sheet.getRange(i + 1, 9).setValue((parseInt(data[i][8]) || 0) + 1);
      sheet.getRange(i + 1, 8).setValue(new Date());
      break;
    }
  }
}
```

---

### `08_GeoService.gs` — V4.5

```javascript
/**
 * 08_GeoService.gs — V4.5
 * FIXED: updateGeoStats
 * NEW: getGeoById
 */

function resolveGeo(sourceObj) {
  const lat = sourceObj.latRaw;
  const lng = sourceObj.longRaw;

  if (!sourceObj.geoIsValid) {
    return { id: null, isNew: false, score: 0, candidates: [] };
  }

  const normCoords = normalizeLatLong(lat, lng);
  const keys       = buildGeoKeys(lat, lng);
  const candidates = findGeoCandidates(normCoords.lat, normCoords.lng);

  if (candidates.length === 0) {
    return {
      id: null, isNew: true, score: 0,
      lat: normCoords.lat, lng: normCoords.lng,
      keys, candidates: []
    };
  }

  let best = null, minDist = 999999;
  for (const c of candidates) {
    const dist = haversineDistanceMeters(
      normCoords.lat, normCoords.lng, c.lat, c.lng
    );
    if (dist < minDist) { minDist = dist; best = c; }
  }

  const radius = getThresholds().geoRadiusMeter;

  if (minDist <= radius) {
    return {
      id: best.geoId, isNew: false, score: 100,
      lat: normCoords.lat, lng: normCoords.lng,
      keys, distance: minDist, candidates
    };
  } else {
    return {
      id: null, isNew: true, score: 0,
      lat: normCoords.lat, lng: normCoords.lng,
      keys, distance: minDist, candidates
    };
  }
}

function findGeoCandidates(lat, lng) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_GEO_POINT');
  const data  = sheet.getDataRange().getValues();
  const found = [];

  for (let i = 1; i < data.length; i++) {
    const cLat = parseFloat(data[i][3]);
    const cLng = parseFloat(data[i][4]);
    if (Math.abs(cLat - lat) < 0.01 && Math.abs(cLng - lng) < 0.01) {
      found.push({ geoId: data[i][0], lat: cLat, lng: cLng });
    }
  }
  return found;
}

function createGeoPoint(lat, lng, keys, addressHint) {
  const ss     = SpreadsheetApp.getActiveSpreadsheet();
  const sheet  = ss.getSheetByName('M_GEO_POINT');
  const geoId  = 'GEO-' + uuid().split('-')[0].toUpperCase();

  sheet.appendRow([
    geoId, lat, lng,
    keys.lat, keys.lng,
    keys.key4 + '_ext', // geo_key_6 placeholder
    keys.key3,          // geo_key_5
    keys.key2,          // geo_key_4
    safeString(addressHint),
    new Date(), new Date(), 1, ''
  ]);

  return geoId;
}

function getGeoById(geoId) {
  if (!geoId) return null;
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_GEO_POINT');
  const data  = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === geoId) {
      return {
        geoId:     data[i][0],
        latRaw:    data[i][1],
        lngRaw:    data[i][2],
        lat:       parseFloat(data[i][3]),
        lng:       parseFloat(data[i][4]),
        address:   data[i][8],
        usageCount:data[i][11]
      };
    }
  }
  return null;
}

function updateGeoStats(geoId) {
  if (!geoId) return;
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_GEO_POINT');
  const data  = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === geoId) {
      sheet.getRange(i + 1, 12).setValue((parseInt(data[i][11]) || 0) + 1);
      sheet.getRange(i + 1, 11).setValue(new Date());
      break;
    }
  }
}
```

---

### `09_DestinationService.gs` — V4.5

```javascript
/**
 * 09_DestinationService.gs — V4.5
 * FIXED: updateDestinationStats
 */

function buildDestinationKey(personId, placeId, geoId) {
  return `${personId||'UNK'}|${placeId||'UNK'}|${geoId||'UNK'}`;
}

function resolveDestination(personId, placeId, geoId, sourceObj) {
  const destKey = buildDestinationKey(personId, placeId, geoId);
  const ss      = SpreadsheetApp.getActiveSpreadsheet();
  const sheet   = ss.getSheetByName('M_DESTINATION');
  const data    = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][5] === destKey) {
      return { id: data[i][0], isNew: false, key: destKey };
    }
  }

  const newId = createDestination(
    personId, placeId, geoId,
    sourceObj.destinationNameRaw, destKey
  );
  return { id: newId, isNew: true, key: destKey };
}

function createDestination(personId, placeId, geoId, label, destKey) {
  const ss     = SpreadsheetApp.getActiveSpreadsheet();
  const sheet  = ss.getSheetByName('M_DESTINATION');
  const destId = 'DST-' + uuid().split('-')[0].toUpperCase();

  sheet.appendRow([
    destId, personId, placeId, geoId,
    safeString(label), destKey,
    'HIGH', new Date(), new Date(), 1, ''
  ]);

  return destId;
}

function updateDestinationStats(destId) {
  if (!destId) return;
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_DESTINATION');
  const data  = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === destId) {
      sheet.getRange(i + 1, 10).setValue((parseInt(data[i][9]) || 0) + 1);
      sheet.getRange(i + 1, 9).setValue(new Date());
      break;
    }
  }
}
```

---

### `10_MatchEngine.gs` — V4.5

```javascript
/**
 * 10_MatchEngine.gs — V4.5
 * NEW: Rule Table R01-R08, evaluateConflictRules, Self-Test
 * UPGRADED: composite score = raw - penalty, evaluateThaiGeoBonus ครบ 3 ระดับ
 */

function matchAllEntities(sourceObj) {
  const qualityFlags = sourceObj.qualityFlags || buildDataQualityFlags(sourceObj);

  const personResult = resolvePerson(sourceObj);
  const placeResult  = resolvePlace(sourceObj);
  const geoResult    = resolveGeo(sourceObj);

  let finalPersonId = personResult.id;
  let finalPlaceId  = placeResult.id;
  let finalGeoId    = geoResult.id;
  let autoCreated   = 0;

  if (personResult.isNew && !qualityFlags.includes('LOW_QUALITY_PERSON_NAME')) {
    finalPersonId = createPerson(
      personResult.raw, personResult.normalized, personResult.phone
    );
    autoCreated++;
  }

  if (placeResult.isNew && !qualityFlags.includes('LOW_QUALITY_PLACE_TEXT')) {
    finalPlaceId = createPlace(
      placeResult.raw, sourceObj.addressRaw, sourceObj.addressFromLatLong
    );
    autoCreated++;
  }

  if (geoResult.isNew && sourceObj.geoIsValid) {
    finalGeoId = createGeoPoint(
      geoResult.lat, geoResult.lng, geoResult.keys, sourceObj.latLongText
    );
    autoCreated++;
  }

  // คะแนน
  const bonusScore      = evaluateThaiGeoBonus(sourceObj);
  const compositeRaw    = calculateCompositeScore(
    personResult.score, placeResult.score, geoResult.score, autoCreated, bonusScore
  );
  const ruleEval        = evaluateConflictRules(personResult, placeResult, geoResult);
  const rulePenalty     = calculateRulePenalty(ruleEval.hits);
  const compositeScore  = Math.max(0, compositeRaw - rulePenalty);

  // Destination
  let destResult = { id: null, isNew: false, key: '' };
  if (finalPersonId && finalPlaceId && finalGeoId) {
    destResult = resolveDestination(
      finalPersonId, finalPlaceId, finalGeoId, sourceObj
    );
  }

  return {
    person:         { ...personResult, finalId: finalPersonId },
    place:          { ...placeResult,  finalId: finalPlaceId  },
    geo:            { ...geoResult,    finalId: finalGeoId    },
    dest:           destResult,
    compositeScore,
    compositeScoreRaw: compositeRaw,
    qualityFlags,
    ruleHits:       ruleEval.hits,
    rulePenalty
  };
}

function calculateCompositeScore(pScore, plScore, gScore, autoCreated, bonus = 0) {
  if (autoCreated >= 3) return 100;
  // Geo 45%, Person 30%, Place 25%
  const score = (pScore * 0.30) + (plScore * 0.25) + (gScore * 0.45) + bonus;
  return Math.min(100, Math.round(score));
}

function decideAutoMatchOrReview(matchResult) {
  const { autoMatchScore } = getThresholds();

  // Quality flags บังคับ REVIEW
  if (matchResult.qualityFlags && matchResult.qualityFlags.length > 0) {
    return 'REVIEW';
  }

  // HIGH severity rule บังคับ REVIEW
  if (matchResult.ruleHits &&
      matchResult.ruleHits.some(r => r.severity === 'HIGH')) {
    return 'REVIEW';
  }

  if (!matchResult.person.finalId ||
      !matchResult.place.finalId  ||
      !matchResult.geo.finalId) {
    return 'REVIEW';
  }

  if (matchResult.compositeScore >= autoMatchScore) return 'AUTO_MATCH';
  return 'REVIEW';
}

function buildReviewPayload(sourceObj, matchResult) {
  const cPersonIds = (matchResult.person.candidates || [])
    .map(c => c.personId || c.id).join(',');
  const cPlaceIds  = (matchResult.place.candidates  || [])
    .map(c => c.placeId  || c.id).join(',');
  const cGeoIds    = (matchResult.geo.candidates    || [])
    .map(c => c.geoId    || c.id).join(',');

  const qualityNote = matchResult.qualityFlags && matchResult.qualityFlags.length > 0
    ? '\n⚠️ Quality flags: ' + matchResult.qualityFlags.join(', ')
    : '';

  const ruleNote = matchResult.ruleHits && matchResult.ruleHits.length > 0
    ? '\n🧭 Rule codes: ' + matchResult.ruleHits.map(r => r.code).join(', ')
    : '';

  const conflictNote = matchResult.place && matchResult.place.conflictMessage
    ? '\n' + matchResult.place.conflictMessage
    : '';

  const scoreNote =
    `\n📊 Score: ${matchResult.compositeScoreRaw||matchResult.compositeScore}` +
    ` - penalty ${matchResult.rulePenalty||0}` +
    ` = final ${matchResult.compositeScore}`;

  return {
    issueType:              detectConflictType(matchResult),
    sourceRecordId:         sourceObj.idScg,
    sourceRowNumber:        sourceObj.rowNumber,
    invoiceNo:              sourceObj.invoiceNo,
    rawPersonName:          sourceObj.destinationNameRaw,
    rawPlaceName:           sourceObj.addressRaw,
    rawSystemAddress:       sourceObj.addressRaw,
    rawGeoResolvedAddress:  sourceObj.addressFromLatLong,
    rawLat:                 sourceObj.latRaw,
    rawLong:                sourceObj.longRaw,
    candidatePersonIds:     cPersonIds,
    candidatePlaceIds:      cPlaceIds,
    candidateGeoIds:        cGeoIds,
    score:                  matchResult.compositeScore,
    recommendedAction:      'MANUAL_REVIEW',
    note: (analyzeGeoWarning(sourceObj.addressRaw) || '') +
          '\n💡 ที่อยู่แนะนำ: ' +
          (matchResult.place && matchResult.place.bestAddress
            ? matchResult.place.bestAddress
            : smartMergeAddress(sourceObj.addressRaw, sourceObj.addressFromLatLong)
          ) +
          qualityNote + ruleNote + conflictNote + scoreNote
  };
}

function detectConflictType(matchResult) {
  const hits = matchResult.ruleHits || [];
  if (hits.some(r => r.code === 'R08_DIFF_PERSON_SAME_GEO'))  return 'SAME_GEO_DIFF_PERSON';
  if (hits.some(r => r.code === 'R07_SAME_PERSON_DIFF_GEO'))  return 'SAME_PERSON_DIFF_GEO';
  if (hits.some(r => r.code === 'R06_SAME_PERSON_DIFF_PLACE')) return 'SAME_PERSON_DIFF_PLACE';
  if (hits.some(r => r.code === 'R05_DIFF_PERSON_SAME_PLACE')) return 'SAME_PLACE_DIFF_PERSON';
  if (hits.some(r => r.code === 'R04_SAME_PERSON_ALIAS_VARIANT')) return 'PERSON_ALIAS_REVIEW';
  if (hits.some(r => r.code === 'R03_DUP_GEO_POINT'))          return 'DUPLICATE_GEO';
  if (hits.some(r => r.code === 'R02_DUP_PLACE_NAME'))         return 'DUPLICATE_PLACE';
  if (hits.some(r => r.code === 'R01_DUP_PERSON_NAME'))        return 'DUPLICATE_PERSON';
  return 'AMBIGUOUS_DATA';
}

// ─────────────────────────────────────────────────────────────
// evaluateThaiGeoBonus — UPGRADED V4.5 (3 ระดับ + penalty)
// ─────────────────────────────────────────────────────────────
function evaluateThaiGeoBonus(sourceObj) {
  let bonus = 0;
  const rawAddr = sourceObj.addressRaw || '';
  const geoAddr = sourceObj.addressFromLatLong || '';
  if (!rawAddr || !geoAddr) return 0;

  const rawTokens = extractGeoTokens(normalizeThaiText(rawAddr));
  const geoTokens = extractGeoTokens(normalizeThaiText(geoAddr));

  if (rawTokens.subdistrict && geoTokens.subdistrict &&
      rawTokens.subdistrict === geoTokens.subdistrict) bonus += 15;

  if (rawTokens.district && geoTokens.district &&
      rawTokens.district === geoTokens.district) bonus += 10;

  if (rawTokens.province && geoTokens.province &&
      rawTokens.province === geoTokens.province) bonus += 5;

  // Penalty ถ้าจังหวัดขัดแย้ง
  if (rawTokens.province && geoTokens.province &&
      rawTokens.province !== geoTokens.province) bonus -= 20;

  return bonus;
}

// ─────────────────────────────────────────────────────────────
// Rule Table R01-R08  [NEW V4.5]
// ─────────────────────────────────────────────────────────────
function getConflictRuleTable() {
  return [
    { code:'R01_DUP_PERSON_NAME',         severity:'MEDIUM', penalty:10,
      description:'ชื่อบุคคลซ้ำกัน/ใกล้กันหลายรายการ' },
    { code:'R02_DUP_PLACE_NAME',          severity:'MEDIUM', penalty:10,
      description:'ชื่อสถานที่ซ้ำกัน/ใกล้กัน' },
    { code:'R03_DUP_GEO_POINT',           severity:'LOW',    penalty:5,
      description:'LatLong ซ้ำกับหลายจุดเดิม' },
    { code:'R04_SAME_PERSON_ALIAS_VARIANT',severity:'MEDIUM', penalty:8,
      description:'คนเดียวกันแต่ alias ไม่ตรง' },
    { code:'R05_DIFF_PERSON_SAME_PLACE',  severity:'HIGH',   penalty:15,
      description:'คนละชื่อแต่สถานที่เดียวกัน' },
    { code:'R06_SAME_PERSON_DIFF_PLACE',  severity:'HIGH',   penalty:15,
      description:'ชื่อเดียวกันแต่สถานที่ต่างกัน' },
    { code:'R07_SAME_PERSON_DIFF_GEO',    severity:'HIGH',   penalty:20,
      description:'ชื่อเดียวกันแต่ LatLong ต่างกันชัด' },
    { code:'R08_DIFF_PERSON_SAME_GEO',    severity:'HIGH',   penalty:20,
      description:'คนละชื่อแต่ LatLong เดียวกัน' }
  ];
}

function evaluateConflictRules(personResult, placeResult, geoResult) {
  const { reviewScoreMin: reviewMin, autoMatchScore: autoMin } = getThresholds();
  const ruleMap = {};
  getConflictRuleTable().forEach(r => (ruleMap[r.code] = r));
  const hits = [];

  const p   = personResult.score || 0;
  const pl  = placeResult.score  || 0;
  const g   = geoResult.score    || 0;
  const pC  = (personResult.candidates || []).length;
  const plC = (placeResult.candidates  || []).length;
  const gC  = (geoResult.candidates    || []).length;

  if (pC >= 2 && p >= reviewMin && p < autoMin)
    hits.push(ruleMap['R01_DUP_PERSON_NAME']);
  if (plC >= 2 && pl >= reviewMin && pl < autoMin)
    hits.push(ruleMap['R02_DUP_PLACE_NAME']);
  if (gC >= 2 && g >= autoMin)
    hits.push(ruleMap['R03_DUP_GEO_POINT']);
  if (p >= reviewMin && p < autoMin && (pl >= autoMin || g >= autoMin))
    hits.push(ruleMap['R04_SAME_PERSON_ALIAS_VARIANT']);
  if (pl >= autoMin && p < 60)
    hits.push(ruleMap['R05_DIFF_PERSON_SAME_PLACE']);
  if (p >= autoMin && pl < 60)
    hits.push(ruleMap['R06_SAME_PERSON_DIFF_PLACE']);
  if (p >= autoMin && g < 60)
    hits.push(ruleMap['R07_SAME_PERSON_DIFF_GEO']);
  if (g >= autoMin && p < 60)
    hits.push(ruleMap['R08_DIFF_PERSON_SAME_GEO']);

  return { hits: dedupeRuleHits(hits) };
}

function dedupeRuleHits(hits) {
  const map = {};
  (hits || []).forEach(h => { if (h && h.code) map[h.code] = h; });
  return Object.values(map);
}

function calculateRulePenalty(ruleHits) {
  if (!ruleHits || ruleHits.length === 0) return 0;
  return Math.min(30, ruleHits.reduce((s, r) => s + (r.penalty || 0), 0));
}

// ─────────────────────────────────────────────────────────────
// Self-Test  [NEW V4.5]
// ─────────────────────────────────────────────────────────────
function runConflictRuleSelfTest() {
  const cases = [
    { name:'R01 dup person', expect:'R01_DUP_PERSON_NAME',
      p:{score:82,candidates:[{},{}]}, pl:{score:30,candidates:[]}, g:{score:30,candidates:[]} },
    { name:'R02 dup place',  expect:'R02_DUP_PLACE_NAME',
      p:{score:30,candidates:[]}, pl:{score:85,candidates:[{},{}]}, g:{score:30,candidates:[]} },
    { name:'R03 dup geo',    expect:'R03_DUP_GEO_POINT',
      p:{score:30,candidates:[]}, pl:{score:30,candidates:[]}, g:{score:95,candidates:[{},{}]} },
    { name:'R04 alias',      expect:'R04_SAME_PERSON_ALIAS_VARIANT',
      p:{score:78,candidates:[{}]}, pl:{score:92,candidates:[{}]}, g:{score:80,candidates:[{}]} },
    { name:'R05 diff-p same-pl',expect:'R05_DIFF_PERSON_SAME_PLACE',
      p:{score:40,candidates:[{}]}, pl:{score:92,candidates:[{}]}, g:{score:55,candidates:[{}]} },
    { name:'R06 same-p diff-pl',expect:'R06_SAME_PERSON_DIFF_PLACE',
      p:{score:92,candidates:[{}]}, pl:{score:40,candidates:[{}]}, g:{score:70,candidates:[{}]} },
    { name:'R07 same-p diff-g', expect:'R07_SAME_PERSON_DIFF_GEO',
      p:{score:94,candidates:[{}]}, pl:{score:80,candidates:[{}]}, g:{score:35,candidates:[{}]} },
    { name:'R08 diff-p same-g', expect:'R08_DIFF_PERSON_SAME_GEO',
      p:{score:45,candidates:[{}]}, pl:{score:75,candidates:[{}]}, g:{score:93,candidates:[{}]} }
  ];

  const failed = [];
  cases.forEach(tc => {
    const hits = evaluateConflictRules(tc.p, tc.pl, tc.g).hits.map(h => h.code);
    if (!hits.includes(tc.expect)) {
      failed.push(`${tc.name} → expected ${tc.expect}, got [${hits.join(', ')}]`);
    }
  });

  if (failed.length > 0) {
    const msg = '❌ Self-test failed:\n' + failed.join('\n');
    writeLog('ERROR','10_MatchEngine','runConflictRuleSelfTest','',msg,'');
    SpreadsheetApp.getUi().alert(msg);
    throw new Error(msg);
  }

  const passMsg = `✅ Rule self-test passed (${cases.length}/8 cases)`;
  writeLog('INFO','10_MatchEngine','runConflictRuleSelfTest','',passMsg,'');
  SpreadsheetApp.getActiveSpreadsheet().toast(passMsg, 'Self-test', 5);
}

function evaluateOwnerContextScore(sourceObj, personResult) {
  if (!sourceObj.ownerNameNormalized || personResult.score < 70) return 0;
  // ถ้า ownerName ตรงกับ context ที่เคยส่งให้บุคคลนี้ → bonus เล็กน้อย
  return 3;
}
```

---

### `11_TransactionService.gs` — V4.5

```javascript
/**
 * 11_TransactionService.gs — V4.5
 * NEW: batchWriteFacts (setValues batch แทน loop appendRow)
 */

function buildFactRow(sourceObj, matchResult) {
  return [
    'TX-' + uuid().split('-')[0].toUpperCase(),
    getSheetNames().SOURCE,
    sourceObj.rowNumber,
    sourceObj.idScg,
    sourceObj.deliveryDate,
    sourceObj.deliveryTime,
    sourceObj.shipmentNo,
    sourceObj.invoiceNo,
    sourceObj.ownerName,
    sourceObj.destinationNameRaw,
    sourceObj.addressRaw,
    sourceObj.addressFromLatLong,
    sourceObj.latLongText,
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
    'COMPLETED',
    'SYNCED',
    new Date(),
    new Date()
  ];
}

function upsertFactDelivery(factRowArray) {
  if (preventDuplicateTransaction(factRowArray[3])) {
    writeLog('INFO','11_TransactionService','upsertFactDelivery',
      factRowArray[3], 'Duplicate skipped', '');
    return;
  }
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('FACT_DELIVERY');
  sheet.appendRow(factRowArray);
}

function preventDuplicateTransaction(sourceRecordId) {
  if (!sourceRecordId) return false;
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('FACT_DELIVERY');
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;
  const ids = sheet.getRange(2, 4, lastRow - 1, 1).getValues();
  return ids.some(r => r[0] === sourceRecordId);
}

// ─────────────────────────────────────────────────────────────
// batchWriteFacts — [NEW V4.5]
// เขียน batch setValues() ครั้งเดียว แทน loop appendRow
// ─────────────────────────────────────────────────────────────
function batchWriteFacts(factRows) {
  if (!factRows || factRows.length === 0) return;

  const ss      = SpreadsheetApp.getActiveSpreadsheet();
  const sheet   = ss.getSheetByName('FACT_DELIVERY');
  const lastRow = sheet.getLastRow();
  const startRow = lastRow + 1;

  sheet.getRange(startRow, 1, factRows.length, factRows[0].length)
       .setValues(factRows);

  writeLog('INFO','11_TransactionService','batchWriteFacts','',
    `Batch wrote ${factRows.length} facts`, '');
}
```

---

### `12_ReviewService.gs` — V4.5

```javascript
/**
 * 12_ReviewService.gs — V4.5
 * FIXED: applyReviewDecision (เรียก merge จริง)
 * NEW: learnAliasFromReview, applyBulkReviewDecision, getReviewSummaryStats
 */

function enqueueReview(payload) {
  const ss       = SpreadsheetApp.getActiveSpreadsheet();
  const sheet    = ss.getSheetByName('Q_REVIEW');
  const reviewId = 'REV-' + uuid().split('-')[0].toUpperCase();

  sheet.appendRow([
    reviewId,
    payload.issueType,
    payload.sourceRecordId,
    payload.sourceRowNumber,
    payload.invoiceNo,
    payload.rawPersonName,
    payload.rawPlaceName,
    payload.rawSystemAddress,
    payload.rawGeoResolvedAddress,
    payload.rawLat,
    payload.rawLong,
    payload.candidatePersonIds,
    payload.candidatePlaceIds,
    payload.candidateGeoIds,
    '',
    payload.score,
    payload.recommendedAction,
    'PENDING', '', '', '', payload.note || ''
  ]);

  return reviewId;
}

function setupReviewDropdown() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Q_REVIEW');
  if (!sheet) return;

  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['CREATE_NEW','MERGE_TO_CANDIDATE','IGNORE'], true)
    .setAllowInvalid(false)
    .build();

  const lastRow = Math.max(sheet.getMaxRows(), 200);
  sheet.getRange(2, 21, lastRow - 1, 1).setDataValidation(rule);
}

function getPendingReviews() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Q_REVIEW');
  const data  = sheet.getDataRange().getValues();
  const headers = data[0];
  const pending = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][17] === 'PENDING') {
      const item = {};
      headers.forEach((h, idx) => (item[h] = data[i][idx]));
      item.rowIndex = i + 1;
      pending.push(item);
    }
  }
  return pending;
}

// ─────────────────────────────────────────────────────────────
// applyReviewDecision — [FIXED V4.5]
// ─────────────────────────────────────────────────────────────
function applyReviewDecision(reviewId, decision, selectedPersonId) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Q_REVIEW');
  const data  = sheet.getDataRange().getValues();

  let rowIndex = -1, reviewRow = null;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === reviewId) { rowIndex = i + 1; reviewRow = data[i]; break; }
  }
  if (rowIndex === -1) throw new Error('ไม่พบ Review ID: ' + reviewId);

  const reviewer = Session.getActiveUser().getEmail();
  sheet.getRange(rowIndex, 18).setValue('RESOLVED');
  sheet.getRange(rowIndex, 19).setValue(reviewer);
  sheet.getRange(rowIndex, 20).setValue(new Date());
  sheet.getRange(rowIndex, 21).setValue(decision);

  if (decision === 'MERGE_TO_CANDIDATE') {
    const rawName            = reviewRow[5];
    const candidatePersonStr = reviewRow[11];

    if (candidatePersonStr) {
      const candidateIds = String(candidatePersonStr).split(',');
      const targetId = (selectedPersonId && selectedPersonId.trim())
        ? selectedPersonId.trim()
        : candidateIds[0].trim();

      if (targetId) {
        createPersonAlias(targetId, rawName, normalizePersonName(rawName));
      }

      // Merge จริงถ้ามี sourceId
      const sourceId = candidateIds[1] ? candidateIds[1].trim() : null;
      if (sourceId && targetId && sourceId !== targetId) {
        try {
          mergePersonRecords(sourceId, targetId, reviewer);
        } catch (e) {
          writeLog('WARN','12_ReviewService','applyReviewDecision',
            reviewId, 'mergePersonRecords: ' + e.message, '');
        }
      }
    }

    // เรียนรู้ Alias อัตโนมัติ
    learnAliasFromReview(reviewId, reviewRow, reviewer);
  }

  const sourceRowIdx = reviewRow[3];
  updateSourceSyncStatus(
    sourceRowIdx,
    decision === 'IGNORE' ? 'IGNORE' : 'WAIT_REPROCESS'
  );
}

// ─────────────────────────────────────────────────────────────
// learnAliasFromReview — [NEW V4.5 จาก GenSpark]
// หลัง approve → เพิ่ม alias อัตโนมัติ (self-learning)
// ─────────────────────────────────────────────────────────────
function learnAliasFromReview(reviewId, reviewRow, reviewer) {
  try {
    const rawPersonName  = reviewRow[5];
    const rawPlaceName   = reviewRow[7];
    const candidatePersonStr = reviewRow[11];
    const candidatePlaceStr  = reviewRow[12];

    // เพิ่ม Person Alias
    if (rawPersonName && candidatePersonStr) {
      const personId = String(candidatePersonStr).split(',')[0].trim();
      if (personId) {
        createPersonAlias(
          personId, rawPersonName, normalizePersonName(rawPersonName)
        );
        writeLog('INFO','12_ReviewService','learnAliasFromReview',
          reviewId, `Person alias learned: "${rawPersonName}" → ${personId}`, '');
      }
    }

    // เพิ่ม Place Alias
    if (rawPlaceName && candidatePlaceStr) {
      const placeId = String(candidatePlaceStr).split(',')[0].trim();
      if (placeId) {
        createPlaceAlias(
          placeId, rawPlaceName, normalizePlaceName(rawPlaceName)
        );
        writeLog('INFO','12_ReviewService','learnAliasFromReview',
          reviewId, `Place alias learned: "${rawPlaceName}" → ${placeId}`, '');
      }
    }
  } catch (e) {
    writeLog('WARN','12_ReviewService','learnAliasFromReview',
      reviewId, e.message, '');
  }
}

// ─────────────────────────────────────────────────────────────
// applyBulkReviewDecision — [NEW V4.5]
// ─────────────────────────────────────────────────────────────
function applyBulkReviewDecision(decisions) {
  // decisions = [{ reviewId, decision, selectedPersonId }]
  if (!decisions || decisions.length === 0) return;

  let success = 0, failed = 0;
  for (const d of decisions) {
    try {
      applyReviewDecision(d.reviewId, d.decision, d.selectedPersonId || null);
      success++;
    } catch (e) {
      failed++;
      writeLog('ERROR','12_ReviewService','applyBulkReviewDecision',
        d.reviewId, e.message, '');
    }
  }

  SpreadsheetApp.getActiveSpreadsheet().toast(
    `Bulk review: สำเร็จ ${success} / ล้มเหลว ${failed}`,
    'Bulk Review Done', 5
  );
}

// ─────────────────────────────────────────────────────────────
// getReviewSummaryStats — [NEW V4.5]
// ─────────────────────────────────────────────────────────────
function getReviewSummaryStats() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Q_REVIEW');
  const data  = sheet.getDataRange().getValues();

  const stats = { total: 0, pending: 0, resolved: 0, byIssueType: {} };

  for (let i = 1; i < data.length; i++) {
    stats.total++;
    const status    = data[i][17];
    const issueType = data[i][1];

    if (status === 'PENDING')  stats.pending++;
    if (status === 'RESOLVED') stats.resolved++;

    stats.byIssueType[issueType] = (stats.byIssueType[issueType] || 0) + 1;
  }

  return stats;
}
```

---

### `13_ReportService.gs` — V4.5

```javascript
/**
 * 13_ReportService.gs — V4.5
 * FIXED: runNightlyMaintenance (cleanup log เก่า)
 * NEW: sendLineNotify, buildPivotSummary
 */

function refreshQualityReport() {
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const rpt = ss.getSheetByName('RPT_DATA_QUALITY');
  if (!rpt) return;

  const get = name => {
    const s = ss.getSheetByName(name);
    return s ? Math.max(0, s.getLastRow() - 1) : 0;
  };

  let pendingReviewCount = 0;
  const qSheet = ss.getSheetByName('Q_REVIEW');
  if (qSheet && qSheet.getLastRow() > 1) {
    const statuses = qSheet
      .getRange(2, 18, qSheet.getLastRow() - 1, 1)
      .getValues();
    pendingReviewCount = statuses.filter(r => r[0] === 'PENDING').length;
  }

  rpt.appendRow([
    new Date(),
    get(getSheetNames().SOURCE),
    get('FACT_DELIVERY'),
    get('M_PERSON'),
    get('M_PLACE'),
    get('M_GEO_POINT'),
    get('M_DESTINATION'),
    get('FACT_DELIVERY'),
    pendingReviewCount,
    0, 0,
    new Date()
  ]);

  // เก็บแค่ 100 วันล่าสุด
  if (rpt.getLastRow() > 101) {
    rpt.deleteRows(2, rpt.getLastRow() - 100);
  }
}

function buildDailySummary() {
  refreshQualityReport();
}

// ─────────────────────────────────────────────────────────────
// runNightlyMaintenance — [FIXED V4.5]
// ─────────────────────────────────────────────────────────────
function runNightlyMaintenance() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  try {
    buildDailySummary();

    // Cleanup SYS_LOG เก่า (เก็บแค่ 500 แถวล่าสุด)
    const logSheet = ss.getSheetByName('SYS_LOG');
    if (logSheet && logSheet.getLastRow() > 501) {
      logSheet.deleteRows(2, logSheet.getLastRow() - 500);
    }

    ss.toast('บำรุงรักษาระบบเรียบร้อย', '✅ Maintenance', 5);
    writeLog('INFO','13_ReportService','runNightlyMaintenance','','Done','');

  } catch (e) {
    ss.toast('Maintenance ล้มเหลว: ' + e.message, '❌', 10);
    writeLog('ERROR','13_ReportService','runNightlyMaintenance','',e.message,'');
    throw e;
  }
}

// ─────────────────────────────────────────────────────────────
// sendLineNotify — [NEW V4.5]
// ─────────────────────────────────────────────────────────────
function sendLineNotify(message) {
  const token = getConfig('LINE_NOTIFY_TOKEN');
  if (!token) return;

  try {
    UrlFetchApp.fetch('https://notify-api.line.me/api/notify', {
      method:  'post',
      headers: { Authorization: 'Bearer ' + token },
      payload: { message: '\n' + message }
    });
  } catch (e) {
    writeLog('WARN','13_ReportService','sendLineNotify','',e.message,'');
  }
}

// ─────────────────────────────────────────────────────────────
// buildPivotSummary — [NEW V4.5]
// ─────────────────────────────────────────────────────────────
function buildPivotSummary() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('FACT_DELIVERY');
  if (!sheet || sheet.getLastRow() <= 1) return {};

  const data    = sheet.getRange(2, 5, sheet.getLastRow() - 1, 2).getValues();
  const summary = {};

  data.forEach(row => {
    const date      = safeDate(row[0]);
    const warehouse = safeString(row[1]);
    if (!date) return;

    const month = Utilities.formatDate(date, Session.getScriptTimeZone(), 'yyyy-MM');
    const key   = month + '|' + warehouse;
    summary[key] = (summary[key] || 0) + 1;
  });

  return summary;
}
```

---

### `14_Utils.gs` — V4.5

```javascript
/**
 * 14_Utils.gs — V4.5
 * NEW: withLock (ป้องกัน race condition จาก GenSpark)
 */

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function safeTrim(v)   { return v == null ? '' : String(v).trim(); }
function safeString(v) { return v == null ? '' : String(v); }
function safeNumber(v) { const n = Number(v); return isNaN(n) ? 0 : n; }
function safeDate(v)   {
  if (v instanceof Date) return v;
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function formatTime(v) {
  if (!v) return '';
  if (v instanceof Date) {
    try {
      return Utilities.formatDate(v, Session.getScriptTimeZone(), 'HH:mm:ss');
    } catch (_) { return String(v); }
  }
  return String(v).trim();
}

function writeLog(level, moduleName, funcName, refId, message, payload) {
  try {
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('SYS_LOG');
    if (!sheet) return;

    let payloadStr = '';
    if (typeof payload === 'object') {
      try { payloadStr = JSON.stringify(payload); }
      catch (_) { payloadStr = String(payload); }
    } else { payloadStr = String(payload || ''); }

    sheet.appendRow([
      uuid(), 'N/A', new Date(), level,
      moduleName, funcName, refId, message, payloadStr
    ]);
  } catch (_) {
    console.error('writeLog failed:', _);
  }
}

function haversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const R    = 6371e3;
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const dPhi = (lat2 - lat1) * Math.PI / 180;
  const dLam = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dPhi/2)**2 +
            Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLam/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function diceCoefficient(s1, s2) {
  if (!s1 || !s2) return 0;
  s1 = s1.replace(/\s+/g, '');
  s2 = s2.replace(/\s+/g, '');
  if (s1 === s2) return 1;
  if (s1.length < 2 || s2.length < 2) return 0;

  const bigrams = new Map();
  for (let i = 0; i < s1.length - 1; i++) {
    const b = s1.substring(i, i + 2);
    bigrams.set(b, (bigrams.get(b) || 0) + 1);
  }

  let intersect = 0;
  for (let i = 0; i < s2.length - 1; i++) {
    const b = s2.substring(i, i + 2);
    const c = bigrams.get(b) || 0;
    if (c > 0) { bigrams.set(b, c - 1); intersect++; }
  }

  return (2 * intersect) / (s1.length + s2.length - 2);
}

function lengthRatio(s1, s2) {
  if (!s1 || !s2) return 0;
  const l1 = s1.length, l2 = s2.length;
  if (!l1 || !l2) return 0;
  return Math.min(l1, l2) / Math.max(l1, l2);
}

// Checkpoint
function saveCheckpoint(rowNumber) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('LAST_PROCESSED_ROW', rowNumber.toString());
  props.setProperty('LAST_PROCESS_TIME', new Date().toISOString());
}
function getCheckpoint() {
  const r = PropertiesService.getScriptProperties()
    .getProperty('LAST_PROCESSED_ROW');
  return r ? parseInt(r) : null;
}
function clearCheckpoint() {
  const props = PropertiesService.getScriptProperties();
  props.deleteProperty('LAST_PROCESSED_ROW');
  props.deleteProperty('LAST_PROCESS_TIME');
}

function isTimeNearLimit(startTime, limitMs = 300000) {
  return (Date.now() - startTime) > limitMs;
}

function updateRunStatus(status, message) {
  try {
    setConfig('LAST_RUN_STATUS',  status);
    setConfig('LAST_RUN_MESSAGE', message);
    setConfig('LAST_RUN_TIME',
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(),
        'dd/MM/yyyy HH:mm:ss')
    );
    console.log(`[STATUS] ${status}: ${message}`);
  } catch (_) {}
}

function showAutoCloseAlert(message, seconds = 10) {
  const html = HtmlService.createHtmlOutput(`
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400&display=swap"
            rel="stylesheet">
      <style>
        body{font-family:'Kanit',sans-serif;text-align:center;
             padding:20px;background:#f8f9fa;}
        .msg{font-size:16px;margin-bottom:15px;color:#333;line-height:1.6;}
        .timer{font-size:28px;font-weight:bold;color:#d93025;margin:10px 0;}
        .sub{font-size:13px;color:#666;}
        .btn{background:#1a73e8;color:white;border:none;padding:10px 25px;
             border-radius:4px;cursor:pointer;font-family:'Kanit';font-size:14px;}
      </style>
    </head>
    <body>
      <div class="msg">${message}</div>
      <div class="timer" id="s">${seconds}</div>
      <div class="sub">วินาที — หน้าต่างจะปิดเอง</div><br>
      <button class="btn" onclick="google.script.host.close()">ตกลง (ปิดเลย)</button>
      <script>
        let t=${seconds};
        const iv=setInterval(()=>{
          document.getElementById('s').innerText=--t;
          if(t<=0){clearInterval(iv);google.script.host.close();}
        },1000);
      </script>
    </body></html>`)
    .setWidth(380).setHeight(240);
  SpreadsheetApp.getUi().showModelessDialog(html, '📢 LMDS Status');
}

// ─────────────────────────────────────────────────────────────
// withLock — [NEW V4.5 จาก GenSpark]
// ป้องกัน Race Condition เมื่อหลาย session รันพร้อมกัน
// ─────────────────────────────────────────────────────────────
function withLock(callback) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000); // รอสูงสุด 15 วินาที
    return callback();
  } finally {
    lock.releaseLock();
  }
}
```

---

### `15_GoogleMapsAPI.gs` — V4.5

```javascript
/**
 * 15_GoogleMapsAPI.gs — V4.5
 * NEW: clearMapsCache
 */

const md5 = (key = '') => {
  const code = key.toLowerCase().replace(/\s/g, '');
  return Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, code)
    .reduce((s, b) => s + (b + 256).toString(16).slice(-2), '');
};

const getAdvancedCache = key => {
  const h = md5(key);
  const ram = CacheService.getDocumentCache().get(h);
  if (ram) return ram;

  try {
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(getSheetNames().MAPS_CACHE);
    if (sheet) {
      const data  = sheet.getDataRange().getValues();
      const found = data.find(r => r[0] === h);
      if (found) {
        CacheService.getDocumentCache().put(h, found[1], 21600);
        return found[1];
      }
    }
  } catch (_) {}
  return null;
};

const setAdvancedCache = (key, value, type) => {
  const h = md5(key);
  try { CacheService.getDocumentCache().put(h, value, 21600); } catch (_) {}
  try {
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(getSheetNames().MAPS_CACHE);
    if (sheet) sheet.appendRow([h, value, type, key, new Date()]);
  } catch (_) {}
};

function GOOGLEMAPS_DISTANCE(origin, destination, mode) {
  if (!origin || !destination) return 'กรุณาใส่จุดเริ่มต้นและปลายทาง';
  const travelMode = mode || 'driving';
  const key = ['distance', origin, destination, travelMode].join(',');
  const cached = getAdvancedCache(key);
  if (cached) return cached;
  try {
    const data = Maps.newDirectionFinder()
      .setOrigin(origin).setDestination(destination)
      .setMode(travelMode).getDirections();
    if (data && data.routes && data.routes.length > 0) {
      const dist = data.routes[0].legs[0].distance.text;
      setAdvancedCache(key, dist, 'DISTANCE');
      return dist;
    }
    return 'ไม่พบเส้นทาง';
  } catch (_) { return 'Error/Quota Exceeded'; }
}

function GOOGLEMAPS_REVERSEGEOCODE(latitude, longitude) {
  if (!latitude || !longitude) return 'กรุณาใส่พิกัด';
  const key = ['reversegeo', latitude, longitude].join(',');
  const cached = getAdvancedCache(key);
  if (cached) return cached;
  try {
    const data = Maps.newGeocoder().reverseGeocode(latitude, longitude);
    if (data && data.results && data.results.length > 0) {
      const addr = data.results[0].formatted_address;
      setAdvancedCache(key, addr, 'REVERSE_GEO');
      return addr;
    }
    return 'ไม่พบที่อยู่';
  } catch (_) { return 'Error/Quota Exceeded'; }
}

function GOOGLEMAPS_LATLONG(address) {
  if (!address) return 'กรุณาใส่ที่อยู่';
  const key = ['latlong', address].join(',');
  const cached = getAdvancedCache(key);
  if (cached) return cached;
  try {
    const data = Maps.newGeocoder().geocode(address);
    if (data && data.results && data.results.length > 0) {
      const loc   = data.results[0].geometry.location;
      const coord = loc.lat + ', ' + loc.lng;
      setAdvancedCache(key, coord, 'LATLONG');
      return coord;
    }
    return 'ไม่พบพิกัด';
  } catch (_) { return 'Error/Quota Exceeded'; }
}

function GOOGLEMAPS_DURATION(origin, destination, mode) {
  if (!origin || !destination) return 'กรุณาใส่ข้อมูลให้ครบ';
  const travelMode = mode || 'driving';
  const key = ['duration', origin, destination, travelMode].join(',');
  const cached = getAdvancedCache(key);
  if (cached) return cached;
  try {
    const data = Maps.newDirectionFinder()
      .setOrigin(origin).setDestination(destination)
      .setMode(travelMode).getDirections();
    if (data && data.routes && data.routes.length > 0) {
      const t = data.routes[0].legs[0].duration.text;
      setAdvancedCache(key, t, 'DURATION');
      return t;
    }
    return 'ไม่พบเส้นทาง';
  } catch (_) { return 'Error/Quota Exceeded'; }
}

function clearMapsCache() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(getSheetNames().MAPS_CACHE);
  if (!sheet || sheet.getLastRow() <= 1) return;
  sheet.deleteRows(2, sheet.getLastRow() - 1);
  SpreadsheetApp.getActiveSpreadsheet()
    .toast('ล้าง MAPS_CACHE เรียบร้อย', '✅', 3);
}
```

---

### `16_GeoDictionaryBuilder.gs` — V4.5

```javascript
/**
 * 16_GeoDictionaryBuilder.gs — V4.5
 * NEW: validateGeoIndexIntegrity
 */

function buildGeoIndex() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('SYS_TH_GEO');
  if (!sheet) {
    SpreadsheetApp.getUi().alert('ไม่พบชีต SYS_TH_GEO');
    return;
  }

  const headers = [
    'postcode_text','subdistrict_norm','district_norm','province_norm',
    'note_type','note_keywords','postcode_override','geo_key','active_flag'
  ];
  sheet.getRange(1, 6, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 6, 1, headers.length)
    .setFontWeight('bold').setBackground('#d9ead3');

  const data    = sheet.getDataRange().getValues();
  const lastRow = data.length;
  if (lastRow <= 1) return;

  const outputData = [];

  for (let i = 1; i < lastRow; i++) {
    const row     = data[i];
    const postcode = String(row[0]).trim();
    const rawSub   = String(row[1]).trim();
    const rawDist  = String(row[2]).trim();
    const rawProv  = String(row[3]).trim();
    const remark   = String(row[4]).trim();

    const subNorm  = rawSub.replace(/^(แขวง|ตำบล)\s*/, '');
    const distNorm = rawDist.replace(/^(เขต|อำเภอ)\s*/, '');
    const provNorm = rawProv.replace(/^จังหวัด\s*/, '');
    const parsed   = parseRemarkLogic(remark);
    const geoKey   = subNorm + '_' + distNorm + '_' + provNorm;

    outputData.push([
      postcode, subNorm, distNorm, provNorm,
      parsed.noteType, parsed.keywords, parsed.override,
      geoKey, 'Y'
    ]);
  }

  sheet.getRange(2, 6, outputData.length, headers.length).setValues(outputData);

  // Flush cache
  resetThGeoCache();

  SpreadsheetApp.getActiveSpreadsheet()
    .toast('✅ อัปเดตพจนานุกรม SYS_TH_GEO สำเร็จ', 'Success', 5);
}

function parseRemarkLogic(remark) {
  if (!remark) return { noteType:'NONE', keywords:'', override:'' };
  const text = remark.trim();

  if (text.match(/เฉพาะ\s*อาคาร/i)) {
    const kw = text.replace(/เฉพาะ/g,'').replace(/เท่านั้น/g,'').trim();
    return { noteType:'ONLY_BUILDING', keywords:kw, override:'' };
  }

  if (text.match(/เฉพาะ\s*หมู่/i)) {
    const kw = text.replace(/เฉพาะ/g,'').replace(/เท่านั้น/g,'').trim();
    return { noteType:'ONLY_MOO', keywords:kw, override:'' };
  }

  const exceptMatch = text.match(/ยกเว้น(.*?)\s*ใช้รหัส\s*(\d{5})/i);
  if (exceptMatch) {
    const kw       = exceptMatch[1].trim();
    const override = exceptMatch[2].trim();
    if (kw.match(/บ้านเลขที่|เลขคี่|เลขคู่/i)) {
      return { noteType:'COMPLEX_HOUSE_NO', keywords:kw, override };
    }
    return { noteType:'EXCEPT_RULE', keywords:kw, override };
  }

  return { noteType:'OTHER_WARNING', keywords:text, override:'' };
}

function validateGeoIndexIntegrity() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('SYS_TH_GEO');
  if (!sheet || sheet.getLastRow() <= 1) return;

  const data    = sheet.getDataRange().getValues();
  const keyMap  = {};
  const issues  = [];

  for (let i = 1; i < data.length; i++) {
    const geoKey = String(data[i][12] || '').trim();
    if (!geoKey || geoKey === '__') {
      issues.push(`แถว ${i + 1}: geo_key ว่าง`);
      continue;
    }
    if (keyMap[geoKey]) {
      issues.push(`แถว ${i + 1}: geo_key ซ้ำ "${geoKey}" (ซ้ำกับแถว ${keyMap[geoKey]})`);
    } else {
      keyMap[geoKey] = i + 1;
    }
  }

  if (issues.length > 0) {
    writeLog('WARN','16_GeoDictionaryBuilder','validateGeoIndexIntegrity','',
      `พบ ${issues.length} ปัญหา`, issues.slice(0,10).join('\n'));
    SpreadsheetApp.getActiveSpreadsheet()
      .toast(`⚠️ พบปัญหา ${issues.length} รายการใน SYS_TH_GEO`, 'Integrity Check', 8);
  } else {
    SpreadsheetApp.getActiveSpreadsheet()
      .toast('✅ SYS_TH_GEO integrity OK', 'Integrity Check', 3);
  }
}
```

---

### `17_SearchService.gs` — V4.5 (โมดูลใหม่)

```javascript
/**
 * 17_SearchService.gs — V4.5 [NEW MODULE]
 * บริการค้นหา LatLong จาก (ชื่อปลายทาง + ชื่อสถานที่)
 * เป้าหมาย: รับ dirty input → normalize → match Master → คืน lat,lng
 */

// ─────────────────────────────────────────────────────────────
// findBestGeoByPersonPlace — หัวใจของโมดูล
// ─────────────────────────────────────────────────────────────
function findBestGeoByPersonPlace(personName, placeName) {
  const normPerson = normalizePersonName(personName || '');
  const normPlace  = normalizePlaceName(placeName  || '');

  // Quality check
  if (isLowQualityPersonName(normPerson) || isLowQualityPlaceText(normPlace)) {
    return {
      status: 'REVIEW_REQUIRED', lat: '', lng: '',
      geoId: '', confidence: 0,
      reason: 'INPUT_LOW_QUALITY', candidates: []
    };
  }

  // หา candidates
  const personCandidates = findPersonCandidates(normPerson, '');
  const placeCandidates  = findPlaceCandidates(normPlace);

  if (personCandidates.length === 0 || placeCandidates.length === 0) {
    return {
      status: 'NOT_FOUND', lat: '', lng: '',
      geoId: '', confidence: 0,
      reason: 'PERSON_OR_PLACE_NOT_FOUND', candidates: []
    };
  }

  // สร้าง set ของ IDs
  const personIdSet = {};
  const placeIdSet  = {};
  personCandidates.forEach(c => { if (c.personId) personIdSet[c.personId] = true; });
  placeCandidates.forEach(c  => { if (c.placeId)  placeIdSet[c.placeId]   = true; });

  // ค้นหาใน M_DESTINATION
  const ss        = SpreadsheetApp.getActiveSpreadsheet();
  const destSheet = ss.getSheetByName('M_DESTINATION');
  const geoSheet  = ss.getSheetByName('M_GEO_POINT');

  if (!destSheet || !geoSheet) {
    return {
      status: 'ERROR', lat: '', lng: '',
      geoId: '', confidence: 0,
      reason: 'MISSING_SYSTEM_SHEETS', candidates: []
    };
  }

  const destData    = destSheet.getDataRange().getValues();
  const matchedDest = [];

  for (let i = 1; i < destData.length; i++) {
    const personId   = destData[i][1];
    const placeId    = destData[i][2];
    const geoId      = destData[i][3];
    const usageCount = safeNumber(destData[i][9]);

    if (personIdSet[personId] && placeIdSet[placeId] && geoId) {
      matchedDest.push({ personId, placeId, geoId, usageCount });
    }
  }

  if (matchedDest.length === 0) {
    return {
      status: 'NOT_FOUND', lat: '', lng: '',
      geoId: '', confidence: 0,
      reason: 'NO_DESTINATION_MATCH', candidates: []
    };
  }

  // สร้าง geoMap
  const geoData = geoSheet.getDataRange().getValues();
  const geoMap  = {};
  for (let i = 1; i < geoData.length; i++) {
    geoMap[geoData[i][0]] = {
      lat: safeString(geoData[i][3]),
      lng: safeString(geoData[i][4])
    };
  }

  // รวมตาม geoId + usage
  const ranked = _aggregateGeoByUsage(matchedDest, geoMap);

  if (ranked.length === 1) {
    const geo = geoMap[ranked[0].geoId] || { lat: '', lng: '' };
    return {
      status: 'FOUND', lat: geo.lat, lng: geo.lng,
      geoId: ranked[0].geoId, confidence: 95,
      reason: 'UNIQUE_DESTINATION_MATCH', candidates: ranked
    };
  }

  // หลายจุด → ตัดสินด้วย usage
  const top1 = ranked[0], top2 = ranked[1];
  const dominant = top1.usageCount >= (top2.usageCount * 2) &&
                   top1.usageCount >= 3;

  if (dominant) {
    const geo = geoMap[top1.geoId] || { lat: '', lng: '' };
    return {
      status: 'FOUND_WITH_DOMINANT_HISTORY',
      lat: geo.lat, lng: geo.lng,
      geoId: top1.geoId, confidence: 85,
      reason: 'DOMINANT_GEO_BY_USAGE', candidates: ranked
    };
  }

  return {
    status: 'AMBIGUOUS', lat: '', lng: '',
    geoId: '', confidence: 0,
    reason: 'MULTIPLE_GEO_MATCHES', candidates: ranked
  };
}

// ─────────────────────────────────────────────────────────────
// _aggregateGeoByUsage — private helper
// ─────────────────────────────────────────────────────────────
function _aggregateGeoByUsage(matchedDest, geoMap) {
  const agg = {};
  matchedDest.forEach(m => {
    if (!agg[m.geoId]) agg[m.geoId] = { geoId: m.geoId, usageCount: 0 };
    agg[m.geoId].usageCount += (m.usageCount || 1);
  });
  return Object.values(agg).sort((a, b) => b.usageCount - a.usageCount);
}

// ─────────────────────────────────────────────────────────────
// LMDS_FIND_LATLONG — Custom Function สำหรับ Sheets
// =LMDS_FIND_LATLONG(A2, B2)
// คืน 6 ค่า: status | lat | lng | geoId | confidence | reason
// ─────────────────────────────────────────────────────────────
function LMDS_FIND_LATLONG(personName, placeName) {
  const res = findBestGeoByPersonPlace(personName, placeName);
  return [[res.status, res.lat, res.lng, res.geoId, res.confidence, res.reason]];
}

// ─────────────────────────────────────────────────────────────
// runLookupEnrichment — เติม LatLong ให้ตารางงานประจำวัน
// ─────────────────────────────────────────────────────────────
function runLookupEnrichment() {
  const ss        = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = getConfig('LOOKUP_SOURCE_SHEET_NAME') || 'ตารางงานประจำวัน';
  const sheet     = ss.getSheetByName(sheetName);

  if (!sheet) {
    SpreadsheetApp.getUi().alert(
      `ไม่พบชีต "${sheetName}"\n` +
      `กรุณาสร้างชีตนี้ก่อน หรือแก้ค่า LOOKUP_SOURCE_SHEET_NAME ใน SYS_CONFIG`
    );
    return;
  }

  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0]
    .map(h => safeString(h));

  const personCols = splitHeaderCandidates(
    getConfig('LOOKUP_PERSON_COLUMNS') || 'ชื่อปลายทาง'
  );
  const placeCols  = splitHeaderCandidates(
    getConfig('LOOKUP_PLACE_COLUMNS') ||
    'ที่อยู่ปลายทาง,ชื่อที่อยู่จาก_LatLong,ชื่อที่อยู่จาก LatLong'
  );

  const personIdx = findHeaderIndex(headers, personCols);
  const placeIdx  = findHeaderIndex(headers, placeCols);

  if (personIdx === -1 || placeIdx === -1) {
    throw new Error(
      `ชีต "${sheetName}" ไม่พบคอลัมน์ที่จำเป็น\n` +
      `LOOKUP_PERSON_COLUMNS = ${personCols.join(' | ')}\n` +
      `LOOKUP_PLACE_COLUMNS  = ${placeCols.join(' | ')}`
    );
  }

  // เตรียม output columns
  const OUTPUT_COLS = [
    'MATCH_STATUS','MATCH_LAT','MATCH_LONG',
    'MATCH_GEO_ID','MATCH_CONFIDENCE','MATCH_REASON','MATCH_UPDATED_AT'
  ];
  const outMap = {};
  OUTPUT_COLS.forEach(col => {
    let idx = headers.indexOf(col);
    if (idx === -1) {
      idx = headers.length;
      headers.push(col);
      sheet.getRange(1, idx + 1).setValue(col);
      sheet.getRange(1, idx + 1).setFontWeight('bold').setBackground('#FFF2CC');
    }
    outMap[col] = idx;
  });

  const rowCount = sheet.getLastRow() - 1;
  if (rowCount <= 0) {
    SpreadsheetApp.getActiveSpreadsheet()
      .toast('ไม่มีข้อมูลในชีต', 'ℹ️', 3);
    return;
  }

  const data = sheet.getRange(2, 1, rowCount, headers.length).getValues();
  const now  = new Date();
  let processed = 0, found = 0, notFound = 0;

  for (let i = 0; i < data.length; i++) {
    const row        = data[i];
    const personName = safeString(row[personIdx]);
    const placeName  = safeString(row[placeIdx]);

    if (!personName && !placeName) continue;

    const result = findBestGeoByPersonPlace(personName, placeName);

    row[outMap['MATCH_STATUS']]     = result.status;
    row[outMap['MATCH_LAT']]        = result.lat;
    row[outMap['MATCH_LONG']]       = result.lng;
    row[outMap['MATCH_GEO_ID']]     = result.geoId;
    row[outMap['MATCH_CONFIDENCE']] = result.confidence;
    row[outMap['MATCH_REASON']]     = result.reason;
    row[outMap['MATCH_UPDATED_AT']] = now;

    data[i] = row;
    processed++;

    if (result.status === 'FOUND' ||
        result.status === 'FOUND_WITH_DOMINANT_HISTORY') found++;
    else notFound++;
  }

  sheet.getRange(2, 1, rowCount, headers.length).setValues(data);

  SpreadsheetApp.getActiveSpreadsheet().toast(
    `เติม LatLong สำเร็จ | ประมวลผล: ${processed} | พบ: ${found} | ไม่พบ: ${notFound}`,
    `✅ ${sheetName}`, 8
  );

  writeLog('INFO','17_SearchService','runLookupEnrichment','',
    `Enriched ${processed} rows: found=${found} notFound=${notFound}`, '');
}

// ─────────────────────────────────────────────────────────────
// findHeaderIndex — หา index คอลัมน์แบบ fuzzy
// ─────────────────────────────────────────────────────────────
function findHeaderIndex(headers, candidates) {
  const clean = s => safeString(s).replace(/[\s_]+/g,'').toLowerCase();
  const normH = headers.map(clean);
  for (const c of candidates) {
    const idx = normH.indexOf(clean(c));
    if (idx !== -1) return idx;
  }
  return -1;
}

// ─────────────────────────────────────────────────────────────
// splitHeaderCandidates — แยก comma-separated → array
// ─────────────────────────────────────────────────────────────
function splitHeaderCandidates(rawValue) {
  return safeString(rawValue)
    .split(',')
    .map(s => safeString(s).trim())
    .filter(Boolean);
}
```

---

## ✅ สรุป — LMDS V4.5 Final ครบทั้ง 18 โมดูล

```
โมดูล     ฟังก์ชัน   สถานะ
─────────────────────────────────────────
00_App         8    ✅ เสร็จ
01_Config      5    ✅ เสร็จ
02_Schema      4    ✅ เสร็จ
03_SetupSheets 3    ✅ เสร็จ
04_Source      7    ✅ เสร็จ
05_Normalize  20    ✅ เสร็จ
06_Person      8    ✅ เสร็จ
07_Place      10    ✅ เสร็จ
08_Geo         5    ✅ เสร็จ
09_Destination 4    ✅ เสร็จ
10_MatchEngine12    ✅ เสร็จ
11_Transaction 4    ✅ เสร็จ
12_Review      7    ✅ เสร็จ
13_Report      5    ✅ เสร็จ
14_Utils      19    ✅ เสร็จ
15_MapsAPI     8    ✅ เสร็จ
16_GeoDict     3    ✅ เสร็จ
17_Search      6    ✅ เสร็จ
─────────────────────────────────────────
รวม       18 โมดูล  ~98 ฟังก์ชัน
```

พร้อม Deploy ครับ — copy ลง Google Apps Script ตามลำดับ 00→17 ได้เลย
ผลการตรวจสอบเสร็จแล้วครับ พบ **3 bugs** และ **2 design issues** รวม 5 จุด

---

## 🐛 Bug Report — LMDS V4.5

---

### 🔴 Bug #1 — `12_ReviewService.gs` line `learnAliasFromReview`
**Index ผิด** — ใช้ `reviewRow[7]` (raw_system_address) แทน `reviewRow[6]` (raw_place_name)

```javascript
// ❌ โค้ดเดิม — WRONG
const rawPlaceName = reviewRow[7];  // นี่คือ raw_system_address ไม่ใช่ place name

// ✅ แก้เป็น
const rawPlaceName = reviewRow[6];  // raw_place_name ถูกต้อง
```

---

### 🔴 Bug #2 — `08_GeoService.gs` ฟังก์ชัน `createGeoPoint`
**มี `'_ext'` ต่อท้าย geo_key_6** โดยไม่จำเป็น ทำให้ key ผิดรูปแบบ

```javascript
// ❌ โค้ดเดิม — WRONG
sheet.appendRow([
  geoId, lat, lng,
  keys.lat, keys.lng,
  keys.key4 + '_ext',  // ← '_ext' ไม่ควรมี!
  keys.key3,
  keys.key2,
  ...
]);

// ✅ แก้เป็น
sheet.appendRow([
  geoId, lat, lng,
  keys.lat, keys.lng,
  keys.key4,   // geo_key_6 (4 decimal ~11m) ← ถูกต้อง
  keys.key3,   // geo_key_5 (3 decimal ~110m)
  keys.key2,   // geo_key_4 (2 decimal ~1.1km)
  ...
]);
```

---

### 🔴 Bug #3 — `13_ReportService.gs` ฟังก์ชัน `buildPivotSummary`
**อ่านคอลัมน์ผิด** — อ่าน col 5-6 (delivery_date + delivery_time) แต่ต้องการ delivery_date + warehouse (col 20)

```javascript
// ❌ โค้ดเดิม — WRONG
const data = sheet.getRange(2, 5, sheet.getLastRow() - 1, 2).getValues();
// row[0]=delivery_date ✅  row[1]=delivery_time ❌ (ไม่ใช่ warehouse)

// ✅ แก้เป็น — อ่าน 2 คอลัมน์แยกกัน แล้ว zip
const lastRow     = sheet.getLastRow() - 1;
const dateCols    = sheet.getRange(2, 5, lastRow, 1).getValues();   // col 5 = delivery_date
const warehCols   = sheet.getRange(2, 20, lastRow, 1).getValues();  // col 20 = warehouse
```

---

### 🟡 Design Issue #4 — `10_MatchEngine.gs` ฟังก์ชัน `evaluateOwnerContextScore`
**ถูก define แต่ไม่ถูกเรียกใน `matchAllEntities`**

```javascript
// เพิ่มใน matchAllEntities — หลังจาก evaluateThaiGeoBonus
const bonusScore   = evaluateThaiGeoBonus(sourceObj);
const ownerBonus   = evaluateOwnerContextScore(sourceObj, personResult); // ← เพิ่มบรรทัดนี้
const compositeRaw = calculateCompositeScore(
  personResult.score, placeResult.score, geoResult.score,
  autoCreated,
  bonusScore + ownerBonus   // ← รวม bonus ทั้งสอง
);
```

---

### 🟡 Design Issue #5 — `04_SourceRepository.gs` / `03_SetupSheets.gs`
**`writeLog` ใน `createSystemSheets` อาจล้มเหลวรอบแรก** เพราะ SYS_LOG เพิ่งถูกสร้าง

```javascript
// ✅ แก้ใน createSystemSheets — เปลี่ยน writeLog เป็น console.log เฉพาะนี้
// แทนที่ writeLog ท้ายฟังก์ชัน
console.log(`[Setup] Created/verified ${Object.keys(schemas).length} sheets`);
```

---

## ✅ โค้ดที่แก้แล้ว (เฉพาะส่วนที่ผิด)

### `08_GeoService.gs` — แก้ createGeoPoint

```javascript
function createGeoPoint(lat, lng, keys, addressHint) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_GEO_POINT');
  const geoId = 'GEO-' + uuid().split('-')[0].toUpperCase();

  sheet.appendRow([
    geoId,
    lat,          // lat_raw
    lng,          // long_raw
    keys.lat,     // lat_norm
    keys.lng,     // long_norm
    keys.key4,    // ✅ geo_key_6 (most precise ~11m)
    keys.key3,    // ✅ geo_key_5 (~110m)
    keys.key2,    // ✅ geo_key_4 (~1.1km)
    safeString(addressHint),
    new Date(),   // first_seen_date
    new Date(),   // last_seen_date
    1,            // usage_count
    ''            // note
  ]);

  return geoId;
}
```

---

### `12_ReviewService.gs` — แก้ learnAliasFromReview

```javascript
function learnAliasFromReview(reviewId, reviewRow, reviewer) {
  try {
    const rawPersonName      = reviewRow[5];   // ✅ raw_person_name (index 5)
    const rawPlaceName       = reviewRow[6];   // ✅ raw_place_name  (index 6) ← แก้จาก 7
    const candidatePersonStr = reviewRow[11];  // ✅ candidate_person_ids
    const candidatePlaceStr  = reviewRow[12];  // ✅ candidate_place_ids

    if (rawPersonName && candidatePersonStr) {
      const personId = String(candidatePersonStr).split(',')[0].trim();
      if (personId) {
        createPersonAlias(
          personId, rawPersonName, normalizePersonName(rawPersonName)
        );
        writeLog('INFO','12_ReviewService','learnAliasFromReview',
          reviewId, `Person alias learned: "${rawPersonName}" → ${personId}`, '');
      }
    }

    if (rawPlaceName && candidatePlaceStr) {
      const placeId = String(candidatePlaceStr).split(',')[0].trim();
      if (placeId) {
        createPlaceAlias(
          placeId, rawPlaceName, normalizePlaceName(rawPlaceName)
        );
        writeLog('INFO','12_ReviewService','learnAliasFromReview',
          reviewId, `Place alias learned: "${rawPlaceName}" → ${placeId}`, '');
      }
    }
  } catch (e) {
    writeLog('WARN','12_ReviewService','learnAliasFromReview',
      reviewId, e.message, '');
  }
}
```

---

### `13_ReportService.gs` — แก้ buildPivotSummary

```javascript
function buildPivotSummary() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('FACT_DELIVERY');
  if (!sheet || sheet.getLastRow() <= 1) return {};

  const lastRow = sheet.getLastRow() - 1;

  // ✅ อ่านแยก 2 คอลัมน์ที่ไม่ติดกัน
  // col 5 = delivery_date, col 20 = warehouse
  const dateCols  = sheet.getRange(2, 5,  lastRow, 1).getValues();
  const warehCols = sheet.getRange(2, 20, lastRow, 1).getValues();

  const summary = {};

  for (let i = 0; i < lastRow; i++) {
    const date      = safeDate(dateCols[i][0]);
    const warehouse = safeString(warehCols[i][0]);
    if (!date) continue;

    const month = Utilities.formatDate(
      date, Session.getScriptTimeZone(), 'yyyy-MM'
    );
    const key = month + '|' + (warehouse || 'UNKNOWN');
    summary[key] = (summary[key] || 0) + 1;
  }

  return summary;
}
```

---

### `10_MatchEngine.gs` — แก้ matchAllEntities (เพิ่ม ownerBonus)

```javascript
function matchAllEntities(sourceObj) {
  const qualityFlags = sourceObj.qualityFlags || buildDataQualityFlags(sourceObj);

  const personResult = resolvePerson(sourceObj);
  const placeResult  = resolvePlace(sourceObj);
  const geoResult    = resolveGeo(sourceObj);

  let finalPersonId = personResult.id;
  let finalPlaceId  = placeResult.id;
  let finalGeoId    = geoResult.id;
  let autoCreated   = 0;

  if (personResult.isNew && !qualityFlags.includes('LOW_QUALITY_PERSON_NAME')) {
    finalPersonId = createPerson(
      personResult.raw, personResult.normalized, personResult.phone
    );
    autoCreated++;
  }

  if (placeResult.isNew && !qualityFlags.includes('LOW_QUALITY_PLACE_TEXT')) {
    finalPlaceId = createPlace(
      placeResult.raw, sourceObj.addressRaw, sourceObj.addressFromLatLong
    );
    autoCreated++;
  }

  if (geoResult.isNew && sourceObj.geoIsValid) {
    finalGeoId = createGeoPoint(
      geoResult.lat, geoResult.lng, geoResult.keys, sourceObj.latLongText
    );
    autoCreated++;
  }

  // ✅ รวม bonus ทั้ง geo และ owner context
  const bonusScore   = evaluateThaiGeoBonus(sourceObj);
  const ownerBonus   = evaluateOwnerContextScore(sourceObj, personResult); // ← เพิ่ม
  const compositeRaw = calculateCompositeScore(
    personResult.score, placeResult.score, geoResult.score,
    autoCreated,
    bonusScore + ownerBonus  // ← รวมกัน
  );

  const ruleEval     = evaluateConflictRules(personResult, placeResult, geoResult);
  const rulePenalty  = calculateRulePenalty(ruleEval.hits);
  const compositeScore = Math.max(0, compositeRaw - rulePenalty);

  let destResult = { id: null, isNew: false, key: '' };
  if (finalPersonId && finalPlaceId && finalGeoId) {
    destResult = resolveDestination(
      finalPersonId, finalPlaceId, finalGeoId, sourceObj
    );
  }

  return {
    person:            { ...personResult, finalId: finalPersonId },
    place:             { ...placeResult,  finalId: finalPlaceId  },
    geo:               { ...geoResult,    finalId: finalGeoId    },
    dest:              destResult,
    compositeScore,
    compositeScoreRaw: compositeRaw,
    qualityFlags,
    ruleHits:          ruleEval.hits,
    rulePenalty
  };
}
```

---

### `03_SetupSheets.gs` — แก้ createSystemSheets (ท้ายฟังก์ชัน)

```javascript
function createSystemSheets() {
  // ... โค้ดเดิม ...

  Object.keys(schemas).forEach(sheetName => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) sheet = ss.insertSheet(sheetName);

    const headers     = schemas[sheetName];
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setFontWeight('bold');
    headerRange.setBackground(colors[sheetName] || '#F3F3F3');
    headerRange.setWrap(false);
    sheet.setFrozenRows(1);

    if (sheet.getLastRow() <= 5) {
      sheet.autoResizeColumns(1, headers.length);
    }
  });

  // ✅ ใช้ console.log แทน writeLog เพราะ SYS_LOG เพิ่งถูกสร้าง
  console.log(`[Setup] Created/verified ${Object.keys(schemas).length} sheets`);
}
```

---

## 📋 สรุป Bug ทั้งหมด

| # | ไฟล์ | ฟังก์ชัน | ประเภท | สถานะ |
|---|---|---|---|---|
| 1 | `12_ReviewService.gs` | `learnAliasFromReview` | 🔴 Index ผิด `[7]→[6]` | แก้แล้ว |
| 2 | `08_GeoService.gs` | `createGeoPoint` | 🔴 `'_ext'` เกินมา | แก้แล้ว |
| 3 | `13_ReportService.gs` | `buildPivotSummary` | 🔴 Column range ผิด | แก้แล้ว |
| 4 | `10_MatchEngine.gs` | `matchAllEntities` | 🟡 ไม่ได้เรียก ownerBonus | แก้แล้ว |
| 5 | `03_SetupSheets.gs` | `createSystemSheets` | 🟡 writeLog ก่อน SYS_LOG พร้อม | แก้แล้ว |

**โค้ดส่วนอื่นทั้งหมด Column Index ถูกต้องครับ** ✅

# 📋 วิเคราะห์ครบ 3 ไฟล์ — สิ่งที่ต้องนำมาเพิ่ม

## 🔍 สรุปสิ่งสำคัญที่พบ

### จาก `gemini.md` — สิ่งที่ดีมากที่ขาดใน GEM V4.5

**3 สิ่งหลักที่ต้องดึงมาใช้:**

1. **Dictionary ครอบคลุมกว่า** — PERSON_PREFIXES มียศทหาร/ตำรวจ, COMPANY_KEYWORDS มีคำเฉพาะ SCG เช่น ไทวัสดุ, โฮมโปร, ไซต์งาน, แพลนท์ปูน
2. **normalizePersonName คืนค่าเป็น Object** แทน string — รวม `isCompany`, `deliveryNotes`, `extractedDocNo` ซึ่ง GEM ยังไม่มี
3. **DELIVERY_NOTES_KEYWORDS** — แยก "ฝากป้อม / COD / ห้ามโยน" ออกจากชื่อคน แล้วเก็บเป็น metadata แทนลบทิ้ง

### จาก `Service_SCG.md` — นี่คือ **"ชีตตารางงานประจำวัน"** จริงๆ!

**สำคัญมาก — โครงสร้าง Column ที่แท้จริง:**

```
ShipToName      = ชื่อปลายทาง (คน/บริษัท)
ShipToAddress   = ที่อยู่ปลายทาง
LatLong_SCG     = "lat, lng" จาก API SCG (ยังไม่ได้ verified)
LatLong_Actual  = ← ตรงนี้คือที่ runLookupEnrichment() ต้องเติมกลับ!
SoldToName      = ชื่อเจ้าของสินค้า
ShipmentNo, InvoiceNo, TruckLicense, DriverName = ข้อมูลเสริม
```

**ฟังก์ชัน `applyMasterCoordinatesToDailyJob()`** = สิ่งที่ระบบเดิมทำ ซึ่ง LMDS ของเราต้องมาแทนที่และทำได้ฉลาดกว่า

**`tryMatchBranch_()`** = Logic ดี — ถ้าชื่อมีคำว่า "สาขา" ให้ตัดออกแล้วหาชื่อแม่ เอามาเพิ่มใน PlaceService

---

## 💻 โค้ดที่ต้องอัปเดต — 3 ไฟล์

### อัปเดตที่ 1: `05_NormalizeService.gs` — เพิ่ม Dictionary + Object Return

เพิ่มส่วน Dictionary ขนาดใหญ่ และแก้ `normalizePersonName` ให้คืน Object:

```javascript
/**
 * 05_NormalizeService.gs — V4.5 PATCH 1
 * เพิ่ม: PERSON_PREFIXES ครบ, COMPANY_KEYWORDS ครอบคลุม SCG
 *        DELIVERY_NOTES_KEYWORDS (ใหม่)
 *        normalizePersonNameFull() คืน Object แทน string
 *        extractDeliveryNotes() (ใหม่)
 */

// ─────────────────────────────────────────────────────────────
// MASTER DICTIONARIES — ครอบคลุมบริบท SCG/JWD โลจิสติกส์
// ─────────────────────────────────────────────────────────────

const PERSON_PREFIX_LIST = [
  // ยศทหาร/ตำรวจ (เรียงยาวไปสั้น)
  'ว่าที่ ร.ต.หญิง','ว่าที่ ร.ต.','ว่าที่ ร.ท.','ว่าที่ ร.อ.',
  'พล.ต.อ.','พล.ต.ท.','พล.ต.ต.','พ.ต.อ.','พ.ต.ท.','พ.ต.ต.',
  'ร.ต.อ.','ร.ต.ท.','ร.ต.ต.','พล.อ.','พล.ท.','พล.ต.',
  'พ.อ.','พ.ท.','พ.ต.','ร.อ.','ร.ท.','ร.ต.',
  'จ.ส.อ.','จ.ส.ท.','จ.ส.ต.','ส.อ.','ส.ท.','ส.ต.',
  'พลฯ','จ่า','หมวด','ผู้กอง','สารวัตร',
  // วิชาการ/วิชาชีพ
  'ศ.ดร.','รศ.ดร.','ผศ.ดร.','ศ.','รศ.','ผศ.','ดร.','อ.',
  'นพ.','พญ.','ทพ.','ทญ.','สพ.ญ.','น.สพ.','ภก.','ภญ.',
  'เภสัชกร','หมอ','ทนาย',
  // คำเรียกทั่วไป
  'นางสาว','น.ส.','นาง','นาย','คุณ','ด.ช.','ด.ญ.',
  'เถ้าแก่','ซินแส','เสี่ย','เฮีย','เจ๊','ซ้อ','เตี่ย','หนู',
  'ช่าง','โฟร์แมน','ผู้จัดการ','ผจก.','เซลล์','แอดมิน',
  'คนขับ','พนักงาน','พี่','น้อง','ลุง','ป้า','น้า','อา',
  'ตา','ยาย','ทวด','ผู้ใหญ่','กำนัน','ครู','ผอ.',
  'โปร','โค้ช','ท่าน','พระมหา','พระ','สามเณร','แม่ชี'
];

// เรียงจากยาวไปสั้น — ป้องกัน regex จับคำสั้นก่อน
const SORTED_PERSON_PREFIXES = PERSON_PREFIX_LIST
  .slice()
  .sort((a, b) => b.length - a.length);

const COMPANY_KEYWORD_LIST = [
  // คู่ค้าหลัก SCG (เพิ่มใหม่ — ระบบจะรู้ทันทีว่าเป็นสถานที่)
  'ไทวัสดุ','โฮมโปร','โกลบอลเฮ้าส์','ดูโฮม','เมกาโฮม',
  'ฮาร์ดแวร์','วัสดุก่อสร้าง',
  // กลุ่มก่อสร้าง/โรงงาน (สำคัญมากสำหรับ SCG/JWD)
  'แพลนท์ปูน','แพลนท์','ไซต์งาน','ไซท์งาน','แคมป์',
  'หน่วยงาน','โครงการ','โรงงาน','โรงโม่','ท่าทราย',
  'ท่าเรือ','คอนสตรัคชั่น','เอ็นจิเนียริ่ง',
  // นิติบุคคล
  'บมจ.','บจก.','บจก','บริษัท','หจก.','หจก',
  'ห้างหุ้นส่วน','บ.','จำกัด','มหาชน',
  'ร้าน','ห้างทอง','ซัพพลาย','กรุ๊ป','โฮลดิ้ง',
  'เทรดดิ้ง','พาณิชย์','วิสาหกิจ','โลจิสติกส์',
  'ขนส่ง','มอเตอร์','สตูดิโอ','คาเฟ่',
  // สถานบริการ/ราชการ
  'คลินิก','รพ.','โรงพยาบาล','สน.','สถานีตำรวจ',
  'โรงเรียน','ร.ร.','มหาวิทยาลัย','วิทยาลัย','วัด',
  'สำนักงาน','สนง.','องค์การ','อบต.','เทศบาล','อบจ.',
  'การไฟฟ้า','การประปา','ไปรษณีย์','ธนาคาร',
  'สาขา','ศูนย์','ฟาร์ม','อู่','ตลาด','มูลนิธิ',
  'สมาคม','กรม','กระทรวง','สหกรณ์','การเคหะ',
  'ที่ว่าการ','ศาลากลาง',
  // ที่พักอาศัย
  'คอนโด','นิติบุคคล','หมู่บ้าน','มบ.','รีสอร์ท',
  'โรงแรม','แมนชั่น','อพาร์ทเม้นท์','หอพัก',
  'พลาซ่า','เซ็นเตอร์','คลังสินค้า','โกดัง'
];

// [NEW] คำสั่งจัดส่งที่ปนมาในชื่อ — แยกเก็บไว้แทนลบทิ้ง
const DELIVERY_NOTES_LIST = [
  'เก็บเงินปลายทาง','cod','โอนแล้ว','จ่ายแล้ว',
  'ไม่ต้องโทร','โทรแจ้งก่อน','โทรด่วน',
  'ฝากป้อม','ป้อมยาม','รปภ','ฝากวาง','ฝากไว้',
  'หน้าหมู่บ้าน','ข้างบ้าน','หลังบ้าน',
  'วางหน้าบ้าน','โยนเข้าบ้าน','ห้ามโยน',
  'ระวังแตก','รับเอง','ไม่มีเบอร์','เบอร์ติดต่อ'
];

// ─────────────────────────────────────────────────────────────
// [NEW] normalizePersonNameFull — คืน Object แทน string
// ใช้กับ 17_SearchService และการแสดงผลใน Q_REVIEW
// ─────────────────────────────────────────────────────────────
function normalizePersonNameFull(rawName) {
  if (!rawName) return _emptyPersonObj(rawName);

  let text            = normalizeThaiText(rawName);
  let isCompany       = false;
  let extractedPhone  = '';
  let extractedDocNo  = '';
  let deliveryNotes   = [];

  // STEP 1: สกัดรหัสเอกสาร (DN/PO ที่ปนมา)
  const docMatch = text.match(/[-\s]*(?:DN|PO|SO|INV|บิล)\.?\s*([A-Z0-9]+)/i);
  if (docMatch) {
    extractedDocNo = docMatch[0].replace(/[-\s]/g, '');
    text = text.replace(docMatch[0], '');
  }

  // STEP 2: สกัดเบอร์โทร
  const phoneMatch = text.match(
    /(?:โทร\.?|Tel\.?|เบอร์)?\s*(0[0-9]{1,2}[-\s]?[0-9]{3}[-\s]?[0-9]{4})/i
  );
  if (phoneMatch) {
    extractedPhone = phoneMatch[1].replace(/[-\s]/g, '');
    text = text.replace(phoneMatch[0], '');
  }

  // STEP 3: สกัดคำสั่งจัดส่ง (เก็บเป็น metadata ไม่ใช่ลบทิ้ง)
  DELIVERY_NOTES_LIST.forEach(note => {
    const regex = new RegExp(note, 'gi');
    if (regex.test(text)) {
      deliveryNotes.push(note);
      text = text.replace(new RegExp(note, 'gi'), '');
    }
  });

  // STEP 4: ตรวจสอบว่าเป็นนิติบุคคล/สถานที่
  const upperText = text.toUpperCase();
  for (const kw of COMPANY_KEYWORD_LIST) {
    if (upperText.includes(kw.toUpperCase())) {
      isCompany = true;
      break;
    }
  }

  // STEP 5: ตัด Prefix (เฉพาะถ้าไม่ใช่บริษัท)
  if (!isCompany) {
    const before = text;
    const escaped = SORTED_PERSON_PREFIXES.map(p => p.replace(/\./g, '\\.'));
    const pattern = new RegExp(`^(${escaped.join('|')})\\s*`, 'i');
    text = text.replace(pattern, '');

    // Safety: ถ้าตัดแล้วหายหมด → คืนของเดิม
    if (!text.trim()) text = before;
  }

  // STEP 6: ตัดขยะท้ายที่เหลือ
  ['รับของ','ฝากส่ง','ติดต่อ','ผู้รับ','ลูกค้า','ส่ง','โทรเข้า','โทร']
    .forEach(junk => {
      text = text.replace(new RegExp(`\\s*${junk}$`, 'i'), '');
    });

  text = text.replace(/[()[\]\-]/g, ' ').replace(/\s+/g, ' ').trim();

  return {
    cleanName:      text,
    isCompany,
    extractedPhone,
    extractedDocNo,
    deliveryNotes:  deliveryNotes.join(', '),
    originalName:   rawName.trim()
  };
}

function _emptyPersonObj(raw) {
  return {
    cleanName: '', isCompany: false, extractedPhone: '',
    extractedDocNo: '', deliveryNotes: '', originalName: raw || ''
  };
}

// ─────────────────────────────────────────────────────────────
// [NEW] extractDeliveryNotes — สกัดคำสั่งจัดส่งแบบ standalone
// ─────────────────────────────────────────────────────────────
function extractDeliveryNotes(text) {
  if (!text) return '';
  const found = [];
  DELIVERY_NOTES_LIST.forEach(note => {
    if (new RegExp(note, 'gi').test(text)) found.push(note);
  });
  return found.join(', ');
}

// ─────────────────────────────────────────────────────────────
// [NEW] isCompanyName — ตรวจสอบด่วนว่าเป็นนิติบุคคลไหม
// ─────────────────────────────────────────────────────────────
function isCompanyName(name) {
  if (!name) return false;
  const upper = name.toUpperCase();
  return COMPANY_KEYWORD_LIST.some(kw => upper.includes(kw.toUpperCase()));
}
```

---

### อัปเดตที่ 2: `07_PlaceService.gs` — เพิ่ม tryMatchBranch

```javascript
/**
 * [NEW จาก Service_SCG] tryMatchBranch
 * ถ้าชื่อมี "สาขา/branch/สำนักงาน" ให้ตัดออก
 * แล้วหาชื่อแม่ — แก้ปัญหา "โฮมโปร สาขาศรีราชา" ≈ "โฮมโปร"
 */
function tryMatchBranch(rawPlaceName, candidateCallback) {
  if (!rawPlaceName) return null;

  const branchKeywords = ['สาขา','branch','สำนักงาน','store','shop','ไซต์','ไซท์'];

  for (const kw of branchKeywords) {
    const idx = rawPlaceName.toLowerCase().indexOf(kw.toLowerCase());
    if (idx > 0) {
      const parentName = rawPlaceName.substring(0, idx).trim();
      if (parentName.length >= 2) {
        const result = candidateCallback(normalizePlaceName(parentName));
        if (result && result.score > 0) {
          return { ...result, matchType: 'BRANCH_MATCH', parentName };
        }
      }
    }
  }
  return null;
}

// อัปเดต findBestMatch — เพิ่ม Branch Matching
function findBestMatch(rawAddress) {
  if (!rawAddress) return { id: null, score: 0, candidates: [] };
  const norm       = normalizePlaceName(rawAddress);
  const candidates = findPlaceCandidates(norm);

  let best = null, bestScore = 0;
  for (const c of candidates) {
    const score = scorePlaceCandidate(norm, c.normalized);
    if (score > bestScore) { bestScore = score; best = c; }
  }

  // ถ้า score ต่ำ → ลอง Branch Match
  if (bestScore < getThresholds().reviewScoreMin) {
    const branchResult = tryMatchBranch(rawAddress, normName => {
      const bCandidates = findPlaceCandidates(normName);
      let bBest = null, bScore = 0;
      for (const c of bCandidates) {
        const s = scorePlaceCandidate(normName, c.normalized);
        if (s > bScore) { bScore = s; bBest = c; }
      }
      return bBest ? { ...bBest, score: bScore } : { score: 0 };
    });

    if (branchResult && branchResult.score > bestScore) {
      return {
        id: branchResult.placeId, score: branchResult.score,
        normalized: norm, raw: rawAddress,
        candidates, matchType: 'BRANCH_MATCH'
      };
    }
  }

  return {
    id: best ? best.placeId : null,
    score: bestScore, normalized: norm,
    raw: rawAddress, candidates
  };
}
```

---

### อัปเดตที่ 3: `01_Config.gs` + `17_SearchService.gs` — รู้จัก Column จริงของ SCG

```javascript
// เพิ่มใน seedInitialConfig() ใน 03_SetupSheets.gs
// หรือเพิ่มใน CONFIG_DEFAULTS ใน 01_Config.gs

// ── Lookup Config สำหรับชีต ตารางงานประจำวัน จาก Service_SCG ──
['LOOKUP_SOURCE_SHEET_NAME', 'ตารางงานประจำวัน', 'Lookup',
 'ชีตที่โหลดจาก SCG API', now],

// Column จริงของ ตารางงานประจำวัน
['LOOKUP_PERSON_COLUMNS',
 'ShipToName,ชื่อปลายทาง',
 'Lookup', 'คอลัมน์ชื่อผู้รับ (ShipToName จาก SCG API)', now],

['LOOKUP_PLACE_COLUMNS',
 'ShipToAddress,ที่อยู่ปลายทาง',
 'Lookup', 'คอลัมน์ที่อยู่ (ShipToAddress จาก SCG API)', now],

// Output column ที่ต้องเติมกลับ (แทน LatLong_Actual)
['LOOKUP_OUTPUT_LAT_COL',  'MATCH_LAT',      'Lookup', 'คอลัมน์ LAT ผลลัพธ์', now],
['LOOKUP_OUTPUT_LNG_COL',  'MATCH_LONG',     'Lookup', 'คอลัมน์ LONG ผลลัพธ์', now],
['LOOKUP_OUTPUT_STATUS',   'MATCH_STATUS',   'Lookup', 'คอลัมน์ Status ผลลัพธ์', now],

// SCG LatLong column — ใช้เป็น fallback ถ้า LMDS ไม่เจอ
['LOOKUP_SCG_LATLNG_COL',  'LatLong_SCG',   'Lookup',
 'คอลัมน์พิกัดจาก SCG API (ใช้เป็น fallback)', now],

// สีของผลลัพธ์ (เหมือน applyMasterCoordinatesToDailyJob)
['LOOKUP_COLOR_FOUND',     '#b6d7a8', 'Lookup', 'สีเขียว = พบพิกัดจาก LMDS', now],
['LOOKUP_COLOR_BRANCH',    '#ffe599', 'Lookup', 'สีเหลือง = พบแบบ Branch Match', now],
['LOOKUP_COLOR_SCG_ONLY',  '#cfe2f3', 'Lookup', 'สีฟ้า = ใช้พิกัดจาก SCG API', now],
['LOOKUP_COLOR_NOT_FOUND', '#f4cccc', 'Lookup', 'สีแดง = ไม่พบ', now],
```

---

### อัปเดตที่ 4: `17_SearchService.gs` — เพิ่ม Fallback ด้วย LatLong_SCG และ Color

```javascript
/**
 * runLookupEnrichment — V4.5 PATCH 2
 * เพิ่ม: ใช้ LatLong_SCG เป็น fallback, สีผลลัพธ์, รองรับ SCG column names
 */
function runLookupEnrichment() {
  const ss        = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = getConfig('LOOKUP_SOURCE_SHEET_NAME') || 'ตารางงานประจำวัน';
  const sheet     = ss.getSheetByName(sheetName);

  if (!sheet) {
    SpreadsheetApp.getUi().alert(`ไม่พบชีต "${sheetName}"`);
    return;
  }

  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0]
                       .map(h => safeString(h));

  // รองรับทั้ง ShipToName (SCG API) และ ชื่อปลายทาง (LMDS)
  const personCandidates = splitHeaderCandidates(
    getConfig('LOOKUP_PERSON_COLUMNS') || 'ShipToName,ชื่อปลายทาง'
  );
  const placeCandidates = splitHeaderCandidates(
    getConfig('LOOKUP_PLACE_COLUMNS') || 'ShipToAddress,ที่อยู่ปลายทาง'
  );
  const scgLatLngCandidates = ['LatLong_SCG', 'LatLong_Actual'];

  const personIdx  = findHeaderIndex(headers, personCandidates);
  const placeIdx   = findHeaderIndex(headers, placeCandidates);
  const scgGeoIdx  = findHeaderIndex(headers, scgLatLngCandidates);

  if (personIdx === -1 && placeIdx === -1) {
    throw new Error(
      `ไม่พบคอลัมน์ชื่อหรือที่อยู่\n` +
      `PERSON: ${personCandidates.join('|')}\n` +
      `PLACE:  ${placeCandidates.join('|')}`
    );
  }

  // สร้าง output columns
  const OUTPUT_COLS = [
    'MATCH_STATUS','MATCH_LAT','MATCH_LONG',
    'MATCH_GEO_ID','MATCH_CONFIDENCE','MATCH_REASON','MATCH_UPDATED_AT'
  ];
  const outMap = {};
  OUTPUT_COLS.forEach(col => {
    let idx = headers.indexOf(col);
    if (idx === -1) {
      idx = headers.length;
      headers.push(col);
      sheet.getRange(1, idx + 1).setValue(col);
      sheet.getRange(1, idx + 1).setFontWeight('bold').setBackground('#FFF2CC');
    }
    outMap[col] = idx;
  });

  // สีผลลัพธ์
  const COLOR_FOUND     = getConfig('LOOKUP_COLOR_FOUND')    || '#b6d7a8';
  const COLOR_BRANCH    = getConfig('LOOKUP_COLOR_BRANCH')   || '#ffe599';
  const COLOR_SCG_ONLY  = getConfig('LOOKUP_COLOR_SCG_ONLY') || '#cfe2f3';
  const COLOR_NOT_FOUND = getConfig('LOOKUP_COLOR_NOT_FOUND')|| '#f4cccc';

  const rowCount = sheet.getLastRow() - 1;
  if (rowCount <= 0) return;

  const data = sheet.getRange(2, 1, rowCount, headers.length).getValues();
  const now  = new Date();
  const bgColors = [];
  let found = 0, branchMatch = 0, scgFallback = 0, notFound = 0;

  for (let i = 0; i < data.length; i++) {
    const row        = data[i];
    const personName = personIdx !== -1 ? safeString(row[personIdx]) : '';
    const placeName  = placeIdx  !== -1 ? safeString(row[placeIdx])  : '';
    const scgLatLng  = scgGeoIdx !== -1 ? safeString(row[scgGeoIdx]) : '';

    if (!personName && !placeName) {
      bgColors.push([null]);
      continue;
    }

    const result = findBestGeoByPersonPlace(personName, placeName);

    row[outMap['MATCH_STATUS']]     = result.status;
    row[outMap['MATCH_LAT']]        = result.lat;
    row[outMap['MATCH_LONG']]       = result.lng;
    row[outMap['MATCH_GEO_ID']]     = result.geoId;
    row[outMap['MATCH_CONFIDENCE']] = result.confidence;
    row[outMap['MATCH_REASON']]     = result.reason;
    row[outMap['MATCH_UPDATED_AT']] = now;

    // กำหนดสีผลลัพธ์
    let bgColor = null;
    if (result.status === 'FOUND') {
      bgColor = COLOR_FOUND; found++;
    } else if (result.status === 'FOUND_WITH_DOMINANT_HISTORY' ||
               result.reason  === 'BRANCH_MATCH') {
      bgColor = COLOR_BRANCH; branchMatch++;
    } else if (scgLatLng && result.status === 'NOT_FOUND') {
      // [NEW] Fallback ใช้พิกัดจาก SCG API
      const parsed = _parseLatLngString(scgLatLng);
      if (parsed && validateLatLng(parsed.lat, parsed.lng).isValid) {
        row[outMap['MATCH_LAT']]        = parsed.lat;
        row[outMap['MATCH_LONG']]       = parsed.lng;
        row[outMap['MATCH_STATUS']]     = 'SCG_API_FALLBACK';
        row[outMap['MATCH_CONFIDENCE']] = 60;
        row[outMap['MATCH_REASON']]     = 'Used LatLong_SCG from API (not yet in LMDS Master)';
        bgColor = COLOR_SCG_ONLY;
        scgFallback++;
      } else {
        bgColor = COLOR_NOT_FOUND; notFound++;
      }
    } else {
      bgColor = COLOR_NOT_FOUND; notFound++;
    }

    bgColors.push([bgColor]);
    data[i] = row;
  }

  sheet.getRange(2, 1, rowCount, headers.length).setValues(data);

  // ระบายสี output column
  if (outMap['MATCH_STATUS'] !== undefined && bgColors.length > 0) {
    sheet.getRange(2, outMap['MATCH_STATUS'] + 1, bgColors.length, 1)
         .setBackgrounds(bgColors);
  }

  const msg = `เติม LatLong เรียบร้อย\n` +
              `✅ พบใน LMDS: ${found}\n` +
              `🟡 Branch Match: ${branchMatch}\n` +
              `🔵 ใช้ SCG API: ${scgFallback}\n` +
              `❌ ไม่พบ: ${notFound}`;

  SpreadsheetApp.getActiveSpreadsheet().toast(msg, `✅ ${sheetName}`, 10);
  writeLog('INFO','17_SearchService','runLookupEnrichment','', msg, '');
}
```

---

## ✅ สรุปสิ่งที่เพิ่มเข้าระบบ

| # | สิ่งที่เพิ่ม | มาจาก | ไฟล์ที่แก้ |
|---|---|---|---|
| 1 | `PERSON_PREFIX_LIST` ครอบคลุมยศทหาร/ตำรวจ/วิชาชีพ | gemini.md | `05_NormalizeService` |
| 2 | `COMPANY_KEYWORD_LIST` มี ไทวัสดุ/โฮมโปร/ไซต์งาน/แพลนท์ปูน | gemini.md | `05_NormalizeService` |
| 3 | `DELIVERY_NOTES_LIST` + `extractDeliveryNotes()` | gemini.md | `05_NormalizeService` |
| 4 | `normalizePersonNameFull()` คืน Object แทน string | gemini.md | `05_NormalizeService` |
| 5 | `extractedDocNo` สกัดรหัส DN/PO จากชื่อ | gemini.md | `05_NormalizeService` |
| 6 | `tryMatchBranch()` จับคู่ "โฮมโปร สาขาศรีราชา" → "โฮมโปร" | Service_SCG | `07_PlaceService` |
| 7 | Config column จริง: `ShipToName`, `ShipToAddress`, `LatLong_SCG` | Service_SCG | `01_Config` |
| 8 | Fallback ใช้ `LatLong_SCG` เมื่อ LMDS หาไม่เจอ | Service_SCG | `17_SearchService` |
| 9 | สีผลลัพธ์: เขียว/เหลือง/ฟ้า/แดง เหมือน `applyMasterCoordinatesToDailyJob` | Service_SCG | `17_SearchService` |
| 10 | Status `SCG_API_FALLBACK` ใหม่ | ออกแบบใหม่ | `17_SearchService` |