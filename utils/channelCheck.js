module.exports = async (bot, userId, channels = []) => {
  try {
    for (const channel of channels) {
      const member = await bot.getChatMember(channel, userId);
      if (!["member", "administrator", "creator"].includes(member.status)) {
        return false;
      }
    }
    return true;
  } catch (e) {
    return false;
  }
};
