function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Missing request body");
    }

    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const timestamp = new Date();
    const lock = LockService.getScriptLock();

    const row = [
      cleanValue(data.name),
      cleanValue(data.phone),
      cleanValue(data.email),
      cleanValue(data.city),
      cleanValue(data.budget),
      cleanValue(data.guests),
      cleanValue(data.status || "new"),
      cleanValue(data.message),
      cleanValue(data.cta_location),
      timestamp,
    ];

    lock.waitLock(10000);

    try {
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({
      success: true,
      timestamp: timestamp.toISOString(),
    });
  } catch (error) {
    return jsonResponse({
      success: false,
      error: error.message || "Unknown error",
    });
  }
}

function doGet() {
  return jsonResponse({
    success: true,
    status: "ready",
  });
}

function cleanValue(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
