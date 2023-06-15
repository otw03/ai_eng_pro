const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  name: String,
  email: String,
  snsId: { type: String, unique: true, sparse: true },
  provider: { type: String, default: "local" },
  // confirmPassword: String,
});

// passportLocalMongoose
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);