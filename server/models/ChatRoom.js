const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  conversation: [
    {
      role: String,
      content: String,
    },
  ],
  summarizedConversationHistory: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
