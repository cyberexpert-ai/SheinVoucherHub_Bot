/**
 * admin/discounts.js
 * Admin discount coupon management
 */

const bot = global.bot;
const ADMIN_ID = global.ADMIN_ID;
const {
  createCoupon,
  expireCoupon,
  getCoupon
} = require('../database/discountCoupons');

// Simple admin check
function isAdmin(id) {
  return id === ADMIN_ID;
}

// Open discount panel
bot.on('callback_query', async (q) => {
  if (q.data !== 'admin_discounts') return;
  if (!isAdmin(q.from.id)) return;

  bot.answerCallbackQuery(q.id);

  bot.sendMessage(
    q.message.chat.id,
    "🎟 **Discount Coupons Panel**\n\nChoose an action:",
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "➕ Create Coupon", callback_data: "disc_create" }],
          [{ text: "⛔ Expire Coupon", callback_data: "disc_expire" }]
        ]
      }
    }
  );
});

// Temporary state for creation
const createState = new Map();

// Start create flow
bot.on('callback_query', async (q) => {
  if (q.data !== 'disc_create') return;
  if (!isAdmin(q.from.id)) return;

  createState.set(q.from.id, { step: 'code' });
  bot.answerCallbackQuery(q.id);

  bot.sendMessage(
    q.message.chat.id,
    "➕ **Create Discount Coupon**\n\nSend coupon code (example: SVH50OFF)"
  );
});

// Handle create steps
bot.on('message', async (msg) => {
  const userId = msg.from.id;
  if (!isAdmin(userId)) return;
  if (!createState.has(userId)) return;

  const state = createState.get(userId);

  // Step 1: Code
  if (state.step === 'code') {
    state.code = msg.text.trim().toUpperCase();
    state.step = 'type';
    createState.set(userId, state);

    return bot.sendMessage(
      msg.chat.id,
      "Select discount type:",
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "₹ Flat", callback_data: "disc_type_flat" },
              { text: "% Percent", callback_data: "disc_type_percent" }
            ]
          ]
        }
      }
    );
  }
});

// Handle type selection
bot.on('callback_query', async (q) => {
  if (!q.data.startsWith('disc_type_')) return;
  if (!isAdmin(q.from.id)) return;

  const state = createState.get(q.from.id);
  if (!state) return;

  state.type = q.data === 'disc_type_flat' ? 'FLAT' : 'PERCENT';
  state.step = 'value';
  createState.set(q.from.id, state);

  bot.answerCallbackQuery(q.id);
  bot.sendMessage(q.message.chat.id, "Enter discount value (number):");
});

// Value step
bot.on('message', async (msg) => {
  const userId = msg.from.id;
  if (!isAdmin(userId)) return;

  const state = createState.get(userId);
  if (!state || state.step !== 'value') return;

  const value = Number(msg.text);
  if (isNaN(value) || value <= 0) {
    return bot.sendMessage(msg.chat.id, "❌ Enter a valid number.");
  }

  state.value = value;
  state.step = 'confirm';
  createState.set(userId, state);

  bot.sendMessage(
    msg.chat.id,
    `✅ **Confirm Coupon**\n\n` +
    `Code: ${state.code}\n` +
    `Type: ${state.type}\n` +
    `Value: ${state.value}\n\nCreate this coupon?`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "✅ Confirm", callback_data: "disc_confirm" }],
          [{ text: "❌ Cancel", callback_data: "disc_cancel" }]
        ]
      }
    }
  );
});

// Confirm / Cancel
bot.on('callback_query', async (q) => {
  if (!q.data.startsWith('disc_')) return;
  if (!isAdmin(q.from.id)) return;

  const state = createState.get(q.from.id);
  if (!state) return;

  if (q.data === 'disc_confirm') {
    await createCoupon({
      code: state.code,
      type: state.type,
      value: state.value,
      usageLimit: 1
    });

    createState.delete(q.from.id);
    bot.answerCallbackQuery(q.id);
    return bot.sendMessage(q.message.chat.id, "🎉 Coupon created successfully!");
  }

  if (q.data === 'disc_cancel') {
    createState.delete(q.from.id);
    bot.answerCallbackQuery(q.id);
    return bot.sendMessage(q.message.chat.id, "❌ Coupon creation cancelled.");
  }
});

// Expire coupon
bot.on('callback_query', async (q) => {
  if (q.data !== 'disc_expire') return;
  if (!isAdmin(q.from.id)) return;

  bot.answerCallbackQuery(q.id);
  bot.sendMessage(q.message.chat.id, "⛔ Send coupon code to expire:");
});

bot.on('message', async (msg) => {
  const userId = msg.from.id;
  if (!isAdmin(userId)) return;
  if (!msg.text) return;

  const code = msg.text.trim().toUpperCase();
  const coupon = await getCoupon(code);
  if (!coupon) return;

  await expireCoupon(code);
  bot.sendMessage(msg.chat.id, `⛔ Coupon expired: ${code}`);
});
