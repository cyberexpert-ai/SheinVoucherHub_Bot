/**
 * config/bot.js
 * Telegram bot initialization (single source of truth)
 */

const TelegramBot = require('node-telegram-bot-api');
const { BOT_TOKEN } = require('./env');

const bot = new TelegramBot(BOT_TOKEN, {
  polling: true,
  request: {
    timeout: 30000
  }
});

bot.on('polling_error', (err) => {
  console.error('❌ Polling error:', err.message);
});

module.exports = bot;
