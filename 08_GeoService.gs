/**
 * 08_GeoService.gs
 * จัดการเรื่องพิกัดทางภูมิศาสตร์
 */

function resolveGeo(sourceObj) {
  const lat = sourceObj.latRaw;
  const lng = sourceObj.longRaw;
  
  if (!lat || !lng) return { id: null, isNew: false, score: 0, candidates: [] };
  
  const normLat = normalizeLatLong(lat, lng).lat;
  const normLng = normalizeLatLong(lat, lng).lng;
  const keys = buildGeoKeys(lat, lng);
  
  const candidates = findGeoCandidates(normLat, normLng, keys);
  
  if (candidates.length === 0) {
    return { id: null, isNew: true, score: 0, lat: normLat, lng: normLng, keys: keys, candidates: [] };
  }
  
  // วัดระยะทางจริงเพื่อหา Geo ที่ใกล้ที่สุด
  let bestCandidate = null;
  let minDistance = 999999;
  
  for (let i = 0; i < candidates.length; i++) {
    const dist = haversineDistanceMeters(normLat, normLng, candidates[i].lat, candidates[i].lng);
    if (dist < minDistance) {
      minDistance = dist;
      bestCandidate = candidates[i];
    }
  }
  
  const radiusThreshold = getThresholds().geoRadiusMeter;
  
  // ถ้าระยะห่างน้อยกว่ารัศมีที่กำหนด (เช่น 50 เมตร) ถือว่าเป็นจุดเดียวกัน
  if (minDistance <= radiusThreshold) {
    // ให้คะแนนเต็มถ้าอยู่ในรัศมี
    return { id: bestCandidate.geoId, isNew: false, score: 100, lat: normLat, lng: normLng, keys: keys, distance: minDistance, candidates: candidates };
  } else {
    // ถ้าเกินรัศมี ถือว่าเป็นจุดใหม่ (New Geo)
    return { id: null, isNew: true, score: 0, lat: normLat, lng: normLng, keys: keys, distance: minDistance, candidates: candidates };
  }
}

function findGeoCandidates(lat, lng, keys) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_GEO_POINT');
  const data = sheet.getDataRange().getValues();
  
  const candidates = [];
  
  // ค้นหาโดยใช้ GeoKey ระดับ 3 (รัศมี ~110m) เพื่อความรวดเร็ว 
  // ไม่ต้องวนลูปทุกแถวเพื่อคำนวณระยะทาง
  const searchKey = keys.key3;
  
  for (let i = 1; i < data.length; i++) {
    // สมมติว่า key3 อยู่คอลัมน์ index 7 (geo_key_4 ใน schema) หรือเราเทียบ lat/lng ตรงๆ ก็ได้
    // สำหรับ GAS ถ้าข้อมูลไม่เกินหมื่นแถว วนเช็ค ระยะทางง่ายสุด
    
    const cLat = parseFloat(data[i][3]); // lat_norm
    const cLng = parseFloat(data[i][4]); // long_norm
    
    // ตรวจจับแค่คร่าวๆ ก่อนว่าอยู่ใน 0.05 องศาไหม เพื่อลดภาระ
    if (Math.abs(cLat - lat) < 0.01 && Math.abs(cLng - lng) < 0.01) {
      candidates.push({
        geoId: data[i][0],
        lat: cLat,
        lng: cLng
      });
    }
  }
  
  return candidates;
}

function createGeoPoint(lat, lng, keys, addressHint) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('M_GEO_POINT');
  const geoId = 'GEO-' + uuid().split('-')[0].toUpperCase();
  
  sheet.appendRow([
    geoId,
    lat, // raw
    lng, // raw
    keys.lat, // norm
    keys.lng, // norm
    keys.key4,
    keys.key3,
    keys.key2,
    safeString(addressHint),
    new Date(),
    new Date(),
    1,
    ''
  ]);
  
  return geoId;
}
