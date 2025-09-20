const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("./models/userModel");

const onlineUsers = new Map();

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", async (socket) => {
    try {
      console.log("🔌 New socket connection attempt");
      // Get JWT token from cookies
      const cookies = socket.handshake.headers.cookie;
      console.log("🍪 Cookies received:", cookies);
      const parsedCookies = cookie.parse(cookies || "");
      const token = parsedCookies.token;

      if (!token) {
        console.log("❌ No token found in cookies");
        return socket.disconnect();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.userId);

      if (!user) {
        console.log("❌ Invalid user from token");
        return socket.disconnect();
      }

      // Join the socket room based on the user's ID
      socket.user = user;
      socket.join(user._id.toString());
      onlineUsers.set(user._id.toString(), socket.id);
      console.log(`✅ User ${user.username} connected`);

      // Handle send-message
      socket.on("send-message", (message) => {
        const { sender, receiver } = message;

        if (onlineUsers.has(receiver)) {
          io.to(receiver).emit("receive-message", message);
        }

        io.to(sender).emit("receive-message", message);
      });

      // Typing indicators
      socket.on("typing", (room) => socket.to(room).emit("typing"));
      socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));

      socket.on("disconnect", () => {
        onlineUsers.delete(user._id.toString());
        console.log(`❌ User ${user.username} disconnected`);
      });
    } catch (err) {
      console.error("Socket error:", err.message);
      socket.disconnect();
    }
  });

  return io;
};

module.exports = setupSocket;
