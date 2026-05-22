 const jwt = require('jsonwebtoken');
 const User = require('../models/user');
const redisClient = require('../config/redis');

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
        req.result = user;
        next();
    }
    catch (err) {
        res.status(401).send("Error: " + err.message);
    }
};

/**
 * Optional auth middleware — attaches req.user if a valid token exists,
 * but does NOT block the request if no token is present.
 * Used for public routes that benefit from knowing who is logged in
 * (e.g., GET /potd to show solved status).
 */
const optionalMiddleware = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) return next(); // unauthenticated — continue without user

        const payload = jwt.verify(token, process.env.JWT_KEY);
        const { _id } = payload;
        if (!_id) return next();

        const user = await User.findById(_id);
        if (!user) return next();

        const isBlocked = await redisClient.exists(`blocked_${_id}`);
        if (isBlocked) return next();

        req.user = user;
        req.result = user;
        next();
    } catch {
        next(); // invalid token — continue as guest
    }
};

module.exports = useMiddleware;
module.exports.optionalMiddleware = optionalMiddleware;