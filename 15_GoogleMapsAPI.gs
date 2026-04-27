/**
 * 15_GoogleMapsAPI.gs
 * ฟังก์ชัน Google Maps แบบ Custom พร้อมระบบ Cache 2 ชั้น (RAM + Sheet)
 * เพื่อประหยัดโควต้าการใช้งาน และเพิ่มความเร็วในการโหลดข้อมูล
 */

/**
 * สร้าง MD5 Hash สำหรับใช้เป็น Key ของ Cache
 */
const md5 = (key = "") => {
  const code = key.toLowerCase().replace(/\s/g, "");
  return Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, code).reduce(
    (str, byte) => str + (byte + 256).toString(16).slice(-2),
    ""
  );
};

/**
 * ดึงข้อมูลจาก Cache (ลองหาใน RAM ก่อน ถ้าไม่มีหาใน Sheet)
 */
const getAdvancedCache = (key) => {
  const hashKey = md5(key);
  
  // 1. ตรวจสอบใน RAM Cache (CacheService) - เร็วที่สุด
  const ramCached = CacheService.getDocumentCache().get(hashKey);
  if (ramCached) return ramCached;
  
  // 2. ตรวจสอบใน Persistent Cache (Sheet MAPS_CACHE) - ถาวร
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(getSheetNames().MAPS_CACHE);
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      const found = data.find(r => r[0] === hashKey);
      if (found) {
        // ถ้าเจอใน Sheet ให้เก็บลง RAM ไว้ด้วยเพื่อครั้งหน้าจะได้เร็วขึ้น
        CacheService.getDocumentCache().put(hashKey, found[1], 21600);
        return found[1];
      }
    }
  } catch (e) {
    console.error("Error reading Persistent Cache:", e);
  }
  
  return null;
};

/**
 * บันทึกข้อมูลลง Cache ทั้ง 2 ชั้น
 */
const setAdvancedCache = (key, value, type) => {
  const hashKey = md5(key);
  
  // 1. บันทึกลง RAM Cache (6 ชั่วโมง)
  try {
    CacheService.getDocumentCache().put(hashKey, value, 21600);
  } catch (e) {}
  
  // 2. บันทึกลง Persistent Cache (Sheet) - เก็บถาวร
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(getSheetNames().MAPS_CACHE);
    if (sheet) {
      sheet.appendRow([hashKey, value, type, key, new Date()]);
    }
  } catch (e) {
    console.error("Error writing Persistent Cache:", e);
  }
};

/**
 * คำนวณระยะทางจาก Google Maps
 * =GOOGLEMAPS_DISTANCE("ชลบุรี", "ระยอง", "driving")
 */
function GOOGLEMAPS_DISTANCE(origin, destination, mode) {
  if (!origin || !destination) return "กรุณาใส่จุดเริ่มต้นและปลายทาง";
  const travelMode = mode || "driving";
  const key = ["distance", origin, destination, travelMode].join(",");
  
  const cached = getAdvancedCache(key);
  if (cached) return cached;
  
  try {
    const data = Maps.newDirectionFinder()
      .setOrigin(origin)
      .setDestination(destination)
      .setMode(travelMode)
      .getDirections();
      
    if (data && data.routes && data.routes.length > 0) {
      const distance = data.routes[0].legs[0].distance.text;
      setAdvancedCache(key, distance, "DISTANCE");
      return distance;
    }
    return "ไม่พบเส้นทาง";
  } catch(e) {
    return "Error/Quota Exceeded";
  }
}

/**
 * ดึงที่อยู่เต็มจากพิกัด (Reverse Geocoding)
 */
function GOOGLEMAPS_REVERSEGEOCODE(latitude, longitude) {
  if (!latitude || !longitude) return "กรุณาใส่พิกัด";
  const key = ["reversegeo", latitude, longitude].join(",");
  
  const cached = getAdvancedCache(key);
  if (cached) return cached;
  
  try {
    const data = Maps.newGeocoder().reverseGeocode(latitude, longitude);
    if (data && data.results && data.results.length > 0) {
      const address = data.results[0].formatted_address;
      setAdvancedCache(key, address, "REVERSE_GEO");
      return address;
    }
    return "ไม่พบที่อยู่";
  } catch(e) {
    return "Error/Quota Exceeded";
  }
}

/**
 * ดึงพิกัด Lat,Long จากที่อยู่
 */
function GOOGLEMAPS_LATLONG(address) {
  if (!address) return "กรุณาใส่ที่อยู่";
  const key = ["latlong", address].join(",");
  
  const cached = getAdvancedCache(key);
  if (cached) return cached;
  
  try {
    const data = Maps.newGeocoder().geocode(address);
    if (data && data.results && data.results.length > 0) {
      const loc = data.results[0].geometry.location;
      const coord = loc.lat + ", " + loc.lng;
      setAdvancedCache(key, coord, "LATLONG");
      return coord;
    }
    return "ไม่พบพิกัด";
  } catch(e) {
    return "Error/Quota Exceeded";
  }
}

/**
 * คำนวณเวลาการเดินทาง
 */
function GOOGLEMAPS_DURATION(origin, destination, mode) {
  if (!origin || !destination) return "กรุณาใส่ข้อมูลให้ครบ";
  const travelMode = mode || "driving";
  const key = ["duration", origin, destination, travelMode].join(",");
  
  const cached = getAdvancedCache(key);
  if (cached) return cached;
  
  try {
    const data = Maps.newDirectionFinder()
      .setOrigin(origin)
      .setDestination(destination)
      .setMode(travelMode)
      .getDirections();
      
    if (data && data.routes && data.routes.length > 0) {
      const time = data.routes[0].legs[0].duration.text;
      setAdvancedCache(key, time, "DURATION");
      return time;
    }
    return "ไม่พบเส้นทาง";
  } catch(e) {
    return "Error/Quota Exceeded";
  }
}
