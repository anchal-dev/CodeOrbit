const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-13910.c57.us-east-1-4.ec2.cloud.redislabs.com',
        port: 13910
    }
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

module.exports = redisClient;
