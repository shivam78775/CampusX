const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../middlewares/sendVerificationEmail");
const userModel = require("../models/userModel");

async function register(req, res) {
    const { name, password, email } = req.body;
    try {
        const lowerName = name.toLowerCase();
        const lowerEmail = email.toLowerCase();

        // Check if user already exists and is verified
        const existingEmail = await userModel.findOne({ email: lowerEmail });

        if (existingEmail && existingEmail.isEmailVerified) {
            return res.status(400).send({ message: `Email: ${lowerEmail} Already Exists` });
        }

        // If user exists but is not verified, update and resend verification email
        if (existingEmail && !existingEmail.isEmailVerified) {
            existingEmail.name = lowerName;
            existingEmail.password = await bcrypt.hash(password, 10);
            existingEmail.resetToken = null;
            existingEmail.resetTokenExpiry = null;
            await existingEmail.save();

            await sendVerificationEmail(lowerEmail, lowerName);
            return res.status(200).send({ message: "Verification email resent. Please verify your account." });
        }

        // Validate password
        if (!password || password.length < 6) {
            return res.status(400).send({ message: "Password must be at least 6 characters long" });
        }

        // Create new user
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name: lowerName,
            email: lowerEmail,
            password: hashPassword,
            isEmailVerified: false, // Mark as unverified
        });

        await newUser.save();

        // Send verification email
        await sendVerificationEmail(lowerEmail, lowerName);
        return res.status(200).send({ message: "Verification email sent. Please verify your account." });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error", error });
    }
}

async function verifyUser(req, res) {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).send({ message: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select("-password"); // Fixed "Users" to "userModel"

        if (!user) return res.status(404).send({ message: "User not found" });

        res.status(200).send({
            message: "User Verified",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = { register, verifyUser };
