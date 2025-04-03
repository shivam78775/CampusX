const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
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

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const lowerEmail = email.toLowerCase();
        const user = await userModel.findOne({ email: lowerEmail });

        if (!user) {
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        if (!user.isEmailVerified) {
            return res.status(401).send({ message: "Please verify your email to login" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "None",
            domain: process.env.NODE_ENV === "development" ? "localhost" : process.env.DOMAIN,
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).send({
            message: "Login Successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                tasksAssigned: user.tasksAssigned,
            },
        });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).send({ message: "Server error", error });
    }
}

function logOut(req, res){
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(0),
    });
    res.status(200).send({ message: "Logged out successfully" });
};
async function verifyUser(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // ✅ Set req.user so next middleware can access it
        next(); // ✅ Call next() to continue to createPost
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}



async function resetPasswordRequest(req, res) {
    const { email } = req.body;

    try {
        const lowerEmail = email.toLowerCase();
        const user = await userModel.findOne({ email: lowerEmail });

        if (!user) {
            return res.status(404).send({ message: "User Not Found" });
        }

        const resetToken = jwt.sign({ email: lowerEmail }, process.env.JWT_SECRET, {
            expiresIn: "15m",
        });

        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: lowerEmail,
            subject: "Reset Your Password",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h2>Password Reset Request</h2>
                    <p>Click the link below to reset your password. The link will expire in 15 minutes:</p>
                    <a href="${resetLink}" style="background:black; color: white; padding: 10px 20px; text-decoration: none;">
                        Reset Password
                    </a>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).send({ message: "Password reset link sent to your email" });

    } catch (error) {
        console.error("Reset Password Request Error:", error);
        return res.status(500).send({ message: "Error sending password reset email", error });
    }
}

async function resetPassword(req, res) {
    const { token, newPassword } = req.body;

    try {
        if (!token) {
            return res.status(401).send({ message: "Token Not Found" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({
            email: decoded.email,
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).send({ message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        return res.status(200).send({ message: "Password reset successfully" });

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(400).send({ message: "Token expired" });
        }
        console.error("Reset Password Error:", error);
        return res.status(500).send({ message: "Error resetting password", error });
    }
}


module.exports = { register, verifyUser, login, logOut, resetPasswordRequest, resetPassword};
