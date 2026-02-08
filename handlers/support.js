/**
 * handlers/support.js
 * Support chat: user messages forwarded to admin
 */

const bot = global.bot;
const ADMIN_ID = global.ADMIN_ID;
const { isBlocked } = require('../database/blocks');

// Support mode state
const supportState = new Map();

// Enter support
bot.on('message', async (msg) => {
  if (!msg.text) return;

  if (msg.text === '🆘 Support') {
    if (await isBlocked(msg.from.id)) {
      return bot.sendMessage(msg.chat.id, "⛔ You are blocked. Contact admin later.");
    }

    supportState.set(msg.from.id, true);

    return bot.sendMessage(
      msg.chat.id,
      "🆘 **Support Mode**\n\nSend your message, photo, or screenshot.\n\n❌ Fake / spam / abuse = permanent ban.\n\nTap **Leave** to exit.",
      {
        parse_mode: 'Markdown',
        reply_markup: {
          keyboard: [[{ text: '↩️ Leave Support' }]],
          resize_keyboard: true
        }
      }
    );
  }

  // Leave support
  if (msg.text === '↩️ Leave Support') {
    supportState.delete(msg.from.id);
    await bot.sendMessage(
      msg.chat.id,
      "✅ Support mode closed.",
      { reply_markup: { remove_keyboard: true } }
    );
    if (global.showMainMenu) global.showMainMenu(msg.chat.id);
    return;
  }

  // Forward support messages
  if (!supportState.has(msg.from.id)) return;

  // Forward any content to admin
  await bot.forwardMessage(ADMIN_ID, msg.chat.id, msg.message_id);

  await bot.sendMessage(
    msg.chat.id,
    "📨 Message sent to admin. Please wait for reply."
  );
});
