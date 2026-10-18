const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const Blacklist = require('../models/Blacklist');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bl')
    .setDescription('Quản lý danh sách đen bot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(s => s.setName('add').setDescription('Thêm bot vào blacklist')
      .addStringOption(o => o.setName('bot_id').setDescription('ID bot').setRequired(true))
      .addStringOption(o => o.setName('ly_do').setDescription('Lý do').setRequired(false)))
    .addSubcommand(s => s.setName('remove').setDescription('Gỡ bot khỏi blacklist')
      .addStringOption(o => o.setName('bot_id').setDescription('ID bot').setRequired(true)))
    .addSubcommand(s => s.setName('list').setDescription('Xem danh sách đen')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    if (sub === 'add') {
      const botId = interaction.options.getString('bot_id');
      const reason = interaction.options.getString('ly_do') || 'Không có lý do';
      try {
        await Blacklist.create({ guildId, botId, addedBy: interaction.user.id, reason });
        const member = await interaction.guild.members.fetch(botId).catch(() => null);
        if (member) await member.kick('Đã bị thêm vào danh sách đen').catch(() => {});
        return interaction.reply(`✅ Đã thêm bot \`${botId}\` vào blacklist.`);
      } catch (err) {
        if (err.code === 11000) return interaction.reply({ content: '⚠️ Bot đã có trong danh sách.', ephemeral: true });
        console.error(err);
        return interaction.reply({ content: '❌ Lỗi xảy ra.', ephemeral: true });
      }
    }

    if (sub === 'remove') {
      const botId = interaction.options.getString('bot_id');
      const deleted = await Blacklist.findOneAndDelete({ guildId, botId });
      if (!deleted) return interaction.reply({ content: '⚠️ Không tìm thấy.', ephemeral: true });
      return interaction.reply(`✅ Đã gỡ bot \`${botId}\`.`);
    }

    if (sub === 'list') {
      const list = await Blacklist.find({ guildId });
      if (!list.length) return interaction.reply('📋 Danh sách trống.');
      const embed = new EmbedBuilder()
        .setTitle('📋 Danh sách đen bot')
        .setColor('Red')
        .setDescription(list.map(b => `• \`${b.botId}\` - ${b.reason}`).join('\n'));
      return interaction.reply({ embeds: [embed] });
    }
  }
};
