const isJoined = require("../utils/channelCheck");
const { showWelcome, verifiedUsers } = require("./user");

// MUST JOIN CHANNELS
const REQUIRED_CHANNELS = [
  "@OrdersNotify",
  "@SheinVoucherHub"
];

exports.verify = async (bot, query) => {
  const userId = query.from.id;
  const chatId = query.message.chat.id;

  const joined = await isJoined(bot, userId, REQUIRED_CHANNELS);

  if (!joined) {
    return bot.answerCallbackQuery(query.id, {
      text: "❌ Please join all mandatory channels first!",
      show_alert: true
    });
  }

  verifiedUsers.add(userId);

  await bot.answerCallbackQuery(query.id, {
    text: "✅ Verified successfully!"
  });

  // First time welcome
  showWelcome(bot, chatId, userId);
};
