// models/Notification.js
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");

const notificationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuid,
    },
    sender: {
      type: String,
      ref: "User",
      required: true,
    },
    receiver: {
      type: String,
      ref: "User",
      required: true,
    },
    type: {
      type: String, // "like", "comment", "follow", "message", "reminder"
      required: true,
    },
    post: {
      type: String,
      ref: "Post",
    },
    message: {
      type: String,
      ref: "Message",
    },
    content: {
      type: String, // For storing additional context like comment text, message preview
    },
    isRead: { 
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
