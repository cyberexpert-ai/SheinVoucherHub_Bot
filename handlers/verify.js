const { showWelcome, verifiedUsers } = require("./user");

exports.verify = async (bot, query) => {
  const userId = query.from.id;
  const chatId = query.message.chat.id;

  verifiedUsers.add(userId);

  await bot.answerCallbackQuery(query.id, {
    text: "✅ Verified successfully!"
  });

  showWelcome(bot, chatId, userId);
};
