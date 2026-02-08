module.exports = async function isJoined(bot, userId, channel) {
  try {
    const res = await bot.getChatMember(channel, userId);
    return ["member", "administrator", "creator"].includes(res.status);
  } catch (e) {
    return false;
  }
};
