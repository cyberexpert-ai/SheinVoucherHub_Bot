const TelegramBot = require("node-telegram-bot-api");
const config = require("./config/config");

const userHandler = require("./handlers/user");
const verifyHandler = require("./handlers/verify");
const adminHandler = require("./handlers/admin");

const bot = new TelegramBot(config.BOT_TOKEN, { polling: true });

console.log("🤖 Bot started");

// /start
bot.onText(/\/start/, (msg) => {
  userHandler.start(bot, msg);
});

// admin
bot.onText(/\/admin/, (msg) => {
  adminHandler.panel(bot, msg);
});

// verify button
bot.on("callback_query", (query) => {
  if (query.data === "verify_join") {
    verifyHandler.verify(bot, query);
  }
});

// fallback
bot.on("message", (msg) => {
  if (!msg.text.startsWith("/")) {
    bot.sendMessage(msg.chat.id, "❓ Please use the menu buttons.");
  }
});
