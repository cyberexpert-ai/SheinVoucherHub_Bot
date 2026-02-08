/**
 * cron/orderExpiry.js
 * Auto-expire pending orders after 2 hours
 */

const cron = require('node-cron');
const bot = global.bot;
const { getRows, updateRow } = require('../config/sheets');
const { increaseStock } = require('../database/categories');

const EXPIRY_HOURS = 2;

// Run every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  try {
    const orders = await getRows('Orders');
    const now = Date.now();

    for (const o of orders) {
      if (o.Status !== 'Pending') continue;

      const created = new Date(o.CreatedAt).getTime();
      const diffHours = (now - created) / (1000 * 60 * 60);

      if (diffHours >= EXPIRY_HOURS) {
        // Expire order
        await updateRow('Orders', 'OrderID', o.OrderID, {
          Status: 'Expired'
        });

        // Restore stock
        await increaseStock(o.Category, Number(o.Quantity));

        // Notify user
        try {
          await bot.sendMessage(
            Number(o.UserID),
            `⏱ **Order Expired**\n\nOrder ID:\n\`${o.OrderID}\`\n\nPayment time exceeded.`,
            { parse_mode: 'Markdown' }
          );
        } catch (e) {}
      }
    }
  } catch (err) {
    console.error('Order expiry cron error:', err.message);
  }
});
