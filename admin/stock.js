/**
 * admin/stock.js
 * Admin add voucher codes to vault
 */

const bot = global.bot;
const ADMIN_ID = global.ADMIN_ID;
const { appendRow } = require('../config/sheets');

function isAdmin(id) {
  return id === ADMIN_ID;
}

bot.onText(/\/addcodes/, async (msg) => {
  if (!isAdmin(msg.from.id)) return;

  bot.sendMessage(
    msg.chat.id,
    "➕ **Add Voucher Codes**\n\nSend in format:\n\nCATEGORY_ID | CODE\n\nExample:\n1000 | ABCD-EFGH"
  );
});

bot.on('message', async (msg) => {
  if (!isAdmin(msg.from.id)) return;
  if (!msg.text || !msg.text.includes('|')) return;

  const [categoryId, code] = msg.text.split('|').map(t => t.trim());
  if (!categoryId || !code) return;

  await appendRow('VoucherVault', [
    code,
    categoryId,
    'Available',
    '',
    new Date().toISOString()
  ]);

  bot.sendMessage(msg.chat.id, `✅ Code added to vault (${categoryId})`);
});
