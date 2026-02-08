const verifiedUsers = new Set();
const welcomedUsers = new Set();

exports.start = async (bot, msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (verifiedUsers.has(userId) && welcomedUsers.has(userId)) {
    return showMenu(bot, chatId);
  }

  if (!verifiedUsers.has(userId)) {
    return bot.sendMessage(
      chatId,
`👋 Welcome to Shein Codes Bot

📢 Please join required channels to continue.

Mandatory:
• @OrdersNotify
• @SheinVoucherHub

Optional:
• @SheinXCodes

After joining mandatory channels, tap verify ✅`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🔊 Orders Notify", url: "https://t.me/OrdersNotify" },
              { text: "🔊 Voucher Hub", url: "https://t.me/SheinVoucherHub" }
            ],
            [
              { text: "➕ Extra Channel", url: "https://t.me/SheinXCodes" }
            ],
            [
              { text: "✅ I've Joined — Verify", callback_data: "verify_join" }
            ]
          ]
        }
      }
    );
  }

  showWelcome(bot, chatId, userId);
};

function showWelcome(bot, chatId, userId) {
  welcomedUsers.add(userId);

  bot.sendMessage(
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
}

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
exports.showWelcome = showWelcome;
exports.verifiedUsers = verifiedUsers;
