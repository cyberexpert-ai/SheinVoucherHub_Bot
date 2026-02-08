/**
 * admin/broadcast.js
 * Admin broadcast system (text / photo)
 */

const bot = global.bot;
const ADMIN_ID = global.ADMIN_ID;
const { getRows } = require('../config/sheets');

// Simple admin check
function isAdmin(id) {
  return id === ADMIN_ID;
}

// Temp broadcast state
const broadcastState = new Map();

// Open broadcast panel
bot.on('callback_query', async (q) => {
  if (q.data !== 'admin_broadcast') return;
  if (!isAdmin(q.from.id)) return;

  bot.answerCallbackQuery(q.id);

  bot.sendMessage(
    q.message.chat.id,
    "📢 **Broadcast Panel**\n\nChoose broadcast type:",
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "📝 Text Broadcast", callback_data: "bc_text" }],
          [{ text: "🖼 Photo Broadcast", callback_data: "bc_photo" }]
        ]
      }
    }
  );
});

// Start text broadcast
bot.on('callback_query', async (q) => {
  if (q.data !== 'bc_text') return;
  if (!isAdmin(q.from.id)) return;

  broadcastState.set(q.from.id, { type: 'text' });
  bot.answerCallbackQuery(q.id);

  bot.sendMessage(q.message.chat.id, "📝 Send broadcast text:");
});

// Start photo broadcast
bot.on('callback_query', async (q) => {
  if (q.data !== 'bc_photo') return;
  if (!isAdmin(q.from.id)) return;

  broadcastState.set(q.from.id, { type: 'photo' });
  bot.answerCallbackQuery(q.id);

  bot.sendMessage(q.message.chat.id, "🖼 Send photo with caption:");
});

// Handle broadcast content
bot.on('message', async (msg) => {
  const userId = msg.from.id;
  if (!isAdmin(userId)) return;
  if (!broadcastState.has(userId)) return;

  const state = broadcastState.get(userId);
  broadcastState.delete(userId);

  const users = await getRows('Users');

  let sent = 0;
  for (const u of users) {
    const chatId = Number(u.UserID);
    try {
      if (state.type === 'text' && msg.text) {
        await bot.sendMessage(chatId, msg.text);
      }

      if (state.type === 'photo' && msg.photo) {
        await bot.sendPhoto(
          chatId,
          msg.photo[msg.photo.length - 1].file_id,
          { caption: msg.caption || '' }
        );
      }
      sent++;
    } catch (e) {
      // Ignore failed users (blocked / left)
    }
  }

  bot.sendMessage(
    msg.chat.id,
    `✅ Broadcast completed.\n\nDelivered to ${sent} users.`
  );
});
