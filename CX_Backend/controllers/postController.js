const postModel = require("../models/postModel");
const Post = require("../models/postModel");
const userModel = require("../models/userModel");

async function createPost(req, res) {
  console.log("User from request:", req.user); // ✅ Debugging log

  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const { content, isAnonymous } = req.body;

    let imageUrl; // Fallback if no image

    if (req.file && req.file.path) {
      // Multer + Cloudinary stores image info in req.file.path
      imageUrl = req.file.path; // This is already the Cloudinary secure_url if you're using cloudinaryStorage
    }

    const newPost = new Post({
      content,
      user: req.user._id,
      postpic: imageUrl,
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
    });

    await newPost.save();

    // Update user's post list
    await userModel.findByIdAndUpdate(
      req.user._id,
      { $push: { posts: newPost._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Error in createPost:", error);
    res.status(500).json({ message: "Server error", error });
  }
}

module.exports = { createPost };

async function getPostById (req, res){
    try {
      const { postId } = req.params;
      const post = await postModel.findById(postId)
        .populate("user", "username name profilepic")
        .populate("comments.user", "username name profilepic");
  
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      res.status(200).json(post);
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  

async function getAllPosts(req, res) {
    try {
        console.log("Fetching all posts...");

        const posts = await Post.find()
        .populate("user", "username name email profilepic")
        .populate("comments.user", "username name profilepic")
        .sort({ date: 1 });  // ✅ Oldest posts first

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No posts found" });
        }

        // Add some randomization to the order
        const shuffledPosts = posts.sort(() => Math.random() - 0.5);

        console.log(`Posts fetched successfully: ${shuffledPosts.length}`);
        res.status(200).json(shuffledPosts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

async function getAnonymousPosts(req, res) {
    try {
        console.log("Fetching anonymous posts...");

        const posts = await Post.find({ isAnonymous: true })
        .populate("user", "username name email profilepic")
        .populate("comments.user", "username name profilepic")
        .sort({ date: 1 });  // Oldest posts first

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "No anonymous posts found" });
        }

        // Add some randomization to the order
        const shuffledPosts = posts.sort(() => Math.random() - 0.5);

        console.log(`Anonymous posts fetched successfully: ${shuffledPosts.length}`);
        res.status(200).json(shuffledPosts);
    } catch (error) {
        console.error("Error fetching anonymous posts:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

async function getUserPosts(req, res) {
    try {
        const { userId } = req.params;

        console.log(`Fetching posts for user: ${userId}`);

        const posts = await Post.find({ user: userId })
        .populate("user", "username name email profilePic")
        .populate("comments.user", "username name profilepic")
        .sort({ date: 1 });  // Oldest first

        // Filter out anonymous posts
        const nonAnonymousPosts = posts.filter(post => !post.isAnonymous);

        if (!nonAnonymousPosts || nonAnonymousPosts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user" });
        }

        // Add some randomization to the order
        const shuffledPosts = nonAnonymousPosts.sort(() => Math.random() - 0.5);

        res.status(200).json(shuffledPosts);
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

        const post = await Post.findById(postId).populate("user").populate("comments");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const likedIndex = post.likes.indexOf(userId.toString());

        if (likedIndex === -1) {
            post.likes.push(userId);
            
            // Create notification for like (only if not liking own post)
            if (post.user._id.toString() !== userId.toString()) {
                const Notification = require("../models/notification");
                const io = req.app.get("io");
                
                const notification = await Notification.create({
                    sender: userId,
                    receiver: post.user._id,
                    type: "like",
                    post: postId
                });

                const populatedNotification = await Notification.findById(notification._id)
                    .populate("sender", "username profilepic")
                    .populate("post", "postpic");

                io.to(post.user._id.toString()).emit("new_notification", populatedNotification);
            }
        } else {
            post.likes.splice(likedIndex, 1);
        }

        await post.save();

        // Real-time emit using io
        const io = req.app.get("io"); // Get io instance set in server.js
        io.emit("post-liked", {
            postId: post._id,
            updatedLikes: post.likes,
        });

        return res.status(200).json({
            message: likedIndex === -1 ? "Post liked" : "Post unliked",
            likes: post.likes,
            postId: post._id
        });
    } catch (error) {  
        console.error("Error liking/unliking post:", error.message);
        console.error(error.stack); // logs full trace
        res.status(500).json({ message: "Server error", error: error.message });
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

        const post = await Post.findById(postId).populate("user");
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

        // Populate the new comment with user data
        const populatedPost = await Post.findById(postId)
            .populate("comments.user", "username name profilepic");

        const addedComment = populatedPost.comments[populatedPost.comments.length - 1];

        // Create notification for comment (only if not commenting on own post)
        if (post.user._id.toString() !== userId.toString()) {
            const Notification = require("../models/notification");
            const io = req.app.get("io");
            
            const notification = await Notification.create({
                sender: userId,
                receiver: post.user._id,
                type: "comment",
                post: postId,
                content: text.substring(0, 100) // Store first 100 chars of comment
            });

            const populatedNotification = await Notification.findById(notification._id)
                .populate("sender", "username profilepic")
                .populate("post", "postpic");

            io.to(post.user._id.toString()).emit("new_notification", populatedNotification);
        }

        res.status(201).json({ message: "Comment added", comment: addedComment });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Server error", error });
    }
}

module.exports = { createPost, getAllPosts, getAnonymousPosts, getUserPosts, updatePost, deletePost, likeUnlikePost, addComment, getPostById};
