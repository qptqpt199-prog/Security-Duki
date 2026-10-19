const mongoose = require('mongoose');

const warnSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  moderatorId: { type: String, required: true },
  reason: { type: String, default: 'Không có lý do' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Warn', warnSchema);
