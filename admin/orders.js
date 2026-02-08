const bot = global.bot;
const { getRows, updateRow } = require('../config/sheets');
const { getAvailableCodes, markCodesSold } = require('../database/coupons');
const { sendOrderSuccess } = require('../utils/orderNotify');

bot.on('callback_query', async q => {
  if (!q.data.startsWith('order_ok_')) return;

  const orderId = q.data.replace('order_ok_', '');
  const orders = await getRows('Orders');
  const order = orders.find(o => o.OrderID === orderId);
  if (!order) return;

  const codes = await getAvailableCodes(order.Category, Number(order.Quantity));
  if (codes.length < order.Quantity) {
    return bot.sendMessage(q.message.chat.id, "❌ Not enough codes");
  }

  const list = codes.map(c => c.Code).join('\n');
  await markCodesSold(codes, orderId);

  await updateRow('Orders', 'OrderID', orderId, {
    Status: 'Successful',
    VoucherCodes: list
  });

  await bot.sendMessage(
    Number(order.UserID),
    `🎉 Order Successful\n\n${list}`
  );

  await sendOrderSuccess(order);
});
