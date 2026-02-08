const isJoined = require("../utils/channelCheck");
const { verifiedUsers, showWelcome } = require("./user");

exports.verify = async (bot, query) => {
  const userId = query.from.id;
  const chatId = query.message.chat.id;

  // 🔴 CHECK CHANNEL JOIN
  const joined = await isJoined(bot, userId);
  if (!joined) {
    return bot.answerCallbackQuery(query.id, {
      text: "❌ Please join official & order alert channels first!",
      show_alert: true
    });
  }

  verifiedUsers.add(userId);

  await bot.answerCallbackQuery(query.id, {
    text: "✅ Verified successfully!"
  });

  showWelcome(bot, chatId, userId);
};
