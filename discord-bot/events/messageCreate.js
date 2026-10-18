const GuildConfig = require('../models/GuildConfig');
const { trackMessage, cleanOldMessages, resetUser } = require('../utils/spamTracker');

const LINK_REGEX = /(https?:\/\/[^\s]+)|(discord\.gg\/[^\s]+)|(www\.[^\s]+)/gi;

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot || !message.guild || !message.member) return;
    if (message.member.permissions.has('Administrator')) return;

    let config = await GuildConfig.findOne({ guildId: message.guild.id });
    if (!config) config = await GuildConfig.create({ guildId: message.guild.id });

    const hasRole = config.allowedRoleId ? message.member.roles.cache.has(config.allowedRoleId) : false;

    // Chặn link
    if (config.allowedRoleId && !hasRole && LINK_REGEX.test(message.content)) {
      await message.delete().catch(() => {});
      const warn = await message.channel.send(`⚠️ ${message.member}, bạn không có quyền gửi link.`);
      setTimeout(() => warn.delete().catch(() => {}), 5000);
      return;
    }

    // Chống spam
    trackMessage(message.author.id);
    const recent = cleanOldMessages(message.author.id, config.spamInterval);

    if (recent.length >= config.spamLimit) {
      resetUser(message.author.id);
      try {
        await message.member.timeout(config.muteDuration, 'Spam tin nhắn');
        const warn = await message.channel.send(`🔇 ${message.member} bị mute ${config.muteDuration / 60000} phút vì spam.`);
        setTimeout(() => warn.delete().catch(() => {}), 7000);
      } catch (err) { console.error(err); }
    }
  }
};
