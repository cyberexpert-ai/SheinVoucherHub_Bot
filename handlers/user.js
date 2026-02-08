const verifiedUsers = new Set();
const welcomedUsers = new Set();
const lastBotMessage = new Map();

exports.start = async (bot, msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // 🧹 delete old bot message
  if (lastBotMessage.has(userId)) {
    try {
      await bot.deleteMessage(chatId, lastBotMessage.get(userId));
    } catch (e) {}
  }

  // ✅ already verified & welcomed → direct menu
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

  // 🚨 always show join message if not verified
  const sent = await bot.sendMessage(
    chatId,
`👋 Welcome to Shein Codes Bot

📢 Please join @SheinXCodes to continue.

After joining, tap verify ✅

Official channel
https://t.me/SheinVoucherHub

Order alart
https://t.me/OrdersNotify`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            { text: "📢 Official channel", url: "https://t.me/SheinVoucherHub" }
          ],
          [
            { text: "🔔 Order alart", url: "https://t.me/OrdersNotify" }
          ],
          [
            { text: "✅ I've Joined — Verify", callback_data: "verify_join" }
          ]
        ]
      }
    }
  );

  lastBotMessage.set(userId, sent.message_id);
};

// exported for verify.js
exports.verifiedUsers = verifiedUsers;
exports.welcomedUsers = welcomedUsers;
exports.lastBotMessage = lastBotMessage;

exports.showWelcome = async (bot, chatId, userId) => {
  welcomedUsers.add(userId);

  await bot.sendMessage(
    chatId,
`👋 Welcome to Shein Codes Bot

Choose an option 👇`,
    {
      reply_markup: {
        keyboard: [
          ["🛍️ Buy Vouchers", "📦 My Orders"],
          ["🔁 Recover Vouchers", "🆘 Support"],
          ["📜 Disclaimer"]
        ],
        resize_keyboard: true
      }
    }
  );
};
