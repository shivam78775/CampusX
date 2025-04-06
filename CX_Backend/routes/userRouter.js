const express = require('express');
const { register, verifyUser, login, logOut, resetPasswordRequest, resetPassword, getUserProfile, searchUser, loggedInUserProfile, getFollowing, getFollowers, getTotalLikes, toggleFollow } = require('../controllers/userController');
const { createPost } = require('../controllers/postController');
const verifyUsery = require('../middlewares/userAuth');

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.send('This is user router');
});

userRouter.get("/me", verifyUser, loggedInUserProfile);
userRouter.post('/register', register);
userRouter.post("/login", login);
userRouter.post("/logout", logOut);
userRouter.get("/verify-user", verifyUsery, verifyUser);
userRouter.get('/search', verifyUser, searchUser);
userRouter.post("/reset-password-request", resetPasswordRequest);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/create/post", verifyUser, createPost);
userRouter.get('/profile/:username', verifyUser, getUserProfile);
userRouter.post('/follow/:id', verifyUser, toggleFollow);
userRouter.get('/followers/:id',verifyUser, getFollowers);
userRouter.get('/following/:id',verifyUser, getFollowing);
userRouter.get('/likes/:id', verifyUser, getTotalLikes);


module.exports = userRouter;
