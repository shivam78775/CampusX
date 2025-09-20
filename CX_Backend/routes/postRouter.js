const express = require('express');
const {
  createPost,
  getAllPosts,
  getAnonymousPosts,
  getUserPosts,
  updatePost,
  deletePost,
  likeUnlikePost,
  addComment,
  getPostById
} = require('../controllers/postController');
const { verifyUser } = require('../controllers/userController');
const { upload } = require('../config/cloudinary');

const postRouter = express.Router();


postRouter.get('/all', verifyUser, getAllPosts);
postRouter.get('/anonymous', verifyUser, getAnonymousPosts);
postRouter.post('/create', verifyUser, upload.single('postpic'), createPost);
postRouter.get('/user/:userId', verifyUser, getUserPosts);
postRouter.get("/:postId", verifyUser, getPostById);
postRouter.put('/update/:postId', verifyUser, updatePost);
postRouter.delete('/delete/:postId', verifyUser, deletePost);
postRouter.post('/like-unlike/:postId', verifyUser, likeUnlikePost);
postRouter.post('/comment/:postId', verifyUser, addComment);

module.exports = postRouter;
