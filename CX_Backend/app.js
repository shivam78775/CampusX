const express = require('express');
const http = require('http'); // Required for socket server
const { Server } = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const postRouter = require("./routes/postRouter");
const { startServer } = require("./connection/DB");
require("./cron/cleanupUnverifiedUsers");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const server = http.createServer(app); // Create server
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }
});
app.set("io", io);

// Store connected users
let onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on("like-post", ({ postId }) => {
    socket.broadcast.emit("post-liked", { postId });
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/auth", authRouter);
app.get("/", (req, res) => {
  res.send("It's working");
});

startServer().then(() => {
  server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
}).catch((error) => {
  console.error("❌ Server failed to start:", error);
});
