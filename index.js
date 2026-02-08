const TelegramBot = require("node-telegram-bot-api");
const config = require("./config/config");
const handleAdmin = require("./handlers/admin");
const handleUser = require("./handlers/user");

const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

console.log("🤖 Bot started");

// /start
bot.onText(/\/start/, (msg) => {
  handleUser.start(bot, msg);
});

// /admin (NO restriction, NO captcha, NO join check)
bot.onText(/\/admin/, (msg) => {
  handleAdmin.panel(bot, msg);
});

// fallback
bot.on("message", (msg) => {
  if (!msg.text.startsWith("/")) {
    bot.sendMessage(msg.chat.id, "❓ Please use the menu buttons.");
  }
});
