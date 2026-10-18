const Blacklist = require('../models/Blacklist');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    if (!member.user.bot) return; // chỉ check bot

    const blocked = await Blacklist.findOne({ guildId: member.guild.id, botId: member.user.id });
    if (blocked) {
      await member.kick(`Bot trong blacklist: ${blocked.reason}`).catch(() => {});
      console.log(`🚫 Đã kick bot ${member.user.tag}`);
    }
  }
};
