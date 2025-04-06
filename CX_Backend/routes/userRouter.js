const express = require('express');
const {register, verifyUser, login, logOut, resetPasswordRequest, resetPassword, getUserProfile, searchUser} = require('../controllers/userController');
const {createPost} = require('../controllers/postController');
const verifyUsery = require('../middlewares/userAuth');

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.send('This is user router');
});

userRouter.post('/register', register);
userRouter.post("/login", login); 
userRouter.post("/logout", logOut); 
userRouter.get("/verify-user", verifyUsery, verifyUser); 
userRouter.get('/search',verifyUser, searchUser);
userRouter.post("/reset-password-request", resetPasswordRequest);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/create/post", verifyUser, createPost);
userRouter.get('/profile/:username',verifyUser, getUserProfile);

module.exports = userRouter;
