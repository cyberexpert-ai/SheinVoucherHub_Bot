/**
 * config/sheets.js
 * Google Sheets connection + helper methods
 */

const { google } = require('googleapis');
const {
  GOOGLE_SHEET_ID,
  GOOGLE_CREDENTIALS
} = require('./env');

// Parse service account JSON (stored as string in ENV)
let credentials;
try {
  credentials = JSON.parse(GOOGLE_CREDENTIALS);
} catch (e) {
  console.error("❌ GOOGLE_CREDENTIALS is not valid JSON");
  process.exit(1);
}

// Auth
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive'
  ]
});

const sheets = google.sheets({ version: 'v4', auth });

// ---------- Helpers ----------

// Read rows
async function getRows(sheetName) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: GOOGLE_SHEET_ID,
    range: `${sheetName}!A:ZZ`
  });

  const rows = res.data.values || [];
  if (rows.length === 0) return [];

  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] || '';
    });
    return obj;
  });
}

// Append row
async function appendRow(sheetName, row) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: GOOGLE_SHEET_ID,
    range: `${sheetName}!A:A`,
    valueInputOption: 'USER_ENTERED',
    resource: { values: [row] }
  });
}

// Update row by column match
async function updateRow(sheetName, searchColumn, searchValue, newData) {
  const rows = await getRows(sheetName);
  const index = rows.findIndex(r => r[searchColumn] == searchValue);
  if (index === -1) return false;

  const headers = Object.keys(rows[index]);
  const updatedRow = headers.map(h =>
    newData[h] !== undefined ? newData[h] : rows[index][h]
  );

  await sheets.spreadsheets.values.update({
    spreadsheetId: GOOGLE_SHEET_ID,
    range: `${sheetName}!A${index + 2}`,
    valueInputOption: 'USER_ENTERED',
    resource: { values: [updatedRow] }
  });

  return true;
}

module.exports = {
  sheets,
  getRows,
  appendRow,
  updateRow
};
