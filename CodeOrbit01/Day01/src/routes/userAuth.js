const express = require('express');


const authRouter = express.Router();
const { register, login, logout, adminRegister } = require('../controllers/userAuthent');
const User = require('../models/user');
const UserMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout, UserMiddleware,logout);
authRouter.post('/admin/register',adminMiddleware, adminRegister);

 //  authRouter.get('/getProfile', getProfile);


module.exports = authRouter;