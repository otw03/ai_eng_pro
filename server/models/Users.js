// models/User.js 파일 생성
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  kakaoId: String,
  username: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
