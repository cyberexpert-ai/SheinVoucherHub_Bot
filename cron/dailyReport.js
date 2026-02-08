/**
 * cron/dailyReport.js
 * Send daily business report to admin
 */

const cron = require('node-cron');
const bot = global.bot;
const { getRows } = require('../config/sheets');

// Run daily at 9:00 AM server time
cron.schedule('0 9 * * *', async () => {
  try {
    const users = await getRows('Users');
    const orders = await getRows('Orders');
    const categories = await getRows('Categories');

    const today = new Date().toISOString().slice(0, 10);

    const todayOrders = orders.filter(o =>
      o.CreatedAt && o.CreatedAt.startsWith(today)
    );

    const successToday = todayOrders.filter(o => o.Status === 'Successful');
    const pending = orders.filter(o => o.Status === 'Pending');

    let revenueToday = 0;
    successToday.forEach(o => {
      revenueToday += Number(o.Amount || 0);
    });

    const lowStockCount = categories.filter(c =>
      Number(c.Stock || 0) <= 5
    ).length;

    const report =
`📊 **Daily Business Report**
━━━━━━━━━━━━━━━━━━
👥 Total Users: ${users.length}

📦 Orders Today: ${todayOrders.length}
✅ Successful Today: ${successToday.length}
⏳ Pending Orders: ${pending.length}

💰 Revenue Today: ₹${revenueToday}

⚠️ Low Stock Categories: ${lowStockCount}
━━━━━━━━━━━━━━━━━━
🤖 SheinVoucherHub_Bot`;

    await bot.sendMessage(global.ADMIN_ID, report, {
      parse_mode: 'Markdown'
    });

  } catch (err) {
    console.error('Daily report cron error:', err.message);
  }
});
