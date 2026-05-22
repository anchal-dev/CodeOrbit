const express = require('express');


const authRouter = express.Router();
const { register, login, logout, adminRegister,deleteProfile } = require('../controllers/userAuthent');
const User = require('../models/user');
const UserMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', UserMiddleware,logout);
authRouter.post('/admin/register',adminMiddleware, adminRegister);
authRouter.delete('/profile',UserMiddleware,deleteProfile);
authRouter.get('/check', UserMiddleware, (req, res) => {

    const reply = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        emailId: req.user.emailId,
        role: req.user.role,
        avatar: req.user.avatar,
        points: req.user.points,
        orbitCoins: req.user.orbitCoins,
        _id: req.user._id
    }
    res.status(200).json({  
        user: reply,
        message: "User is authenticated"
    });
})
 //  authRouter.get('/getProfile', getProfile);


module.exports = authRouter;