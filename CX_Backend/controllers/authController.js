const jwt = require("jsonwebtoken");
const Users = require("../models/userModel.js"); // Ensure correct path
require("dotenv").config();

async function verifyTokenForEmail(req, res) {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Users.findOneAndUpdate(
            { email: decoded.email },
            { isEmailVerified: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }
        
        return res.status(200).json({ message: "User Verified Successfully" });

    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(500).json({ message: "Invalid or expired token" });
    }
}

module.exports = { verifyTokenForEmail }; 
