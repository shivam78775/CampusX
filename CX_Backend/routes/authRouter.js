const express = require("express");
const { verifyTokenForEmail } = require("../controllers/authController.js");

const authRouter = express.Router();

authRouter.post("/verify-token", verifyTokenForEmail);

module.exports = authRouter;
