const express = require('express');
const { register, verifyUser, login, logOut, resetPasswordRequest, resetPassword, getUserProfile, searchUser, loggedInUserProfile, getFollowing, getFollowers, getTotalLikes, toggleFollow, updateProfile } = require('../controllers/userController');
const { createPost } = require('../controllers/postController');
const verifyUsery = require('../middlewares/userAuth');
const { upload } = require('../config/cloudinary');

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
userRouter.post('/follow/:id', verifyUser, toggleFollow);
userRouter.get('/followers/:id', verifyUser, getFollowers);
userRouter.get('/following/:id', verifyUser, getFollowing);
userRouter.get('/likes/:id', verifyUser, getTotalLikes);
userRouter.put(
    '/update-profile',
    verifyUser,
    upload.fields([
        { name: 'profilepic', maxCount: 1 },
        { name: 'coverpic', maxCount: 1 }
    ]),
    updateProfile
);
userRouter.get('/profile/:username', verifyUser, getUserProfile);



module.exports = userRouter;
