const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  conversation: [
    {
      role: String,
      content: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
