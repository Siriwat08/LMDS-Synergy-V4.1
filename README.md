# 📦 Logistics Master Data System (LMDS) V4.4
### เวอร์ชัน: Standard Edition (Full AI Synthesis) - Manual Safety Mode

ระบบจัดการฐานข้อมูลหลัก (Master Data Management) สำหรับงานขนส่งสินค้า พัฒนาบน Google Apps Script เพื่อแก้ปัญหาความซ้ำซ้อนของข้อมูลและเพิ่มความแม่นยำของพิกัดจัดส่ง

---

## 🌟 ฟีเจอร์เด่น (Key Features)

- **Relational Database Model:** แยกข้อมูลเป็น 3 ชั้น (Raw Data -> Master Data -> Fact Delivery) เพื่อความสะอาดและไม่ซ้ำซ้อน
- **AI Synthesis Engine:** รวมเทคนิคที่ดีที่สุดจาก AI 8 ค่าย (เช่น Unicode NFC, Advanced Thai Regex)
- **Manual Safety Watch:** ระบบเฝ้าระวังขีดจำกัด 6 นาทีของ Google โดยจะหยุดพักและบันทึก Checkpoint ให้โดยอัตโนมัติ เพื่อให้แอดมินกดรันต่อเองได้อย่างปลอดภัย
- **Google Maps Cache:** ระบบจำพิกัดและระยะทางลงในชีต `MAPS_CACHE` ถาวร ช่วยประหยัด Quota และเพิ่มความเร็วในการรัน
- **Thai Geo Bonus Scoring:** ใช้ฐานข้อมูล `SYS_TH_GEO` มาช่วยเพิ่มคะแนนความแม่นยำ (Bonus) หากที่อยู่ดิบตรงกับพิกัดจริง
- **Timed Auto-Close Alerts:** หน้าต่างแจ้งเตือนนับถอยหลัง 10 วินาที และปิดตัวเองอัตโนมัติ ไม่กวนใจตอนทำงาน

---

## 📂 โครงสร้างไฟล์ (File Structure)

ระบบประกอบด้วย 17 โมดูลหลัก:
1.  **00_App.gs**: จุดเริ่มต้นระบบ, เมนูหลัก และการประมวลผลประจำวัน
2.  **01_Config.gs**: ตั้งค่าชื่อชีตและเกณฑ์คะแนน (Thresholds)
3.  **02_Schema.gs**: คำนิยามโครงสร้างคอลัมน์ของทุกตาราง
4.  **03_SetupSheets.gs**: ระบบติดตั้งและสร้างชีตอัตโนมัติ
5.  **04_SourceRepository.gs**: จัดการการอ่านข้อมูลจากชีตดิบ (SCG)
6.  **05_NormalizeService.gs**: เอนจินล้างข้อมูล (NFC, Regex, Auto-Fill)
7.  **06_PersonService.gs**: จัดการข้อมูล Master บุคคล
8.  **07_PlaceService.gs**: จัดการข้อมูล Master สถานที่
9.  **08_GeoService.gs**: จัดการข้อมูล Master พิกัดพิกัด (Lat/Long)
10. **09_DestinationService.gs**: จัดการข้อมูลจุดหมายปลายทาง (Unique Points)
11. **10_MatchEngine.gs**: สมองกลตัดสินใจ (Scoring & Conflict Detection)
12. **11_TransactionService.gs**: บันทึกข้อมูลลงตาราง Fact
13. **12_ReviewService.gs**: ระบบจัดการคิวรอรีวิว (Q_REVIEW) และระบบ Dropdown
14. **14_Utils.gs**: เครื่องมือเสริม (UUID, Dice, Haversine, Timed Alerts)
15. **15_GoogleMapsAPI.gs**: ฟังก์ชัน Google Maps และระบบ Cache 2 ชั้น
16. **16_GeoDictionaryBuilder.gs**: ระบบสร้างพจนานุกรมจากชีต `SYS_TH_GEO`

---

## 🚀 วิธีการใช้งาน (How to Use)

### 1. การติดตั้งครั้งแรก
1. เปิด Google Sheets ของคุณ
2. ไปที่เมนู **📦 LMDS System** > **1. ติดตั้งระบบครั้งแรก (Setup)**
3. ระบบจะสร้างชีตที่จำเป็นทั้งหมดและตั้งค่าเริ่มต้นให้

### 2. การประมวลผลประจำวัน
1. นำข้อมูลดิบมาวางในชีตต้นทาง (SCG...)
2. ไปที่เมนู **📦 LMDS System** > **2. ประมวลผลข้อมูลประจำวัน**
3. ระบบจะรันไปเรื่อยๆ หากข้อมูลมีปริมาณมากและครบ 5 นาที ระบบจะโชว์ Popup นับถอยหลังแจ้งให้คุณกดรันต่อเองเพื่อความปลอดภัย

### 3. การตัดสินใจในคิวรีวิว (Q_REVIEW)
1. เมื่อระบบไม่มั่นใจ ข้อมูลจะเด้งมาที่ชีต `Q_REVIEW`
2. เลือกคำสั่งในคอลัมน์ **Decision** (Dropdown):
    - `CREATE_NEW`: สร้างข้อมูลใหม่
    - `MERGE_TO_CANDIDATE`: รวมเข้ากับข้อมูลเดิมที่มีอยู่
    - `IGNORE`: ข้ามรายการนี้
3. ระบบจะจัดการอัปเดต Master Data ให้ทันทีหลังเลือก

---

## 🛠 การบำรุงรักษา (Maintenance)

- **MAPS_CACHE**: หากต้องการล้างแคชพิกัดทั้งหมด สามารถลบข้อมูลในชีตนี้ได้เลย
- **SYS_TH_GEO**: สามารถอัปเดตข้อมูลตำบล/รหัสไปรษณีย์ใหม่ๆ ได้ตลอดเวลา แล้วกดเมนู **3. อัปเดตพจนานุกรมสถานที่** เพื่อให้ระบบจดจำค่าใหม่
- **SYS_LOG**: ตรวจสอบย้อนหลังได้หากเกิด Error ในการประมวลผล

---

## ⚖️ License
พัฒนาเพื่อใช้ในงานบริหารจัดการข้อมูลขนส่ง SCG Logistics โดยคุณ **Kamonwantanakun**
