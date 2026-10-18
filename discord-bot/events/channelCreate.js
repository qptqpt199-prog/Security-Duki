const { AuditLogEvent } = require('discord.js');
const GuildConfig = require('../models/GuildConfig');

module.exports = {
  name: 'channelCreate',
  async execute(channel) {
    if (!channel.guild) return;
    const config = await GuildConfig.findOne({ guildId: channel.guild.id });
    if (!config?.allowedRoleId) return;

    const logs = await channel.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelCreate, limit: 1 }).catch(() => null);
    const entry = logs?.entries.first();
    if (!entry || entry.target.id !== channel.id) return;

    const executor = entry.executor;
    if (executor.bot) return; // bot tự tạo -> cho phép

    const member = await channel.guild.members.fetch(executor.id).catch(() => null);
    if (!member) return;

    const ok = member.roles.cache.has(config.allowedRoleId) || member.permissions.has('Administrator');
    if (!ok) {
      await channel.delete(`${executor.tag} không có quyền tạo kênh`).catch(() => {});
      executor.send(`⚠️ Bạn không có quyền tạo kênh trong **${channel.guild.name}**, kênh đã bị xoá.`).catch(() => {});
    }
  }
};
