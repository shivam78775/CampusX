const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyUser = async (req, res, next) => {
    try {
        // Extract token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);

        // Find user in database
        const user = await userModel.findById(decoded.userid).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach user to request object
        req.user = user;
        next(); 
    } catch (error) {
        console.error("Authentication Error:", error);
        res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
};

module.exports = verifyUser;
