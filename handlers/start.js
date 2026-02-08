const bot = global.bot;

const CHANNELS = [
  { username: '@SheinVoucherHub', url: 'https://t.me/SheinVoucherHub' },
  { username: '@OrdersNotify', url: 'https://t.me/OrdersNotify' }
];

async function joinedAll(userId) {
  for (const c of CHANNELS) {
    try {
      const m = await bot.getChatMember(c.username, userId);
      if (!['member','administrator','creator'].includes(m.status)) return false;
    } catch {
      return false;
    }
  }
  return true;
}

bot.onText(/\/start/, async msg => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  const ok = await joinedAll(userId);
  if (!ok) {
    return bot.sendMessage(
      chatId,
      "🔒 Join both channels to continue",
      {
        reply_markup: {
          inline_keyboard: [
            CHANNELS.map(c => ({ text: `Join ${c.username}`, url: c.url })),
            [{ text: "✅ I've Joined", callback_data: 'verify_join' }]
          ]
        }
      }
    );
  }

  return global.askCaptcha(chatId, userId);
});

bot.on('callback_query', async q => {
  if (q.data !== 'verify_join') return;

  const ok = await joinedAll(q.from.id);
  if (!ok) {
    return bot.answerCallbackQuery(q.id, {
      text: "Join both channels first",
      show_alert: true
    });
  }

  bot.answerCallbackQuery(q.id);
  return global.askCaptcha(q.message.chat.id, q.from.id);
});
