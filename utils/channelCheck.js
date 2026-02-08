module.exports = async function isJoined(bot, userId) {
  try {
    const ch1 = await bot.getChatMember("@SheinVoucherHub", userId);
    const ch2 = await bot.getChatMember("@OrdersNotify", userId);

    const ok1 = ["member", "administrator", "creator"].includes(ch1.status);
    const ok2 = ["member", "administrator", "creator"].includes(ch2.status);

    return ok1 && ok2;
  } catch (e) {
    return false;
  }
};
