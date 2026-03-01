const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db');
const redisClient = require('./config/redis');   // ✅ ADDED
const cookieparser = require('cookie-parser');
const authRouter = require("./routes/userAuth");

app.use(express.json());
app.use(cookieparser());
app.use('/user', authRouter);

const InitializeConnection = async () => {
    try {
        await Promise.all([main(), redisClient.connect()]);  // ✅ fixed

        console.log("Connected to database and redis successfully");

        app.listen(process.env.PORT, () => {
            console.log("Server is running on port: " + process.env.PORT);
        });
    }
    catch (err) {
        console.log("Error in connecting to database or redis: " + err);
    }
};

InitializeConnection();









