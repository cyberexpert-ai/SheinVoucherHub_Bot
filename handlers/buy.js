/**
 * handlers/buy.js
 * Buy voucher flow (category → quantity → price)
 */

const bot = global.bot;
const { getCategories, getCategory } = require('../database/categories');
const { isBlocked } = require('../database/blocks');

// Temp user buy state
const buyState = new Map();

// Open Buy Vouchers
bot.on('message', async (msg) => {
  if (!msg.text) return;
  if (msg.text !== '🛍 Buy Vouchers') return;

  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Block check
  if (await isBlocked(userId)) {
    return bot.sendMessage(chatId, "⛔ You are blocked. Contact support.");
  }

  const categories = await getCategories();
  if (!categories.length) {
    return bot.sendMessage(chatId, "❌ No vouchers available right now.");
  }

  const keyboard = categories.map(c => ([
    {
      text: `₹${c.FaceValue} | Stock: ${c.Stock}`,
      callback_data: `buy_cat_${c.CategoryID}`
    }
  ]));

  bot.sendMessage(
    chatId,
    "🛍 **Select Voucher Category**",
    {
      parse_mode: 'Markdown',
      reply_markup: { inline_keyboard: keyboard }
    }
  );
});

// Category selected
bot.on('callback_query', async (q) => {
  if (!q.data.startsWith('buy_cat_')) return;

  const chatId = q.message.chat.id;
  const userId = q.from.id;
  const categoryId = q.data.replace('buy_cat_', '');

  const category = await getCategory(categoryId);
  if (!category) {
    return bot.answerCallbackQuery(q.id, { text: 'Invalid category' });
  }

  buyState.set(userId, { categoryId });

  bot.answerCallbackQuery(q.id);
  bot.sendMessage(
    chatId,
    `📦 **₹${category.FaceValue} Voucher**\n\nAvailable Stock: ${category.Stock}\n\nSend quantity (number):`,
    { parse_mode: 'Markdown' }
  );
});

// Quantity input
bot.on('message', async (msg) => {
  if (!msg.text) return;

  const userId = msg.from.id;
  if (!buyState.has(userId)) return;

  const qty = parseInt(msg.text, 10);
  if (isNaN(qty) || qty <= 0) {
    return bot.sendMessage(msg.chat.id, "❌ Enter a valid quantity number.");
  }

  const state = buyState.get(userId);
  const category = await getCategory(state.categoryId);

  if (qty > Number(category.Stock)) {
    return bot.sendMessage(
      msg.chat.id,
      `❌ Only ${category.Stock} vouchers available.`
    );
  }

  // Price tier logic
  let price;
  if (qty >= 10) price = Number(category.Price10);
  else if (qty >= 5) price = Number(category.Price5);
  else if (qty >= 2) price = Number(category.Price2);
  else price = Number(category.Price1);

  const total = price * qty;

  state.qty = qty;
  state.price = price;
  state.total = total;

  buyState.set(userId, state);

  bot.sendMessage(
    msg.chat.id,
    `💰 **Order Summary**\n\n🎟 Voucher: ₹${category.FaceValue}\n📦 Quantity: ${qty}\n💵 Price per code: ₹${price}\n\n👉 **Total: ₹${total}**\n\nProceed to payment.`,
    { parse_mode: 'Markdown' }
  );
});
