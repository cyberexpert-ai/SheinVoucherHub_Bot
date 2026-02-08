/**
 * handlers/captcha.js
 * Basic captcha flow (math-based, extendable)
 */

const bot = global.bot;

// In-memory captcha state
const captchaState = new Map();

// Generate math captcha
function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return {
    question: `${a} + ${b} = ?`,
    answer: a + b
  };
}

// Ask captcha
global.askCaptcha = async (chatId, userId) => {
  const c = generateCaptcha();
  captchaState.set(userId, c.answer);

  await bot.sendMessage(
    chatId,
    `🔐 **Verification Required**\n\nSolve this captcha:\n\n🧮 ${c.question}`,
    { parse_mode: 'Markdown' }
  );
};

// Listen for captcha answers
bot.on('message', async (msg) => {
  if (!msg.text) return;

  const userId = msg.from.id;
  if (!captchaState.has(userId)) return;

  const correct = captchaState.get(userId);
  const userAnswer = parseInt(msg.text.trim(), 10);

  if (userAnswer === correct) {
    captchaState.delete(userId);
    await bot.sendMessage(msg.chat.id, "✅ Captcha solved successfully!");
    if (typeof global.showMainMenu === 'function') {
      global.showMainMenu(msg.chat.id);
    }
  } else {
    await bot.sendMessage(
      msg.chat.id,
      "❌ Wrong answer. Try again."
    );
  }
});
