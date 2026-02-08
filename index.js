/**
 * SheinVoucherHub_Bot
 * Main Entry File
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// ================== ENV ==================
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = Number(process.env.ADMIN_ID);

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN missing");
  process.exit(1);
}

// ================== BOT INIT ==================
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ================== GLOBAL STATE ==================
global.bot = bot;
global.ADMIN_ID = ADMIN_ID;

// ================== LOAD MODULES ==================
require('./handlers/start');
require('./handlers/menu');
require('./handlers/fallback');

// ================== START LOG ==================
bot.on('polling_error', (err) => console.log('Polling error:', err.message));

console.log("🤖 SheinVoucherHub_Bot started successfully");
