const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  guildId: { type: String, required: true },
  botId: { type: String, required: true },
  addedBy: { type: String, required: true },
  reason: { type: String, default: 'Không có lý do' },
  createdAt: { type: Date, default: Date.now }
});

schema.index({ guildId: 1, botId: 1 }, { unique: true });
module.exports = mongoose.model('Blacklist', schema);
