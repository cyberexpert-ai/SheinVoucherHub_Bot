/**
 * admin/panel.js
 * Admin main panel (dashboard + navigation)
 */

const bot = global.bot;
const ADMIN_ID = global.ADMIN_ID;
const { ROLES } = require('../config/roles');

// Simple admin check (owner for now)
function isAdmin(userId) {
  return userId === ADMIN_ID;
}

// /admin command
bot.onText(/\/admin/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAdmin(userId)) {
    return bot.sendMessage(chatId, "⛔ Access denied.");
  }

  const text =
    "👑 **Admin Control Panel**\n\n" +
    "Choose an option below:";

  bot.sendMessage(chatId, text, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: "📦 Orders", callback_data: "admin_orders" }],
        [{ text: "👥 Users", callback_data: "admin_users" }],
        [{ text: "🎟 Discount Coupons", callback_data: "admin_discounts" }],
        [{ text: "📢 Broadcast", callback_data: "admin_broadcast" }],
        [{ text: "📊 Reports", callback_data: "admin_reports" }],
        [{ text: "⚙️ System", callback_data: "admin_system" }]
      ]
    }
  });
});

// Handle panel navigation callbacks
bot.on('callback_query', async (q) => {
  if (!q.data.startsWith('admin_')) return;

  const userId = q.from.id;
  if (!isAdmin(userId)) {
    return bot.answerCallbackQuery(q.id, {
      text: 'Not authorized',
      show_alert: true
    });
  }

  bot.answerCallbackQuery(q.id);

  switch (q.data) {
    case 'admin_orders':
      bot.sendMessage(q.message.chat.id, "📦 Orders panel coming next…");
      break;

    case 'admin_users':
      bot.sendMessage(q.message.chat.id, "👥 Users panel coming next…");
      break;

    case 'admin_discounts':
      bot.sendMessage(q.message.chat.id, "🎟 Discount coupons panel coming next…");
      break;

    case 'admin_broadcast':
      bot.sendMessage(q.message.chat.id, "📢 Broadcast panel coming next…");
      break;

    case 'admin_reports':
      bot.sendMessage(q.message.chat.id, "📊 Reports panel coming next…");
      break;

    case 'admin_system':
      bot.sendMessage(q.message.chat.id, "⚙️ System settings panel coming next…");
      break;
  }
});
