/**
 * database/coupons.js
 * Voucher vault helpers
 */

const { getRows, updateRow } = require('../config/sheets');

const SHEET = 'VoucherVault';

// Get available codes by category
async function getAvailableCodes(categoryId, qty) {
  const rows = await getRows(SHEET);
  const available = rows.filter(
    r => r.CategoryID === categoryId && r.Status === 'Available'
  );
  return available.slice(0, qty);
}

// Mark codes as sold
async function markCodesSold(codes, orderId) {
  for (const c of codes) {
    await updateRow(SHEET, 'Code', c.Code, {
      Status: 'Sold',
      OrderID: orderId
    });
  }
}

module.exports = {
  getAvailableCodes,
  markCodesSold
};
