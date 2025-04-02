const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {register, verifyUser, login, logOut, resetPasswordRequest, resetPassword} = require('../controllers/userController');
const verifyUsery = require('../middlewares/userAuth');

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.send('This is user router');
});

userRouter.post('/register', register);
userRouter.post("/login", login); 
userRouter.post("/logout", logOut); 
userRouter.get("/verify-user", verifyUsery, verifyUser); 
userRouter.post("/reset-password-request", resetPasswordRequest);
userRouter.post("/reset-password", resetPassword);

module.exports = userRouter;
