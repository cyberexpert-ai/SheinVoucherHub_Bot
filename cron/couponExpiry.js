/**
 * cron/couponExpiry.js
 * Automatically expire discount coupons after expiry time
 */

const cron = require('node-cron');
const { getRows, updateRow } = require('../config/sheets');

// Run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  try {
    const coupons = await getRows('DiscountCoupons');
    const now = Date.now();

    for (const c of coupons) {
      if (c.Status !== 'Active') continue;
      if (!c.ExpireAt) continue;

      const expireTime = new Date(c.ExpireAt).getTime();
      if (now >= expireTime) {
        await updateRow('DiscountCoupons', 'CouponCode', c.CouponCode, {
          Status: 'Expired'
        });
      }
    }
  } catch (err) {
    console.error('Coupon expiry cron error:', err.message);
  }
});
