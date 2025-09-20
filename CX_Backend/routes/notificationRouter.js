const express = require("express");
const {
  createNotification,
  getNotifications,
  markAsRead,
  getUnreadCount,
  getUnreadMessageCount,
  markMessagesAsRead,
} = require("../controllers/notificationController");
const requireAuth = require("../middlewares/userAuth")
const router = express.Router();

router.post("/", requireAuth, (req, res) => {
  const io = req.app.get("io");
  req.io = io; // pass io to controller
  createNotification(req, res);
});

router.get("/", requireAuth, getNotifications);
router.get("/unread-count", requireAuth, getUnreadCount);
router.get("/unread-messages", requireAuth, getUnreadMessageCount);
router.put("/mark-read", requireAuth, markAsRead);
router.put("/mark-messages-read/:senderId", requireAuth, markMessagesAsRead);

module.exports = router;
