const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildConfig = require('../models/GuildConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('config')
    .setDescription('Cấu hình bot bảo vệ')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(s => s.setName('set_role').setDescription('Vai trò được tạo kênh/gửi link')
      .addRoleOption(o => o.setName('role').setDescription('Vai trò').setRequired(true)))
    .addSubcommand(s => s.setName('set_spam').setDescription('Tuỳ chỉnh chống spam')
      .addIntegerOption(o => o.setName('so_lan').setDescription('Số tin nhắn').setRequired(true))
      .addIntegerOption(o => o.setName('giay').setDescription('Trong X giây').setRequired(true))
      .addIntegerOption(o => o.setName('phut_mute').setDescription('Mute bao nhiêu phút').setRequired(true))),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    let config = await GuildConfig.findOne({ guildId: interaction.guild.id });
    if (!config) config = await GuildConfig.create({ guildId: interaction.guild.id });

    if (sub === 'set_role') {
      const role = interaction.options.getRole('role');
      config.allowedRoleId = role.id;
      await config.save();
      return interaction.reply(`✅ Vai trò **${role.name}** giờ được phép tạo kênh/gửi link.`);
    }

    if (sub === 'set_spam') {
      config.spamLimit = interaction.options.getInteger('so_lan');
      config.spamInterval = interaction.options.getInteger('giay') * 1000;
      config.muteDuration = interaction.options.getInteger('phut_mute') * 60 * 1000;
      await config.save();
      return interaction.reply('✅ Đã cập nhật cấu hình chống spam.');
    }
  }
};
