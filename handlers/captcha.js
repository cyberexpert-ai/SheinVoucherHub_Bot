const bot = global.bot;
const { generateCaptcha } = require('../utils/captchaEngine');
const { blockUser } = require('../database/blocks');

const state = new Map();

global.askCaptcha = async (chatId, userId) => {
  const c = generateCaptcha();
  state.set(userId, { ans: c.a, tries: 0 });

  bot.sendMessage(chatId, `🔐 Verification\n\n${c.q}`);
};

bot.on('message', async msg => {
  if (!msg.text) return;
  const userId = msg.from.id;
  if (!state.has(userId)) return;

  const s = state.get(userId);

  if (msg.text.trim() === s.ans) {
    state.delete(userId);
    bot.sendMessage(msg.chat.id, "✅ Verified");
    return global.showMainMenu(msg.chat.id);
  }

  s.tries++;
  if (s.tries >= 3) {
    state.delete(userId);
    await blockUser({
      userId,
      reason: "Captcha failed",
      expireAt: new Date(Date.now()+10*60*1000).toISOString()
    });
    return bot.sendMessage(msg.chat.id, "⛔ Temporarily blocked (10 min)");
  }

  bot.sendMessage(msg.chat.id, "❌ Wrong, try again");
});
