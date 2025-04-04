const Post = require("../models/postModel");
const userModel = require("../models/userModel");

async function createPost(req, res) {
    console.log("User from request:", req.user); // ✅ Debugging log

    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const { content } = req.body;

        // Create new post
        const newPost = new Post({
            content,
            user: req.user._id,
            postpic: req.file ? req.file.path : "default.png",
        });

        await newPost.save();

        // ✅ Update the user's posts array
        await userModel.findByIdAndUpdate(
            req.user._id,
            { $push: { posts: newPost._id } }, // ✅ Add post to user
            { new: true }
        );

        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
}

async function getAllPosts(req, res) {
    try {
        console.log("Fetching all posts...");

        const posts = await Post.find()
        .populate("user", "username name email profilePic")
        // ✅ Include user profile picture
            .sort({ date: -1 });  // ✅ Latest posts first

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        console.log(`Posts fetched successfully: ${posts.length}`);
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

async function getUserPosts(req, res) {
    try {
        const { userId } = req.params;

        console.log(`Fetching posts for user: ${userId}`);

        const posts = await Post.find({ user: userId })
        .populate("user", "username name email profilePic")
        // ✅ Get user details
            .sort({ date: -1 });  // ✅ Newest first

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user" });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching user posts:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

async function updatePost(req, res) {
    try {
        const { postId } = req.params;
        const { content, postpic } = req.body; // ✅ Extract updated data

        // ✅ Find post by ID
        let post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // ✅ Check if the user is the owner of the post
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized to edit this post" });
        }

        // ✅ Update post fields
        post.content = content || post.content;
        post.postpic = postpic || post.postpic;

        await post.save(); // ✅ Save changes

        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

async function deletePost(req, res) {
    try {
        const { postId } = req.params;
        
        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the logged-in user is the post owner
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: Cannot delete this post" });
        }

        // Delete post
        await Post.findByIdAndDelete(postId);

        // Remove post from user's posts array
        await userModel.findByIdAndUpdate(req.user._id, {
            $pull: { posts: postId }
        });

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

async function likeUnlikePost(req, res) {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user has already liked the post
        const likedIndex = post.likes.indexOf(userId);

        if (likedIndex === -1) {
            // Like the post
            post.likes.push(userId);
            await post.save();
            return res.status(200).json({ message: "Post liked", post });
        } else {
            // Unlike the post
            post.likes.splice(likedIndex, 1);
            await post.save();
            return res.status(200).json({ message: "Post unliked", post });
        }
    } catch (error) {
        console.error("Error liking/unliking post:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

async function addComment(req, res) {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const newComment = {
            user: userId,
            text,
            date: new Date()
        };

        post.comments.push(newComment);
        await post.save();

        res.status(201).json({ message: "Comment added", post });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

module.exports = { createPost, getAllPosts, getUserPosts, updatePost, deletePost, likeUnlikePost, addComment};
