/**
 * handlers/recover.js
 * Recover vouchers by Order ID
 */

const bot = global.bot;
const { getOrder } = require('../database/orders');
const { isBlocked } = require('../database/blocks');

// Temp recover state
const recoverState = new Map();

bot.on('message', async (msg) => {
  if (!msg.text) return;

  // Entry point
  if (msg.text === '🔁 Recover Vouchers') {
    if (await isBlocked(msg.from.id)) {
      return bot.sendMessage(msg.chat.id, "⛔ You are blocked. Contact support.");
    }

    recoverState.set(msg.from.id, true);
    return bot.sendMessage(
      msg.chat.id,
      "🔁 **Recover Vouchers**\n\nSend your Order ID\nExample:\n`SVH-20260130-ABC123`",
      { parse_mode: 'Markdown' }
    );
  }

  // Waiting for Order ID
  if (!recoverState.has(msg.from.id)) return;

  const orderId = msg.text.trim();
  const order = await getOrder(orderId);

  recoverState.delete(msg.from.id);

  if (!order || order.UserID != msg.from.id.toString()) {
    return bot.sendMessage(
      msg.chat.id,
      `⚠️ **Order not found**\n${orderId}`,
      { parse_mode: 'Markdown' }
    );
  }

  if (order.Status !== 'Successful') {
    return bot.sendMessage(
      msg.chat.id,
      `⏳ Order status: *${order.Status}*\nPlease wait for admin approval.`,
      { parse_mode: 'Markdown' }
    );
  }

  // Successful order → show codes
  bot.sendMessage(
    msg.chat.id,
    `✅ **Recovered Successfully**\n\n🧾 Order ID:\n\`${order.OrderID}\`\n\n🎁 Codes:\n\`${order.VoucherCodes}\``,
    { parse_mode: 'Markdown' }
  );
});
