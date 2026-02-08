/**
 * admin/orders.js
 * Admin order management: approve / reject
 */

const bot = global.bot;
const ADMIN_ID = global.ADMIN_ID;
const { getRows, updateRow } = require('../config/sheets');
const { increaseStock } = require('../database/categories');

const SHEET = 'Orders';

// Simple admin check
function isAdmin(id) {
  return id === ADMIN_ID;
}

// Show pending orders
bot.on('callback_query', async (q) => {
  if (q.data !== 'admin_orders') return;
  if (!isAdmin(q.from.id)) return;

  const rows = await getRows(SHEET);
  const pending = rows.filter(o => o.Status === 'Pending');

  if (!pending.length) {
    return bot.sendMessage(q.message.chat.id, "✅ No pending orders.");
  }

  for (const o of pending) {
    await bot.sendMessage(
      q.message.chat.id,
      `🧾 **Order Pending**\n\n` +
      `ID: \`${o.OrderID}\`\n` +
      `User: ${o.UserID}\n` +
      `Category: ${o.Category}\n` +
      `Qty: ${o.Quantity}\n` +
      `Amount: ₹${o.Amount}\n` +
      `UTR: ${o.UTR}`,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Approve', callback_data: `order_ok_${o.OrderID}` },
              { text: '❌ Reject', callback_data: `order_no_${o.OrderID}` }
            ]
          ]
        }
      }
    );
  }
});

// Approve / Reject handlers
bot.on('callback_query', async (q) => {
  if (!isAdmin(q.from.id)) return;

  // APPROVE
  if (q.data.startsWith('order_ok_')) {
    const orderId = q.data.replace('order_ok_', '');

    await updateRow(SHEET, 'OrderID', orderId, {
      Status: 'Successful'
    });

    await bot.sendMessage(q.message.chat.id, `✅ Order approved: ${orderId}`);
    return;
  }

  // REJECT
  if (q.data.startsWith('order_no_')) {
    const orderId = q.data.replace('order_no_', '');

    // Get order
    const rows = await getRows(SHEET);
    const order = rows.find(o => o.OrderID === orderId);
    if (!order) return;

    // Restore stock
    await increaseStock(order.Category, Number(order.Quantity));

    await updateRow(SHEET, 'OrderID', orderId, {
      Status: 'Rejected'
    });

    await bot.sendMessage(q.message.chat.id, `❌ Order rejected: ${orderId}`);
  }
});
