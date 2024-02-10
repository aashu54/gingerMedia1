const express = require('express');
const { register, login, profile } = require('../controllers/auth');
const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.get('/profile', profile);

module.exports = userRouter;
