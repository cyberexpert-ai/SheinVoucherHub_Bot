const verifiedUsers = new Set();
const welcomedUsers = new Set();

// store last bot message id per user
const lastBotMessage = new Map();

exports.start = async (bot, msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // 🔥 delete old bot message
  if (lastBotMessage.has(userId)) {
    try {
      await bot.deleteMessage(chatId, lastBotMessage.get(userId));
    } catch (e) {}
  }

  // not verified → show join message
  if (!verifiedUsers.has(userId)) {
    const sent = await bot.sendMessage(
      chatId,
`👋 Welcome to Shein Codes Bot

📢 Please join @SheinXCodes to continue.

After joining, tap verify ✅

Official channel:
https://t.me/SheinVoucherHub

Order alert:
https://t.me/OrdersNotify`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ I've Joined — Verify", callback_data: "verify_join" }
            ]
          ]
        }
      }
    );

    lastBotMessage.set(userId, sent.message_id);
    return;
  }

  // verified but first welcome not shown
  if (!welcomedUsers.has(userId)) {
    return showWelcome(bot, chatId, userId);
  }

  // verified + welcomed → menu
  showMenu(bot, chatId);
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

exports.showWelcome = showWelcome;
exports.showMenu = showMenu;
exports.verifiedUsers = verifiedUsers;
