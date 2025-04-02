const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {register, verifyUser} = require('../controllers/userController');
const verifyUsery = require('../middlewares/userAuth');

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.send('This is user router');
});

userRouter.post('/register', register);

userRouter.get("/verify-user",verifyUsery,verifyUser); 


module.exports = userRouter;
