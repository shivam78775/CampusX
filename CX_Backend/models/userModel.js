const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    default: () => uuidv4(), // Generates unique user ID
    unique: true,
  },
  name: {
    type: String,
    required: true, // User's name
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true, // Index for faster lookups
  },
  password: {
    type: String,
    required: true, // Hashed password
  },
  profilepic: {
    type: String,
    default: "default.png" // Default profile picture
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post" // Refers to Post model
  }],
  resetToken: {
    type: String,
    default: null, // Token for password reset
  },
  resetTokenExpiry: {
    type: Date,
    default: null, // Token expiration time
  },
  isEmailVerified: {
    type: Boolean,
    default: false, // Email verification status
  },
}, { timestamps: true });

const Users = mongoose.model("User", userSchema);
module.exports = Users;  
