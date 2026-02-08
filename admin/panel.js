const bot = global.bot;
const { isAdmin } = require('../database/admins');

bot.onText(/\/admin/, async msg => {
  if (!(await isAdmin(msg.from.id))) {
    return bot.sendMessage(msg.chat.id, "⛔ Access denied");
  }

  bot.sendMessage(msg.chat.id, "👑 Admin Panel", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📦 Orders", callback_data: "admin_orders" }],
        [{ text: "🎟 Discounts", callback_data: "admin_discounts" }],
        [{ text: "📢 Broadcast", callback_data: "admin_broadcast" }],
        [{ text: "📊 Reports", callback_data: "admin_reports" }],
        [{ text: "⚙️ System", callback_data: "admin_system" }]
      ]
    }
  });
});
