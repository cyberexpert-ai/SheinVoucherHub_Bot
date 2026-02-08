/**
 * database/discountCoupons.js
 * Discount coupon helpers
 */

const { getRows, appendRow, updateRow } = require('../config/sheets');

const SHEET = 'DiscountCoupons';

// Get coupon by code
async function getCoupon(code) {
  const rows = await getRows(SHEET);
  return rows.find(c => c.CouponCode === code && c.Status === 'Active') || null;
}

// Create new coupon
async function createCoupon({
  code,
  type,            // FLAT | PERCENT
  value,           // 50 | 10
  category = 'ALL',
  minQty = 1,
  maxDiscount = 0,
  startAt,
  expireAt,
  usageLimit = 1
}) {
  const row = [
    code,
    type,
    value.toString(),
    category,
    minQty.toString(),
    maxDiscount.toString(),
    startAt || '',
    expireAt || '',
    usageLimit.toString(),
    '0',          // UsedCount
    'Active'
  ];

  await appendRow(SHEET, row);
  return getCoupon(code);
}

// Mark coupon used
async function markUsed(code) {
  const coupon = await getCoupon(code);
  if (!coupon) return false;

  const used = Number(coupon.UsedCount || 0) + 1;
  if (used >= Number(coupon.UsageLimit)) {
    return updateRow(SHEET, 'CouponCode', code, {
      UsedCount: used.toString(),
      Status: 'Expired'
    });
  }

  return updateRow(SHEET, 'CouponCode', code, {
    UsedCount: used.toString()
  });
}

// Expire coupon
async function expireCoupon(code) {
  return updateRow(SHEET, 'CouponCode', code, { Status: 'Expired' });
}

module.exports = {
  getCoupon,
  createCoupon,
  markUsed,
  expireCoupon
};
