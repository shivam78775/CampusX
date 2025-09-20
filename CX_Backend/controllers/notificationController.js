const Notification = require("../models/notification");
const Message = require("../models/message");

exports.createNotification = async (req, res) => {
  try {
    const { sender, receiver, type, post, message, content } = req.body;

    if (sender === receiver) return res.status(400).json({ error: "Invalid action" });

    const newNotification = await Notification.create({ 
      sender, 
      receiver, 
      type, 
      post, 
      message, 
      content 
    });

    // Populate the notification for real-time emission
    const populatedNotification = await Notification.findById(newNotification._id)
      .populate("sender", "username profilepic")
      .populate("post", "postpic")
      .populate("message", "content");

    req.io.to(receiver).emit("new_notification", populatedNotification);

    res.status(201).json(populatedNotification);
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ error: "Failed to create notification" });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ receiver: req.user.id })
      .populate("sender", "username profilepic")
      .populate("post", "postpic")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { receiver: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({ 
      receiver: req.user.id, 
      isRead: false 
    });
    res.json({ unreadCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to get unread count" });
  }
};

exports.getUnreadMessageCount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get unread message count for each conversation
    const unreadMessages = await Message.aggregate([
      {
        $match: {
          receiver: userId,
          isRead: false
        }
      },
      {
        $group: {
          _id: "$sender",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "senderInfo"
        }
      },
      {
        $project: {
          senderId: "$_id",
          senderUsername: { $arrayElemAt: ["$senderInfo.username", 0] },
          senderProfilePic: { $arrayElemAt: ["$senderInfo.profilepic", 0] },
          unreadCount: "$count"
        }
      }
    ]);

    const totalUnreadCount = unreadMessages.reduce((total, item) => total + item.unreadCount, 0);

    res.json({ 
      totalUnreadCount,
      unreadMessages 
    });
  } catch (err) {
    console.error("Error getting unread message count:", err);
    res.status(500).json({ error: "Failed to get unread message count" });
  }
};

exports.markMessagesAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    const userId = req.user.id;

    await Message.updateMany(
      { sender: senderId, receiver: userId, isRead: false },
      { 
        $set: { 
          isRead: true, 
          readAt: new Date() 
        } 
      }
    );

    res.json({ message: "Messages marked as read" });
  } catch (err) {
    console.error("Error marking messages as read:", err);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
};
