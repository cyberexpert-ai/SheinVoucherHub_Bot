/**
 * admin/reports.js
 * Admin reports & analytics
 */

const bot = global.bot;
const ADMIN_ID = global.ADMIN_ID;
const { getRows } = require('../config/sheets');

// Admin check
function isAdmin(id) {
  return id === ADMIN_ID;
}

// Open reports panel
bot.on('callback_query', async (q) => {
  if (q.data !== 'admin_reports') return;
  if (!isAdmin(q.from.id)) return;

  bot.answerCallbackQuery(q.id);

  bot.sendMessage(
    q.message.chat.id,
    "📊 **Reports Panel**\n\nSelect report:",
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "📦 Orders Summary", callback_data: "rep_orders" }],
          [{ text: "👥 Users Summary", callback_data: "rep_users" }],
          [{ text: "💰 Revenue Summary", callback_data: "rep_revenue" }]
        ]
      }
    }
  );
});

// Orders report
bot.on('callback_query', async (q) => {
  if (q.data !== 'rep_orders') return;
  if (!isAdmin(q.from.id)) return;

  const orders = await getRows('Orders');

  const total = orders.length;
  const pending = orders.filter(o => o.Status === 'Pending').length;
  const success = orders.filter(o => o.Status === 'Successful').length;
  const rejected = orders.filter(o => o.Status === 'Rejected').length;

  bot.answerCallbackQuery(q.id);
  bot.sendMessage(
    q.message.chat.id,
    `📦 **Orders Report**\n\n` +
    `Total: ${total}\n` +
    `⏳ Pending: ${pending}\n` +
    `✅ Successful: ${success}\n` +
    `❌ Rejected: ${rejected}`,
    { parse_mode: 'Markdown' }
  );
});

// Users report
bot.on('callback_query', async (q) => {
  if (q.data !== 'rep_users') return;
  if (!isAdmin(q.from.id)) return;

  const users = await getRows('Users');
  const active = users.filter(u => u.Status === 'Active').length;
  const blocked = users.filter(u => u.Status === 'Blocked').length;

  bot.answerCallbackQuery(q.id);
  bot.sendMessage(
    q.message.chat.id,
    `👥 **Users Report**\n\n` +
    `Total Users: ${users.length}\n` +
    `✅ Active: ${active}\n` +
    `⛔ Blocked: ${blocked}`,
    { parse_mode: 'Markdown' }
  );
});

// Revenue report
bot.on('callback_query', async (q) => {
  if (q.data !== 'rep_revenue') return;
  if (!isAdmin(q.from.id)) return;

  const orders = await getRows('Orders');
  let revenue = 0;

  orders
    .filter(o => o.Status === 'Successful')
    .forEach(o => revenue += Number(o.Amount || 0));

  bot.answerCallbackQuery(q.id);
  bot.sendMessage(
    q.message.chat.id,
    `💰 **Revenue Report**\n\n` +
    `Total Revenue: ₹${revenue}`,
    { parse_mode: 'Markdown' }
  );
});
