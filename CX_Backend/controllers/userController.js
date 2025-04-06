const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const { sendVerificationEmail } = require("../middlewares/sendVerificationEmail");
const userModel = require("../models/userModel");
const postModel = require("../models/postModel");

async function register(req, res) {
    const { name, username, password, email } = req.body;

    try {
        const lowerName = name.toLowerCase();
        const lowerEmail = email.toLowerCase();
        const lowerUsername = username.toLowerCase();

        // Validate password
        if (!password || password.length < 6) {
            return res.status(400).send({ message: "Password must be at least 6 characters long" });
        }

        // Check if email already exists
        const existingEmail = await userModel.findOne({ email: lowerEmail });

        if (existingEmail) {
            if (existingEmail.isEmailVerified) {
                return res.status(400).send({ message: `Email: ${lowerEmail} already exists` });
            } else {
                // Check if the username is taken by someone else (exclude current user)
                const usernameTaken = await userModel.findOne({
                    username: lowerUsername,
                    _id: { $ne: existingEmail._id }
                });
                if (usernameTaken) {
                    return res.status(400).send({ message: `Username: ${lowerUsername} is already taken` });
                }

                // Update existing unverified user
                existingEmail.name = lowerName;
                existingEmail.username = lowerUsername;
                existingEmail.password = await bcrypt.hash(password, 10);
                existingEmail.resetToken = null;
                existingEmail.resetTokenExpiry = null;
                await existingEmail.save();

                await sendVerificationEmail(lowerEmail, lowerName);
                return res.status(200).send({ message: "Verification email resent. Please verify your account." });
            }
        }

        // Check if username is taken (only now for new users)
        const existingUsername = await userModel.findOne({ username: lowerUsername });
        if (existingUsername) {
            return res.status(400).send({ message: `Username: ${lowerUsername} already exists` });
        }

        // Create new user
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name: lowerName,
            username: lowerUsername,
            email: lowerEmail,
            password: hashPassword,
            isEmailVerified: false,
        });

        await newUser.save();
        await sendVerificationEmail(lowerEmail, lowerName);

        return res.status(200).send({ message: "Verification email sent. Please verify your account." });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "Server error", error });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in production
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send response
        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


function logOut(req, res) {
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

    if (!token || !newPassword) {
        return res.status(400).send({ message: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
        return res.status(400).send({ message: "Password must be at least 6 characters" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        const user = await userModel.findOne({
            email: decoded.email,
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            console.error("User not found or token expired");
            return res.status(400).send({ message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;

        try {
            await user.save();
            return res.status(200).send({ message: "Password reset successfully" });
        } catch (saveError) {
            console.error("Error saving user:", saveError);
            return res.status(500).send({ message: "Error saving user", error: saveError });
        }

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(400).send({ message: "Token has expired" });
        }
        console.error("Reset Password Error:", error);
        return res.status(500).send({ message: "Internal Server Error", error });
    }
}

async function getUserProfile(req, res) {
    try {
        const { username } = req.params;

        const user = await userModel.findOne({ username })
            .select('username name profilepic followers following posts')
            .populate('posts', '_id');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const posts = await postModel.find({ user: user._id })
            .sort({ date: -1 })
            .select('_id content postpic likes comments date');

        const formattedPosts = posts.map(post => ({
            _id: post._id,
            caption: post.content,
            postpic: post.postpic,
            likes: post.likes.length,
            commentsCount: post.comments.length,
            createdAt: post.createdAt
        }));

        res.status(200).json({
            user: {
                username: user.username,
                name: user.name,
                profilepic: user.profilepic,
                followersCount: user.followers.length,
                followingCount: user.following.length,
                postsCount: user.posts.length
            },
            posts: formattedPosts
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

async function searchUser(req, res) {
    const { username } = req.query;
    if (!username) return res.json([]);
  
    try {
      console.log("🔍 Searching for username:", username);
  
      const users = await userModel.find({
        username: { $regex: username.trim(), $options: 'i' }, // 👈 Partial + case-insensitive
      }).select("username name profilepic");
  
      console.log("✅ Users found:", users.length);
      res.json(users);
    } catch (err) {
      console.error("❌ Error searching user:", err);
      res.status(500).json([]);
    }
  }
  
  



module.exports = { register, verifyUser, login, logOut, resetPasswordRequest, resetPassword, getUserProfile, searchUser };
