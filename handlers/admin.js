const config = require("../config/config");

function isAdmin(msg) {
  return String(msg.from.id) === config.ADMIN_ID;
}

exports.panel = (bot, msg) => {
  if (!isAdmin(msg)) {
    return bot.sendMessage(
      msg.chat.id,
      "⛔ You are not authorized to access admin panel."
    );
  }

  bot.sendMessage(msg.chat.id, "🛠️ Admin Panel", {
    reply_markup: {
      keyboard: [
        ["📦 Orders", "🎟️ Coupons"],
        ["🏷️ Categories", "📢 Broadcast"],
        ["🚫 Block User", "⚙️ Settings"],
        ["🔄 Refresh Panel"]
      ],
      resize_keyboard: true
    }
  });
};
