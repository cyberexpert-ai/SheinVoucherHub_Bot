/**
 * cron/stockAlert.js
 * Auto alert admin when voucher stock is low
 */

const cron = require('node-cron');
const bot = global.bot;
const { getRows, updateRow } = require('../config/sheets');

const LOW_STOCK_THRESHOLD = 5; // change if needed

// Run every 30 minutes
cron.schedule('*/30 * * * *', async () => {
  try {
    const categories = await getRows('Categories');

    for (const c of categories) {
      const stock = Number(c.Stock || 0);

      if (
        stock <= LOW_STOCK_THRESHOLD &&
        c.LowStockAlerted !== 'YES'
      ) {
        // Alert admin
        await bot.sendMessage(
          global.ADMIN_ID,
          `🚨 **Low Stock Alert**\n\n` +
          `📦 Category: ${c.Title}\n` +
          `🎟 Face Value: ₹${c.FaceValue}\n` +
          `⚠️ Remaining Stock: ${stock}\n\n` +
          `Please add new voucher codes.`,
          { parse_mode: 'Markdown' }
        );

        // Mark alerted
        await updateRow('Categories', 'CategoryID', c.CategoryID, {
          LowStockAlerted: 'YES'
        });
      }

      // Reset alert flag if stock replenished
      if (stock > LOW_STOCK_THRESHOLD && c.LowStockAlerted === 'YES') {
        await updateRow('Categories', 'CategoryID', c.CategoryID, {
          LowStockAlerted: 'NO'
        });
      }
    }
  } catch (err) {
    console.error('Stock alert cron error:', err.message);
  }
});
