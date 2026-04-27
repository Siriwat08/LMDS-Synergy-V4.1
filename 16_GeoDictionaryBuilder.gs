/**
 * 16_GeoDictionaryBuilder.gs
 * ตัวประมวลผลพจนานุกรมสถานที่ (SYS_TH_GEO Index Builder)
 * ทำหน้าที่อ่านคอลัมน์หมายเหตุแล้วแปลงเป็นข้อมูลโครงสร้างเพื่อใช้ในการตัดสินใจ
 */

function buildGeoIndex() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('SYS_TH_GEO');
  
  if (!sheet) {
    SpreadsheetApp.getUi().alert("ไม่พบชีต SYS_TH_GEO กรุณาสร้างชีตก่อนครับ");
    return;
  }
  
  // อัปเดต Header F-N
  const headers = [
    'postcode_text',      // F
    'subdistrict_norm',   // G
    'district_norm',      // H
    'province_norm',      // I
    'note_type',          // J
    'note_keywords',      // K
    'postcode_override',  // L
    'geo_key',            // M
    'active_flag'         // N
  ];
  sheet.getRange(1, 6, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 6, 1, headers.length).setFontWeight("bold").setBackground("#d9ead3");

  const data = sheet.getDataRange().getValues();
  const lastRow = data.length;
  if (lastRow <= 1) return;
  
  const outputData = [];
  
  for (let i = 1; i < lastRow; i++) {
    const row = data[i];
    const postcode = String(row[0]).trim();
    const rawSub = String(row[1]).trim();
    const rawDist = String(row[2]).trim();
    const rawProv = String(row[3]).trim();
    const remark = String(row[4]).trim();
    
    // Normalize Data (F, G, H, I)
    const subNorm = rawSub.replace(/^(แขวง|ตำบล)\s*/, '');
    const distNorm = rawDist.replace(/^(เขต|อำเภอ)\s*/, '');
    const provNorm = rawProv.replace(/^จังหวัด\s*/, '');
    
    // Parse Remark Logic (J, K, L)
    const parsed = parseRemarkLogic(remark);
    
    // Geo Key (M)
    const geoKey = subNorm + '_' + distNorm + '_' + provNorm;
    
    // Active Flag (N)
    const active = 'Y';
    
    outputData.push([
      postcode,
      subNorm,
      distNorm,
      provNorm,
      parsed.noteType,
      parsed.keywords,
      parsed.override,
      geoKey,
      active
    ]);
  }
  
  // นำข้อมูลกลับไปเขียนลงชีตในคอลัมน์ F ถึง N
  sheet.getRange(2, 6, outputData.length, headers.length).setValues(outputData);
  
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ อัปเดตพจนานุกรมสถานที่ (SYS_TH_GEO) สำเร็จ!', 'Success', 5);
}

function parseRemarkLogic(remark) {
  if (!remark) return { noteType: 'NONE', keywords: '', override: '' };
  
  let text = remark.trim();
  
  // 1. ตรวจสอบ "เฉพาะ อาคาร..."
  if (text.match(/เฉพาะ\s*อาคาร/i)) {
    let kw = text.replace(/เฉพาะ/g, '').replace(/เท่านั้น/g, '').trim();
    return { noteType: 'ONLY_BUILDING', keywords: kw, override: '' };
  }
  
  // 2. ตรวจสอบ "เฉพาะ หมู่..."
  if (text.match(/เฉพาะ\s*หมู่/i)) {
    let kw = text.replace(/เฉพาะ/g, '').replace(/เท่านั้น/g, '').trim();
    return { noteType: 'ONLY_MOO', keywords: kw, override: '' };
  }
  
  // 3. ตรวจสอบ "ยกเว้น... ใช้รหัส..."
  // เช่น ทั้งแขวง(ยกเว้น ถนนสุขุมวิท ซอย 48/1... ใช้รหัส 10260)
  const exceptMatch = text.match(/ยกเว้น(.*?)\s*ใช้รหัส\s*(\d{5})/i);
  if (exceptMatch) {
    let kw = exceptMatch[1].trim();
    let override = exceptMatch[2].trim();
    
    // ตรวจสอบความซับซ้อนของเลขที่บ้าน
    if (kw.match(/บ้านเลขที่/i) || kw.match(/เลขคี่/i) || kw.match(/เลขคู่/i)) {
      return { noteType: 'COMPLEX_HOUSE_NO', keywords: kw, override: override };
    }
    
    return { noteType: 'EXCEPT_RULE', keywords: kw, override: override };
  }
  
  // 4. เงื่อนไขอื่นๆ
  return { noteType: 'OTHER_WARNING', keywords: text, override: '' };
}
