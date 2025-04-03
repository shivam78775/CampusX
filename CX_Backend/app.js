const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authRouter");
const postRouter = require("./routes/postRouter");
const { startServer } = require("./connection/DB");  

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
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
    app.listen(PORT, () => console.log(`🚀 Server started at Port ${PORT}`));
}).catch((error) => {
    console.error("❌ Server could not start:", error);
});
