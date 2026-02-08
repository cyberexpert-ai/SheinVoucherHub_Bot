/**
 * utils/antiFraud.js
 * Anti-fraud helpers: UTR reuse, screenshot reuse
 */

const crypto = require('crypto');
const { getRows } = require('../config/sheets');

// Hash screenshot file_id
function hashScreenshot(fileId) {
  return crypto.createHash('sha256').update(fileId).digest('hex');
}

// Check if UTR already used
async function isUtrUsed(utr) {
  const orders = await getRows('Orders');
  return orders.some(o => o.UTR === utr);
}

// Check if screenshot already used
async function isScreenshotUsed(fileId) {
  const hash = hashScreenshot(fileId);
  const orders = await getRows('Orders');
  return orders.some(o => o.ScreenshotHash === hash);
}

module.exports = {
  hashScreenshot,
  isUtrUsed,
  isScreenshotUsed
};
