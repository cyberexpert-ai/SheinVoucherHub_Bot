const isJoined = require("../utils/channelCheck");

const CHANNEL = "@SheinXCodes";

// temp memory (later you can move to sheet/db)
const verifiedUsers = new Set();

exports.start = async (bot, msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (verifiedUsers.has(userId)) {
    return showMenu(bot, chatId);
  }

  bot.sendMessage(
    chatId,
`👋 Welcome to Shein Codes Bot

📢 Please join ${CHANNEL} to continue.
After joining, tap verify ✅`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔊 Join @SheinXCodes", url: `https://t.me/SheinXCodes` }],
          [{ text: "✅ I've Joined — Verify", callback_data: "verify_join" }]
        ]
      }
    }
  );
};

function showMenu(bot, chatId) {
  bot.sendMessage(chatId, "🏠 Menu", {
    reply_markup: {
      keyboard: [
        ["🛍️ Buy Vouchers", "📦 My Orders"],
        ["🔁 Recover Vouchers", "🆘 Support"],
        ["📜 Disclaimer"]
      ],
      resize_keyboard: true
    }
  });
}

exports.showMenu = showMenu;
exports.verifiedUsers = verifiedUsers;
