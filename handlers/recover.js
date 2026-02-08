const bot = global.bot;
const { getOrder } = require('../database/orders');
const { createTicket } = require('../database/recoveryTickets');

const SLA = 2;
const wait = new Map();

bot.on('message', async msg => {
  if (msg.text === '🔁 Recover Vouchers') {
    wait.set(msg.from.id, true);
    return bot.sendMessage(msg.chat.id, "Send Order ID (2 hours valid)");
  }

  if (!wait.has(msg.from.id)) return;
  wait.delete(msg.from.id);

  const order = await getOrder(msg.text.trim());
  if (!order || order.UserID !== msg.from.id.toString()) {
    return bot.sendMessage(msg.chat.id, "⚠️ Order not found");
  }

  const diff = (Date.now() - new Date(order.CreatedAt)) / 36e5;
  if (diff > SLA) {
    return bot.sendMessage(msg.chat.id, "⛔ Recovery expired");
  }

  const ticket = await createTicket(order.OrderID, msg.from.id);
  bot.sendMessage(msg.chat.id, `🎫 Ticket created\n${ticket}`);
});
