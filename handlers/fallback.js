/**
 * handlers/fallback.js
 * Unknown messages, safety replies, gentle guidance
 */

const bot = global.bot;

// Helper: check if message is a command we already handle
function isKnownText(text = "") {
  const known = [
    '/start', '/menu',
    '🛍 buy vouchers',
    '📦 my orders',
    '🔁 recover vouchers',
    '🆘 support',
    '📜 disclaimer',
    'menu', 'main menu'
  ];
  return known.includes(text.toLowerCase());
}

// Catch-all text handler
bot.on('message', (msg) => {
  if (!msg.text) return;

  // Skip known texts (handled elsewhere)
  if (isKnownText(msg.text)) return;

  // Ignore commands (unknown /something)
  if (msg.text.startsWith('/')) {
    return bot.sendMessage(
      msg.chat.id,
      "❓ Unknown command.\n\nUse /menu to open the main menu."
    );
  }

  // Generic guidance
  bot.sendMessage(
    msg.chat.id,
    "ℹ️ I didn’t understand that.\n\nPlease use the buttons below or type /menu.",
  );
});
