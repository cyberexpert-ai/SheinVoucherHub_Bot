/**
 * admin/system.js
 * System controls: maintenance, lock/unlock, force menu
 */

const bot = global.bot;
const ADMIN_ID = global.ADMIN_ID;

// System flags (in-memory; can be moved to Sheets later)
let MAINTENANCE_MODE = false;

// Admin check
function isAdmin(id) {
  return id === ADMIN_ID;
}

// Open system panel
bot.on('callback_query', async (q) => {
  if (q.data !== 'admin_system') return;
  if (!isAdmin(q.from.id)) return;

  bot.answerCallbackQuery(q.id);

  bot.sendMessage(
    q.message.chat.id,
    "⚙️ **System Control Panel**\n\nSelect an action:",
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: MAINTENANCE_MODE ? '🟢 Disable Maintenance' : '🔴 Enable Maintenance', callback_data: 'sys_toggle_maint' }
          ],
          [
            { text: '🔄 Force Menu Refresh', callback_data: 'sys_force_menu' }
          ]
        ]
      }
    }
  );
});

// Toggle maintenance
bot.on('callback_query', async (q) => {
  if (q.data !== 'sys_toggle_maint') return;
  if (!isAdmin(q.from.id)) return;

  MAINTENANCE_MODE = !MAINTENANCE_MODE;

  bot.answerCallbackQuery(q.id);
  bot.sendMessage(
    q.message.chat.id,
    `⚙️ Maintenance mode is now: *${MAINTENANCE_MODE ? 'ON' : 'OFF'}*`,
    { parse_mode: 'Markdown' }
  );
});

// Force menu refresh
bot.on('callback_query', async (q) => {
  if (q.data !== 'sys_force_menu') return;
  if (!isAdmin(q.from.id)) return;

  bot.answerCallbackQuery(q.id);
  bot.sendMessage(q.message.chat.id, "🔄 Menu refresh signal sent.");
});

// Global maintenance guard
bot.on('message', (msg) => {
  if (MAINTENANCE_MODE && msg.from.id !== ADMIN_ID) {
    bot.sendMessage(
      msg.chat.id,
      "🚧 **Bot Under Maintenance**\n\nPlease try again later.",
      { parse_mode: 'Markdown' }
    );
  }
});
