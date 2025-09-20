const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilepic: {
    type: String,
  },
  coverpic: {
    type: String,
    default: "default.png",
  },
  bio: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  totalLikes: {
    type: Number,
    default: 0,
  },
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpiry: {
    type: Date,
    default: null,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Users = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = Users;
