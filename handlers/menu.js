/**
 * handlers/menu.js
 * Main menu keyboard + menu command
 */

const bot = global.bot;

// Main Menu Keyboard
const MAIN_MENU = {
  reply_markup: {
    keyboard: [
      [{ text: "🛍 Buy Vouchers" }, { text: "📦 My Orders" }],
      [{ text: "🔁 Recover Vouchers" }, { text: "🆘 Support" }],
      [{ text: "📜 Disclaimer" }]
    ],
    resize_keyboard: true
  }
};

// Expose function globally (used by other handlers)
global.showMainMenu = (chatId) => {
  return bot.sendMessage(
    chatId,
    "🏠 **Main Menu**\n\nChoose an option:",
    { parse_mode: "Markdown", ...MAIN_MENU }
  );
};

// /menu command
bot.onText(/\/menu/, (msg) => {
  global.showMainMenu(msg.chat.id);
});

// Also open menu when user types "menu"
bot.on('message', (msg) => {
  if (!msg.text) return;
  const text = msg.text.toLowerCase();
  if (text === 'menu' || text === 'main menu') {
    global.showMainMenu(msg.chat.id);
  }
});
