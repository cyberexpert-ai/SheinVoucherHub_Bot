/**
 * handlers/payment.js
 * Payment proof (screenshot + UTR) handling
 */

const bot = global.bot;
const { createOrder } = require('../database/orders');
const { reduceStock } = require('../database/categories');
const { isBlocked } = require('../database/blocks');
const crypto = require('crypto');

// Temp payment state
const payState = new Map();

// Helper: generate order id
function generateOrderId() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `SVH-${ymd}-${rand}`;
}

// Start payment (called after buy summary)
global.startPayment = async (chatId, userId, state) => {
  if (await isBlocked(userId)) {
    return bot.sendMessage(chatId, "⛔ You are blocked. Contact support.");
  }

  payState.set(userId, state);

  await bot.sendPhoto(
    chatId,
    'https://i.supaimg.com/00332ad4-8aa7-408f-8705-55dbc91ea737.jpg',
    {
      caption:
        `💳 **Payment Required**\n\n` +
        `🎟 Voucher: ₹${state.faceValue}\n` +
        `📦 Quantity: ${state.qty}\n` +
        `💰 Amount: ₹${state.total}\n\n` +
        `After payment, send **Screenshot** then **UTR (12 digits)**.`,
      parse_mode: 'Markdown'
    }
  );
};

// Receive screenshot
bot.on('message', async (msg) => {
  const userId = msg.from.id;
  if (!payState.has(userId)) return;

  const state = payState.get(userId);

  // Expect screenshot first
  if (!state.screenshot && msg.photo) {
    state.screenshot = msg.photo[msg.photo.length - 1].file_id;
    payState.set(userId, state);
    return bot.sendMessage(msg.chat.id, "✅ Screenshot received. Now send **UTR number**.");
  }

  // Expect UTR next
  if (state.screenshot && msg.text) {
    const utr = msg.text.trim();
    if (!/^\d{12}$/.test(utr)) {
      return bot.sendMessage(msg.chat.id, "❌ Invalid UTR. Enter 12 digit number.");
    }

    // Create order
    const orderId = generateOrderId();

    await createOrder({
      orderId,
      userId,
      username: msg.from.username || '',
      category: state.categoryId,
      quantity: state.qty,
      amount: state.total,
      utr,
      status: 'Pending'
    });

    // Lock stock (reduce)
    await reduceStock(state.categoryId, state.qty);

    // Notify admin
    await bot.sendPhoto(global.ADMIN_ID, state.screenshot, {
      caption:
        `🎯 **New Order Submitted**\n\n` +
        `🧾 Order ID: ${orderId}\n` +
        `👤 User: ${msg.from.first_name} (${userId})\n` +
        `📦 Qty: ${state.qty}\n` +
        `💰 Amount: ₹${state.total}\n` +
        `💳 UTR: ${utr}`,
      parse_mode: 'Markdown'
    });

    payState.delete(userId);

    return bot.sendMessage(
      msg.chat.id,
      `✅ **Order Submitted Successfully!**\n\n🧾 Order ID:\n\`${orderId}\`\n\nStatus: *Pending Approval*`,
      { parse_mode: 'Markdown' }
    );
  }
});
