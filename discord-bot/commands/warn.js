const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Warn = require('../models/Warn');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Quản lý cảnh cáo thành viên')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Cảnh cáo một thành viên')
        .addUserOption(opt =>
          opt.setName('user').setDescription('Người bị cảnh cáo').setRequired(true))
        .addStringOption(opt =>
          opt.setName('reason').setDescription('Lý do cảnh cáo').setRequired(false)))
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('Xem danh sách cảnh cáo của một thành viên')
        .addUserOption(opt =>
          opt.setName('user').setDescription('Người cần xem').setRequired(true)))
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Gỡ cảnh cáo gần nhất của một thành viên')
        .addUserOption(opt =>
          opt.setName('user').setDescription('Người cần gỡ cảnh cáo').setRequired(true))),

  async execute(interaction) {
    const hasPermission =
      interaction.member.permissions.has(PermissionFlagsBits.KickMembers) ||
      interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers);

    if (!hasPermission) {
      return interaction.reply({ content: 'Bạn không có quyền dùng lệnh này.', ephemeral: true });
    }

    const sub = interaction.options.getSubcommand();
    const targetUser = interaction.options.getUser('user');

    if (sub === 'add') {
      const reason = interaction.options.getString('reason') || 'Không có lý do';

      await Warn.create({
        guildId: interaction.guild.id,
        userId: targetUser.id,
        moderatorId: interaction.user.id,
        reason
      });

      const count = await Warn.countDocuments({
        guildId: interaction.guild.id,
        userId: targetUser.id
      });

      await interaction.reply(`Đã cảnh cáo ${targetUser.tag}. Lý do: ${reason}. Tổng số lần: ${count}.`);

      const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
      if (!member) return;

      if (count === 3) {
        await member.timeout(60 * 60 * 1000, 'Đạt 3 lần cảnh cáo').catch(() => {});
        await interaction.followUp(`${targetUser.tag} đã bị mute 1 giờ do đạt 3 lần cảnh cáo.`);
      }

      if (count === 5) {
        await member.kick('Đạt 5 lần cảnh cáo').catch(() => {});
        await interaction.followUp(`${targetUser.tag} đã bị kick do đạt 5 lần cảnh cáo.`);
      }
    }

    if (sub === 'list') {
      const warns = await Warn.find({
        guildId: interaction.guild.id,
        userId: targetUser.id
      }).sort({ createdAt: -1 });

      if (warns.length === 0) {
        return interaction.reply(`${targetUser.tag} chưa bị cảnh cáo lần nào.`);
      }

      const lines = warns.map((w, i) =>
        `${i + 1}. ${w.reason} — <t:${Math.floor(w.createdAt.getTime() / 1000)}:R>`
      );

      await interaction.reply(`Lịch sử cảnh cáo của ${targetUser.tag} (${warns.length} lần):\n${lines.join('\n')}`);
    }

    if (sub === 'remove') {
      const lastWarn = await Warn.findOne({
        guildId: interaction.guild.id,
        userId: targetUser.id
      }).sort({ createdAt: -1 });

      if (!lastWarn) {
        return interaction.reply(`${targetUser.tag} không có cảnh cáo nào để gỡ.`);
      }

      await Warn.deleteOne({ _id: lastWarn._id });
      await interaction.reply(`Đã gỡ 1 cảnh cáo gần nhất của ${targetUser.tag}.`);
    }
  }
};
