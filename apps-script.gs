/**
 * Google Apps Script Web App backing the Voyage Holistique reservation form.
 * Paste this into the Apps Script project's Code.gs (Extensions > Apps Script
 * from the target Google Sheet), then Deploy > Manage deployments > Edit
 * (pencil icon) > select "New version" > Deploy, keeping "Execute as: Me"
 * and "Who has access: Anyone". The /exec URL must match GOOGLE_SCRIPT_URL
 * in script.js — redeploying a *new version* keeps the same URL; creating a
 * brand new deployment does not.
 *
 * Contract expected by script.js:
 *   success -> {"success": true,  "message": "saved"}
 *   failure -> {"success": false, "message": "<reason>"}
 * Always JSON, always returned immediately after the sheet write — no
 * email sending, no duplicate-scanning loops, no redirects before response.
 */

var SHEET_NAME = "Leads"; // change to match your tab name, or leave blank to use the first sheet

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    var sheet = SHEET_NAME
      ? SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
      : SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (!sheet) throw new Error("Sheet not found: " + SHEET_NAME);

    var lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      sheet.appendRow([
        payload.timestamp || new Date().toISOString(),
        payload.name || "",
        payload.phone || "",
        payload.email || "",
        payload.city || "",
        payload.guests || "",
        payload.message || "",
        payload.status || "new",
        payload.cta_location || "",
        payload.page_url || "",
        payload.utm_source || "",
        payload.utm_campaign || "",
        payload.utm_adset || "",
        payload.utm_ad || "",
        payload.fbclid || ""
      ]);
    } finally {
      lock.releaseLock();
    }

    return jsonResponse({ success: true, message: "saved" });
  } catch (err) {
    return jsonResponse({ success: false, message: String(err && err.message ? err.message : err) });
  }
}

function doGet(e) {
  return jsonResponse({ success: true, message: "ok" });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
