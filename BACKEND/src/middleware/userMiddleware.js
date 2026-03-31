 const jwt = require('jsonwebtoken');
 const User = require('../models/user');
const redisClient = require('../config/redis'); // adjust path if needed

const useMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token)
            throw new Error("Token not found");

        const payload = await jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;

        if (!_id)
            throw new Error("Invalid token");

        const user = await User.findById(_id);

        if (!user)
            throw new Error("User not found");

        const isBlocked = await redisClient.exists(`blocked_${_id}`);

        if (isBlocked)
            throw new Error("User is blocked");

        req.user = user;
        next();
    }
    catch (err) {
        res.status(401).send("Error: " + err.message);
    }
};

module.exports = useMiddleware;