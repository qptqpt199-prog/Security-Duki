const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  allowedRoleId: { type: String, default: null },   // vai trò được tạo kênh / gửi link
  spamLimit: { type: Number, default: 5 },           // số tin nhắn tối đa
  spamInterval: { type: Number, default: 7000 },     // khoảng thời gian tính spam (ms)
  muteDuration: { type: Number, default: 3600000 }   // thời gian mute mặc định = 1 giờ
});

module.exports = mongoose.model('GuildConfig', schema);
