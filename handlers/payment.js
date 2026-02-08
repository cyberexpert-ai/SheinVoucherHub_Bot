const bot = global.bot;
const crypto = require('crypto');

const { createOrder } = require('../database/orders');
const { reduceStock } = require('../database/categories');
const { addRisk } = require('../database/users');
const { blockUser } = require('../database/blocks');
const { isUtrUsed, isScreenshotUsed, hashScreenshot } = require('../utils/antiFraud');

const payState = new Map();

function genOrderId() {
  return `SVH-${Date.now().toString(36).toUpperCase()}`;
}

bot.on('message', async msg => {
  const userId = msg.from.id;
  if (!payState.has(userId)) return;
  const st = payState.get(userId);

  if (!st.ss && msg.photo) {
    const fid = msg.photo.at(-1).file_id;
    if (await isScreenshotUsed(fid)) {
      await addRisk(userId, 3);
      await blockUser({ userId, reason: "Screenshot reuse" });
      payState.delete(userId);
      return bot.sendMessage(msg.chat.id, "⛔ Fraud detected");
    }
    st.ss = fid;
    st.hash = hashScreenshot(fid);
    return bot.sendMessage(msg.chat.id, "Send UTR");
  }

  if (st.ss && msg.text) {
    const utr = msg.text.trim();
    if (await isUtrUsed(utr)) {
      await addRisk(userId, 3);
      await blockUser({ userId, reason: "UTR reuse" });
      payState.delete(userId);
      return bot.sendMessage(msg.chat.id, "⛔ Fraud detected");
    }

    const orderId = genOrderId();

    await createOrder({
      orderId,
      userId,
      username: msg.from.username || '',
      category: st.category,
      quantity: st.qty,
      amount: st.total,
      utr,
      ScreenshotHash: st.hash
    });

    await reduceStock(st.category, st.qty);

    bot.sendMessage(msg.chat.id, `✅ Order submitted\n${orderId}`);
    payState.delete(userId);
  }
});
