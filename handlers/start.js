/**
 * handlers/start.js
 * /start command + channel join gate
 */

const bot = global.bot;
const ADMIN_ID = global.ADMIN_ID;

// Channels (user must join both)
const REQUIRED_CHANNELS = [
  { username: '@SheinVoucherHub', url: 'https://t.me/SheinVoucherHub' },
  { username: '@OrdersNotify', url: 'https://t.me/OrdersNotify' }
];

// Helper: check if user joined all channels
async function hasJoinedAll(userId) {
  for (const ch of REQUIRED_CHANNELS) {
    try {
      const m = await bot.getChatMember(ch.username, userId);
      if (!['member', 'administrator', 'creator'].includes(m.status)) {
        return false;
      }
    } catch (e) {
      return false; // bot not admin / error → treat as not joined
    }
  }
  return true;
}

// /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Join gate
  const joined = await hasJoinedAll(userId);
  if (!joined) {
    return bot.sendMessage(
      chatId,
      "👋 **Welcome to Shein Voucher Hub**\n\n🔒 To continue, join both channels:",
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            REQUIRED_CHANNELS.map(c => ({ text: `Join ${c.username}`, url: c.url })),
            [{ text: "✅ I've Joined", callback_data: 'verify_join' }]
          ]
        }
      }
    );
  }

  // If already joined → go menu
  return bot.sendMessage(chatId, "✅ Verified! Opening main menu…");
});

// Verify join button
bot.on('callback_query', async (q) => {
  if (q.data !== 'verify_join') return;
  const chatId = q.message.chat.id;
  const userId = q.from.id;

  const joined = await hasJoinedAll(userId);
  if (!joined) {
    return bot.answerCallbackQuery(q.id, {
      text: '❌ Please join both channels first',
      show_alert: true
    });
  }

  bot.answerCallbackQuery(q.id);
  return bot.sendMessage(chatId, "✅ Verification successful! Use the menu below.");
});
