exports.start = (bot, msg) => {
  bot.sendMessage(msg.chat.id, "👋 Welcome to Shein Voucher Hub", {
    reply_markup: {
      keyboard: [
        ["🛒 Buy Voucher"],
        ["📦 My Orders", "🔁 Recover Voucher"],
        ["📜 Disclaimer", "🆘 Support"]
      ],
      resize_keyboard: true
    }
  });
};
