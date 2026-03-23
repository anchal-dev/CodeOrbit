const User = require('../models/user');
const validate = require('../utils/validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const Submission = require('../models/submission');
//const adminMiddleware = require('../middleware/adminMiddleware');


const register = async (req, res) => {
    try {
    //    validate(req.body);

        const { firstName, emailId, password } = req.body;

const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
    firstName,
    emailId,   // ✅ FIXED
    password: hashedPassword
});
////////////////////////////////////////////////
console.log(req.body);


        const token = jwt.sign( 
            { _id: user._id, emailId:emailId,role:user.role },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );
          const reply = {
    firstName: user.firstName,
    emailId: user.emailId,
    _id: user._id
}

       res.cookie('token', token, {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // important for localhost
  maxAge: 60 * 60 * 1000
});
        res.status(201).json({
            user :reply,
            message: "User registered successfully"
        });
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
};

const login = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        if (!emailId || !password)
            throw new Error("Invalid Credentials");

        const user = await User.findOne({ emailId });

        if (!user)
            throw new Error("Invalid Credentials");

        const match = await bcrypt.compare(password, user.password);

        if (!match)
            throw new Error("Invalid Credentials");
        
        const reply = {
            firstName: user.firstName,
            emailId: user.emailId,
            _id: user._id
        }

        const token = jwt.sign(
            { _id: user._id, emailId: emailId, role: user.role },
            process.env.JWT_KEY,
            { expiresIn: 60 * 60 }
        );

       res.cookie('token', token, {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // important for localhost
  maxAge: 60 * 60 * 1000
});
        res.status(200).json({
            user :reply,
            message: "User logged in successfully"
        })
    }
    catch (err) {
        res.status(400).send("Error: " + err.message);
    }
};

const logout = async (req, res) => {
    try {
        const { token } = req.cookies;

        if (!token)
            throw new Error("Token not found");

        const payload = jwt.verify(token, process.env.JWT_KEY);

        await redisClient.set(`blocked_${payload._id}`, "true");
        await redisClient.expire(`blocked_${payload._id}`, 60 * 60);

        res.clearCookie("token", null, {expires: new Date(Date.now())});
        res.send("User logged out successfully");
    }
    catch (err) {
        res.status(503).send("Error: " + err.message);
    }
};

const adminRegister = async (req, res) => {


}

const deleteProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        await User.findByIdAndDelete(userId);

        await Submission.deleteMany({userId});

        res.status(200).send("User profile deleted successfully");


    }

    catch (err) {
        res.status(500).send("Internal Server Error");
    }

}


module.exports = { register, login, logout, adminRegister, deleteProfile };