const isJoined = require("../utils/channelCheck");
const { showMenu, verifiedUsers } = require("./user");

const CHANNEL = "@SheinXCodes";

exports.verify = async (bot, query) => {
  const userId = query.from.id;
  const chatId = query.message.chat.id;

  const joined = await isJoined(bot, userId, CHANNEL);

  if (!joined) {
    return bot.answerCallbackQuery(query.id, {
      text: "❌ You must join the channel first!",
      show_alert: true
    });
  }

  verifiedUsers.add(userId);

  await bot.answerCallbackQuery(query.id, {
    text: "✅ Verified successfully!"
  });

  showMenu(bot, chatId);
};
