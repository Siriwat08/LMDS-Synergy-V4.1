/**
 * 14_Utils.gs
 * ฟังก์ชันอำนวยความสะดวกต่างๆ
 */

/**
 * สร้าง UUID
 */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function safeTrim(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function safeString(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

function safeNumber(value) {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

function safeDate(value) {
  if (value instanceof Date) return value;
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function formatTime(value) {
  if (!value) return '';
  if (value instanceof Date) {
    try {
      return Utilities.formatDate(value, Session.getScriptTimeZone(), 'HH:mm:ss');
    } catch (e) {
      return String(value);
    }
  }
  return String(value).trim();
}

/**
 * บันทึก Log ลงตาราง SYS_LOG
 */
function writeLog(level, moduleName, functionName, refId, message, payload) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('SYS_LOG');
    if (!sheet) return;
    
    let payloadStr = '';
    if (typeof payload === 'object') {
      try { payloadStr = JSON.stringify(payload); } catch(e) { payloadStr = String(payload); }
    } else {
      payloadStr = String(payload);
    }
    
    sheet.appendRow([
      uuid(),
      'N/A', // run_id
      new Date(),
      level,
      moduleName,
      functionName,
      refId,
      message,
      payloadStr
    ]);
  } catch (e) {
    console.error("Failed to write log", e);
  }
}

/**
 * คำนวณระยะทางแบบ Haversine
 */
function haversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // รัศมีโลกในเมตร
  const phi1 = lat1 * Math.PI/180; // แปลงเป็นเรเดียน
  const phi2 = lat2 * Math.PI/180;
  const deltaPhi = (lat2-lat1) * Math.PI/180;
  const deltaLambda = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; 
}

/**
 * คำนวณความเหมือนของ String ด้วย Dice Coefficient (0.0 - 1.0)
 */
function diceCoefficient(s1, s2) {
  if (!s1 || !s2) return 0;
  s1 = s1.replace(/\s+/g, '');
  s2 = s2.replace(/\s+/g, '');
  if (s1 === s2) return 1;
  if (s1.length < 2 || s2.length < 2) return 0;

  const bigrams1 = new Map();
  for (let i = 0; i < s1.length - 1; i++) {
    const bigram = s1.substring(i, i + 2);
    bigrams1.set(bigram, (bigrams1.get(bigram) || 0) + 1);
  }

  let intersect = 0;
  for (let i = 0; i < s2.length - 1; i++) {
    const bigram = s2.substring(i, i + 2);
    const count = bigrams1.get(bigram) || 0;
    if (count > 0) {
      bigrams1.set(bigram, count - 1);
      intersect++;
    }
  }

  return (2 * intersect) / (s1.length + s2.length - 2);
}

/**
 * คำนวณสัดส่วนความยาวระหว่าง 2 ข้อความ (0.0 - 1.0)
 */
function lengthRatio(s1, s2) {
  if (!s1 || !s2) return 0;
  const l1 = s1.length;
  const l2 = s2.length;
  if (l1 === 0 || l2 === 0) return 0;
  return Math.min(l1, l2) / Math.max(l1, l2);
}

/**
 * ระบบ Checkpoint (Progress Tracking)
 */
function saveCheckpoint(rowNumber) {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('LAST_PROCESSED_ROW', rowNumber.toString());
  props.setProperty('LAST_PROCESS_TIME', new Date().toISOString());
}

function getCheckpoint() {
  const props = PropertiesService.getScriptProperties();
  const row = props.getProperty('LAST_PROCESSED_ROW');
  return row ? parseInt(row) : null;
}

function clearCheckpoint() {
  const props = PropertiesService.getScriptProperties();
  props.deleteProperty('LAST_PROCESSED_ROW');
  props.deleteProperty('LAST_PROCESS_TIME');
}


/**
 * ตรวจสอบเวลาเพื่อป้องกัน Timeout (หน่วยเป็นมิลลิวินาที)
 */
function isTimeNearLimit(startTime, limitMs = 300000) { // Default 5 นาที
  return (Date.now() - startTime) > limitMs;
}

/**
 * อัปเดตสถานะการรันลงหน้าชีต SYS_CONFIG
 */
function updateRunStatus(status, message) {
  try {
    setConfig('LAST_RUN_STATUS', status);
    setConfig('LAST_RUN_MESSAGE', message);
    setConfig('LAST_RUN_TIME', new Date().toLocaleString('th-TH'));
    
    // Log ลง Console ของ Apps Script ด้วย
    console.log(`[STATUS] ${status}: ${message}`);
  } catch (e) {
    console.error("Failed to update run status", e);
  }
}

/**
 * แสดง Popup แจ้งเตือนที่จะปิดตัวเองอัตโนมัติพร้อมนับถอยหลัง
 */
function showAutoCloseAlert(message, seconds = 10) {
  const htmlContent = `
    <html>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Kanit', sans-serif; text-align: center; padding: 20px; background: #f8f9fa; overflow: hidden; }
          .message { font-size: 16px; margin-bottom: 15px; color: #333; line-height: 1.5; }
          .timer { font-size: 28px; font-weight: bold; color: #d93025; margin: 10px 0; }
          .btn { background: #1a73e8; color: white; border: none; padding: 10px 25px; border-radius: 4px; cursor: pointer; font-family: 'Kanit'; }
        </style>
      </head>
      <body>
        <div class="message">${message}</div>
        <div class="timer" id="seconds">${seconds}</div>
        <div class="message" style="font-size: 13px;">วินาทีหน้าต่างนี้จะปิดเอง...</div>
        <button class="btn" onclick="google.script.host.close()">ตกลง (ปิดเลย)</button>
        <script>
          let seconds = ${seconds};
          const interval = setInterval(() => {
            seconds--;
            document.getElementById('seconds').innerText = seconds;
            if (seconds <= 0) {
              clearInterval(interval);
              google.script.host.close();
            }
          }, 1000);
        </script>
      </body>
    </html>
  `;
  const html = HtmlService.createHtmlOutput(htmlContent)
    .setWidth(350)
    .setHeight(230);
  SpreadsheetApp.getUi().showModelessDialog(html, '📢 สถานะระบบ LMDS');
}
