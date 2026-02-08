const isJoined = require("../utils/channelCheck");

const verifiedUsers = new Set();
const welcomedUsers = new Set();
const lastBotMessage = new Map();

exports.start = async (bot, msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // 🧹 delete old bot message (if exists)
  if (lastBotMessage.has(userId)) {
    try {
      await bot.deleteMessage(chatId, lastBotMessage.get(userId));
    } catch (e) {}
  }

  // ✅ VERIFIED + WELCOMED → DIRECT MENU
  if (verifiedUsers.has(userId) && welcomedUsers.has(userId)) {
    const sent = await bot.sendMessage(chatId, "🏠 Menu", {
      reply_markup: {
        keyboard: [
          ["🛍️ Buy Vouchers", "📦 My Orders"],
          ["🔁 Recover Vouchers", "🆘 Support"],
          ["📜 Disclaimer"]
        ],
        resize_keyboard: true
      }
    });
    lastBotMessage.set(userId, sent.message_id);
    return;
  }

  // 🚨 ALWAYS SHOW JOIN MESSAGE IF NOT VERIFIED
  const sent = await bot.sendMessage(
    chatId,
`👋 Welcome to Shein Codes Bot

📢 Please join @SheinXCodes to continue.

After joining, tap verify ✅

📢 Official channel
https://t.me/SheinVoucherHub

🔔 Order alert
https://t.me/OrdersNotify`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "✅ I've Joined — Verify", callback_data: "verify_join" }]
        ]
      }
    }
  );

  lastBotMessage.set(userId, sent.message_id);
};
