const {
  verifiedUsers,
  showWelcome,
  lastBotMessage
} = require("./user");

exports.verify = async (bot, query) => {
  const userId = query.from.id;
  const chatId = query.message.chat.id;

  verifiedUsers.add(userId);

  await bot.answerCallbackQuery(query.id, {
    text: "✅ Verified successfully!"
  });

  // delete join message after verify
  if (lastBotMessage.has(userId)) {
    try {
      await bot.deleteMessage(chatId, lastBotMessage.get(userId));
    } catch (e) {}
  }

  showWelcome(bot, chatId, userId);
};
