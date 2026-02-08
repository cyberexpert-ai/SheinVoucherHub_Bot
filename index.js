/**
 * SheinVoucherHub_Bot
 * Main Entry
 */

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// ENV
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = Number(process.env.ADMIN_ID);

if (!BOT_TOKEN) {
  console.error("BOT_TOKEN missing");
  process.exit(1);
}

// BOT
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

global.bot = bot;
global.ADMIN_ID = ADMIN_ID;

// HANDLERS
require('./handlers/start');
require('./handlers/menu');
require('./handlers/captcha');
require('./handlers/buy');
require('./handlers/payment');
require('./handlers/orders');
require('./handlers/recover');
require('./handlers/support');
require('./handlers/fallback');

// ADMIN
require('./admin/panel');
require('./admin/orders');
require('./admin/discounts');
require('./admin/broadcast');
require('./admin/reports');
require('./admin/system');
require('./admin/stock');

// CRON JOBS
require('./cron/orderExpiry');
require('./cron/tempUnblock');
require('./cron/couponExpiry');
require('./cron/stockAlert');
require('./cron/dailyReport');

bot.on('polling_error', err => console.log(err.message));
console.log("🤖 SheinVoucherHub_Bot started");
