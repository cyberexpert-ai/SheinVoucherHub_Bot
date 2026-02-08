/**
 * handlers/orders.js
 * My Orders – list user orders
 */

const bot = global.bot;
const { getOrdersByUser } = require('../database/orders');
const { isBlocked } = require('../database/blocks');

bot.on('message', async (msg) => {
  if (!msg.text) return;
  if (msg.text !== '📦 My Orders') return;

  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (await isBlocked(userId)) {
    return bot.sendMessage(chatId, "⛔ You are blocked. Contact support.");
  }

  const orders = await getOrdersByUser(userId);

  if (!orders.length) {
    return bot.sendMessage(chatId, "📦 You don't have any orders yet.");
  }

  let text = "📦 **Your Orders**\n\n";

  for (const o of orders) {
    const statusEmoji =
      o.Status === 'Successful' ? '✅' :
      o.Status === 'Rejected' ? '❌' : '⏳';

    text +=
      `🧾 \`${o.OrderID}\`\n` +
      `🎟 ${o.Category} | Qty ${o.Quantity}\n` +
      `💰 ₹${o.Amount} | ${statusEmoji} ${o.Status}\n`;

    if (o.Status === 'Successful' && o.VoucherCodes) {
      text += `🎁 Codes: \`${o.VoucherCodes}\`\n`;
    }

    text += "——————————————\n";
  }

  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});
