const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
  type: { type: String, default: 'text' }, // 'text', 'post_share', etc.
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
});

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);
