/**
 * utils/orderNotify.js
 * Send success order notification to OrdersNotify channel
 */

const bot = global.bot;

const ORDERS_CHANNEL = '@OrdersNotify';

async function sendOrderSuccess(order) {
  const msg =
`🎯 𝗡𝗲𝘄 𝗢𝗿𝗱𝗲𝗿 𝗦𝘂𝗯𝗺𝗶𝘁𝘁𝗲𝗱
━━━━━━━━━━━•❈•━━━━━━━━━━━
╰➤👤 USER NAME : ${order.Username || 'N/A'}
╰➤🆔 USER ID : ${order.UserID}
╰➤📡 STATUS : ✅ Success
╰➤ 📦 TOTAL QUANTITY : ${order.Quantity}
╰➤ 💳 COST : ₹${order.Amount}

🤖 BOT NAME : @SheinVoucherHub_Bot
━━━━━━━━━━━•❈•━━━━━━━━━━━`;

  try {
    await bot.sendMessage(ORDERS_CHANNEL, msg);
  } catch (e) {
    console.error('OrdersNotify send error:', e.message);
  }
}

module.exports = { sendOrderSuccess };
