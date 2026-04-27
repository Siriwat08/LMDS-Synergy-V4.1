/**
 * 05_NormalizeService.gs
 * เอนจินสำหรับการทำความสะอาดและสร้างมาตรฐานข้อมูล (Data Cleaning)
 */

/**
 * ล้างช่องว่างซ้ำซ้อน และเปลี่ยนตัวอักษรเป็นพิมพ์เล็ก (สำหรับเทียบ)
 */
function normalizeThaiText(text) {
  if (!text) return '';
  let n = safeTrim(text);
  // แทนที่ช่องว่างหลายตัวเป็นตัวเดียว
  n = n.replace(/\s+/g, ' ');
  return n.normalize('NFC');
}

/**
 * ล้างคำนำหน้าชื่อ และทำให้อยู่ในรูปมาตรฐาน
 * เพื่อหาแก่นของชื่อจริงๆ
 */
function normalizePersonName(name) {
  if (!name) return '';
  let n = normalizeThaiText(name);
  
  // 1. สกัดและลบเบอร์โทรศัพท์ออกไปก่อน (ถ้ามี)
  const phones = extractPhoneNumbers(n);
  if (phones) {
    const phoneList = phones.split(', ');
    phoneList.forEach(p => {
      const pPattern = new RegExp(p.split('').join('[-.\\s]?'), 'g');
      n = n.replace(pPattern, '');
    });
  }

  // 2. Array ของ Prefix ที่ต้องการตัดออก
  const prefixes = [
    '^นาย\\s*', '^นางสาว\\s*', '^น\\.ส\\.\\s*', '^นาง\\s*', 
    '^คุณ\\s*', '^พี่\\s*', '^ช่าง\\s*', '^บจก\\.\\s*', 
    '^บริษัท\\s*', '^หจก\\.\\s*', '^ห้างหุ้นส่วนจำกัด\\s*',
    '^ดร\\.?\\s*', '^นพ\\.?\\s*', '^พญ\\.?\\s*', '^ผศ\\.?\\s*', '^รศ\\.?\\s*', '^ศ\\.?\\s*', // คำนำหน้าวิชาชีพ
    'โทร\\.?\\s*$', 'เบอร์\\s*$', 'ติดต่อ\\s*$', // ลบคำว่า โทร. ที่ติดอยู่ท้ายชื่อ
    'โทร\\.?\\s*\\d+', 'เบอร์\\s*\\d+', 'ติดต่อ\\s*\\d+' 
  ];
  
  // ลบ Prefix
  for (let i = 0; i < prefixes.length; i++) {
    const regex = new RegExp(prefixes[i], 'gi');
    n = n.replace(regex, '');
  }
  
  return safeTrim(n);
}

/**
 * มาตรฐานชื่อสถานที่
 */
function normalizePlaceName(name) {
  if (!name) return '';
  let n = normalizeThaiText(name);
  
  // ลบคำที่มักจะซ้ำซ้อน
  n = n.replace(/^ร้าน\s*/i, '');
  n = n.replace(/สาขา\s*\d+/i, ''); // ตัดคำว่าสาขาออกไปก่อนเพื่อหาตัวร้านหลัก
  
  return safeTrim(n);
}

/**
 * โหลดข้อมูลพจนานุกรมตำบล/อำเภอ/จังหวัด
 */
let TH_GEO_CACHE = null;

function loadThGeo() {
  if (TH_GEO_CACHE) return TH_GEO_CACHE;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('SYS_TH_GEO');
  if (!sheet) return null;
  
  const data = sheet.getDataRange().getValues();
  TH_GEO_CACHE = {
    subdistricts: {}
  };
  
  for (let i = 1; i < data.length; i++) {
    const zipcode = data[i][0];
    // อ่านจากคอลัมน์ F ถึง L ที่ถูก Parse แล้ว (index 5-11)
    const subdistrictNorm = data[i][6] ? String(data[i][6]) : '';
    const districtNorm = data[i][7] ? String(data[i][7]) : '';
    const provinceNorm = data[i][8] ? String(data[i][8]) : '';
    const noteType = data[i][9] ? String(data[i][9]) : 'NONE';
    const noteKeywords = data[i][10] ? String(data[i][10]) : '';
    const postcodeOverride = data[i][11] ? String(data[i][11]) : '';
    const rawRemark = data[i][4] ? String(data[i][4]) : '';
    
    if (subdistrictNorm) {
      TH_GEO_CACHE.subdistricts[subdistrictNorm] = { 
        district: districtNorm, 
        province: provinceNorm, 
        zipcode: zipcode, 
        remark: rawRemark,
        noteType: noteType,
        noteKeywords: noteKeywords,
        postcodeOverride: postcodeOverride
      };
    }
  }
  
  return TH_GEO_CACHE;
}

/**
 * มาตรฐานที่อยู่ และเติมข้อมูลอัตโนมัติ
 */
function normalizeAddress(address) {
  if (!address) return '';
  let n = normalizeThaiText(address);
  // อาจจะเพิ่ม logic ลบคำว่า ต., อ., จ. ให้เป็นแพทเทิร์นเดียวกัน
  n = n.replace(/ตำบล/g, 'ต.');
  n = n.replace(/อำเภอ/g, 'อ.');
  n = n.replace(/จังหวัด/g, 'จ.');
  
  // -- Smart Auto-Fill จาก SYS_TH_GEO --
  const geoDb = loadThGeo();
  if (geoDb && geoDb.subdistricts) {
    // หาคำหลัง ต. หรือ แขวง
    const subMatch = n.match(/(?:ต\.|แขวง)\s*([ก-๙]+)/);
    if (subMatch) {
      const subName = subMatch[1];
      const geoInfo = geoDb.subdistricts[subName];
      
      if (geoInfo) {
        // เติมอำเภอถ้ายังไม่มี
        if (n.indexOf(geoInfo.district) === -1) {
          n += ' อ.' + geoInfo.district;
        }
        // เติมจังหวัดถ้ายังไม่มี
        if (n.indexOf(geoInfo.province) === -1) {
          n += ' จ.' + geoInfo.province;
        }
      }
    }
  }
  
  return safeTrim(n);
}

/**
 * ดึงหมายเหตุแจ้งเตือนพิกัดซับซ้อน (ถ้ามี)
 */
function analyzeGeoWarning(address) {
  if (!address) return '';
  const geoDb = loadThGeo();
  if (!geoDb || !geoDb.subdistricts) return '';
  
  let n = normalizeThaiText(address);
  n = n.replace(/ตำบล/g, 'ต.');
  
  const subMatch = n.match(/(?:ต\.|แขวง)\s*([ก-๙]+)/);
  if (subMatch) {
    const subName = subMatch[1];
    const geoInfo = geoDb.subdistricts[subName];
    if (geoInfo && geoInfo.noteType !== 'NONE') {
      
      // ถ้าเป็น OTHER_WARNING โชว์ข้อความดิบเลย
      if (geoInfo.noteType === 'OTHER_WARNING') {
        return '⚠️ พื้นที่พิเศษ: ' + geoInfo.remark;
      }
      
      // ถ้าเป็น ONLY_BUILDING เช็คว่ามีชื่ออาคารไหม
      if (geoInfo.noteType === 'ONLY_BUILDING' && geoInfo.noteKeywords) {
        if (n.indexOf(geoInfo.noteKeywords) > -1) {
          return '🏢 ระวัง! ต้องใช้รหัสไปรษณีย์เฉพาะสำหรับ: ' + geoInfo.noteKeywords;
        }
      }
      
      // ถ้าเป็น ONLY_MOO
      if (geoInfo.noteType === 'ONLY_MOO' && geoInfo.noteKeywords) {
        return '🏘️ ระวังหมู่: ' + geoInfo.noteKeywords;
      }
      
      // ถ้าเป็น EXCEPT_RULE หรือ COMPLEX_HOUSE_NO
      if (geoInfo.noteType === 'EXCEPT_RULE' || geoInfo.noteType === 'COMPLEX_HOUSE_NO') {
        return `🚨 ระวังเงื่อนไขพิเศษ: ${geoInfo.remark}`;
      }
    }
  }
  return '';
}

/**
 * ฟังก์ชันสกัดเบอร์โทรศัพท์จากข้อความ (รองรับ 08x-xxxxxxx, 02xxxxxxx, 090 123 4567)
 */
function extractPhoneNumbers(text) {
  if (!text) return '';
  // Regex ค้นหาตัวเลข 9-10 หลักที่อาจมีขีดหรือช่องว่าง
  const phoneRegex = /(?:0[2-9]\d{1,2})[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
  const matches = text.match(phoneRegex);
  if (matches) {
    // ทำความสะอาดเบอร์ (เหลือแต่ตัวเลข) และตัดตัวที่ซ้ำ
    const cleanPhones = matches.map(p => p.replace(/[^\d]/g, ''));
    return [...new Set(cleanPhones)].join(', ');
  }
  return '';
}

/**
 * ฟังก์ชัน "รวมร่างที่อยู่" (Smart Merge)
 * นำรายละเอียดจากที่อยู่ดิบ (Raw) มาผสมกับโครงสร้างที่อยู่มาตรฐาน (Geo)
 */
function smartMergeAddress(rawAddr, geoAddr) {
  if (!rawAddr) return geoAddr || '';
  if (!geoAddr) return cleanAddressRedundancy(rawAddr);

  // 1. ทำความสะอาดเบื้องต้น
  let cleanRaw = cleanAddressRedundancy(rawAddr);
  
  // ลบ Plus Code (เช่น QC6P+GFG) และคำว่า ประเทศไทย ออกจาก Geo
  let cleanGeo = geoAddr.replace(/[A-Z0-9]{4}\+[A-Z0-9]{2,3}/g, '').replace(/\s+ประเทศไทย$/, '').trim();
  
  // ลบเบอร์โทรศัพท์ที่ติดมาในที่อยู่ (ถ้ามี)
  const phones = extractPhoneNumbers(cleanRaw);
  if (phones) {
    const phoneList = phones.split(', ');
    phoneList.forEach(p => {
      // พยายามหาเบอร์ในที่อยู่แล้วตัดออก (รวมถึงกรณีมีขีดหรือช่องว่าง)
      const pPattern = new RegExp(p.split('').join('[-.\\s]?'), 'g');
      cleanRaw = cleanRaw.replace(pPattern, '');
    });
  }

  // 2. หาจุดเริ่มของข้อมูลภูมิศาสตร์ (แขวง, ต., เขต, อ., จ.) ใน Geo
  const geoTriggers = ['แขวง', 'ตำบล', ' ต.', 'เขต', 'อำเภอ', ' อ.', 'จังหวัด', ' จ.'];
  let geoStartIdx = -1;
  let triggerFound = '';

  for (let trigger of geoTriggers) {
    let idx = cleanGeo.indexOf(trigger);
    if (idx !== -1 && (geoStartIdx === -1 || idx < geoStartIdx)) {
      geoStartIdx = idx;
      triggerFound = trigger;
    }
  }

  if (geoStartIdx === -1) return cleanRaw; 

  const adminPartGeo = cleanGeo.substring(geoStartIdx).trim();

  // 3. หาจุดเริ่มของโครงสร้างภูมิศาสตร์ใน Raw
  let rawStartIdx = cleanRaw.indexOf(triggerFound);
  if (rawStartIdx === -1) {
    for (let trigger of geoTriggers) {
      let idx = cleanRaw.indexOf(trigger);
      if (idx !== -1 && (rawStartIdx === -1 || idx < rawStartIdx)) {
        rawStartIdx = idx;
      }
    }
  }

  // 4. รวมร่าง
  if (rawStartIdx !== -1) {
    const detailPartRaw = cleanRaw.substring(0, rawStartIdx).trim();
    return (detailPartRaw + ' ' + adminPartGeo).replace(/\s+/g, ' ').trim();
  }

  return cleanRaw.length > cleanGeo.length ? cleanRaw : cleanGeo;
}

/**
 * ลบคำสะกดซ้ำซ้อนที่พบบ่อย (เช่น เขตเขต, จ.จ.)
 */
function cleanAddressRedundancy(addr) {
  if (!addr) return '';
  let s = addr.toString();
  
  // 1. ลบคำเบิ้ลพื้นฐาน (ใช้ Regex แบบกลุ่มคำเพื่อความแม่นยำ)
  const baseTriggers = ['เขต', 'อำเภอ', 'ตำบล', 'แขวง', 'จังหวัด'];
  baseTriggers.forEach(t => {
    const reg = new RegExp(t + '\\s*' + t, 'g');
    s = s.replace(reg, t);
  });

  // ลบกรณีคำย่อติดกับคำเต็ม เช่น ต.ตำบล, อ.อำเภอ
  s = s.replace(/ต\.\s*ตำบล/g, 'ตำบล');
  s = s.replace(/ตำบล\s*ต\./g, 'ตำบล');
  s = s.replace(/อ\.\s*อำเภอ/g, 'อำเภอ');
  s = s.replace(/อำเภอ\s*อ\./g, 'อำเภอ');
  s = s.replace(/จ\.\s*จังหวัด/g, 'จังหวัด');
  s = s.replace(/จังหวัด\s*จ\./g, 'จังหวัด');

  s = s.replace(/จ\.\s*จ\./g, 'จ.');
  s = s.replace(/อ\.\s*อ\./g, 'อ.');
  s = s.replace(/ต\.\s*ต\./g, 'ต.');
  
  // 2. ลบกรณีสะกดผิดยอดฮิต (เช่น เขตจตุจ เขตจตุจักร) - ตรวจสอบว่า p1 ไม่เป็นค่าว่าง
  s = s.replace(/เขต([ก-๙]{2,4})\s+เขต([ก-๙]+)/g, (match, p1, p2) => {
     if (p2.indexOf(p1) === 0) return 'เขต' + p2;
     return match;
  });

  // 3. ลบชื่อจังหวัดที่สะกดเบิ้ล (รองรับ กรุงเทพฯ กรุงเทพมหานคร)
  const provinces = ['กรุงเทพมหานคร', 'สมุทรปราการ', 'ฉะเชิงเทรา', 'ชลบุรี', 'ปทุมธานี', 'นนทบุรี'];
  provinces.forEach(p => {
    const pShort = p.substring(0, 5);
    const reg = new RegExp(pShort + '[ก-๙]*\\s+' + p, 'g');
    s = s.replace(reg, p);
  });

  // 4. ลบการซ้ำซ้อนระดับ ตำบล/อำเภอ (กรณี ต.หนองขาม ตำบล หนองขาม)
  const adminLevels = ['ตำบล', 'แขวง', 'อำเภอ', 'เขต'];
  adminLevels.forEach(level => {
    // มองหารูปแบบ [ย่อ][ชื่อ] [เต็ม][ชื่อ] หรือสลับกัน
    const short = level === 'ตำบล' ? 'ต\\.' : (level === 'อำเภอ' ? 'อ\\.' : null);
    if (short) {
      const reg = new RegExp(short + '\\s*([ก-๙]+)\\s+' + level + '\\s*\\1', 'g');
      s = s.replace(reg, level + '$1');
      const regRev = new RegExp(level + '\\s*([ก-๙]+)\\s+' + short + '\\s*\\1', 'g');
      s = s.replace(regRev, level + '$1');
    }
    // กรณี [เต็ม][ชื่อ] [เต็ม][ชื่อ]
    const regFull = new RegExp(level + '\\s*([ก-๙]+)\\s+' + level + '\\s*\\1', 'g');
    s = s.replace(regFull, level + '$1');
  });

  return s.replace(/\s+/g, ' ').trim();
}

/**
 * ฟังก์ชันตรวจสอบ Postcode Override ว่าที่อยู่นี้ควรเปลี่ยนรหัสไปรษณีย์ไหม
 */
function validatePostcodeOverride(address) {
  if (!address) return null;
  const geoDb = loadThGeo();
  if (!geoDb || !geoDb.subdistricts) return null;
  
  let n = normalizeThaiText(address);
  n = n.replace(/ตำบล/g, 'ต.');
  
  const subMatch = n.match(/(?:ต\.|แขวง)\s*([ก-๙]+)/);
  if (subMatch) {
    const subName = subMatch[1];
    const geoInfo = geoDb.subdistricts[subName];
    if (geoInfo && geoInfo.postcodeOverride) {
      if (geoInfo.noteType === 'EXCEPT_RULE' || geoInfo.noteType === 'COMPLEX_HOUSE_NO') {
        // ถ้าระบุคีย์เวิร์ด และในที่อยู่มีคีย์เวิร์ดนั้น
        if (geoInfo.noteKeywords && n.indexOf(geoInfo.noteKeywords) > -1) {
          return geoInfo.postcodeOverride;
        }
      }
    }
  }
  return null;
}

/**
 * มาตรฐาน Lat/Long ปัดเศษทศนิยม
 */
function normalizeLatLong(lat, lng) {
  return {
    lat: Number(safeNumber(lat).toFixed(5)),
    lng: Number(safeNumber(lng).toFixed(5))
  };
}

/**
 * สร้าง Geohash แบบง่ายโดยใช้ทศนิยม
 * 1 ทศนิยม = ~11 km
 * 2 ทศนิยม = ~1.1 km
 * 3 ทศนิยม = ~110 m
 * 4 ทศนิยม = ~11 m
 */
function buildGeoKeys(lat, lng) {
  const la = safeNumber(lat);
  const lo = safeNumber(lng);
  
  return {
    key4: la.toFixed(4) + '_' + lo.toFixed(4), // ละเอียดสุด (พิกัดเดียวกันหรือห่างแค่ 11ม.)
    key3: la.toFixed(3) + '_' + lo.toFixed(3), // ระดับซอย (110ม.)
    key2: la.toFixed(2) + '_' + lo.toFixed(2)  // ระดับหมู่บ้าน/ตำบล (1.1กม.)
  };
}

function buildFingerprint(dataObj) {
  const str = JSON.stringify(dataObj);
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString(16);
}
