const { createClient } = require('redis');

let redisClient = null;
let redisReady = false;

// Only attempt Redis connection if REDIS_PASS is configured
if (process.env.REDIS_PASS) {
    redisClient = createClient({
        username: 'default',
        password: process.env.REDIS_PASS,
        socket: {
            host: 'redis-13910.c57.us-east-1-4.ec2.cloud.redislabs.com',
            port: 13910,
            reconnectStrategy: (retries) => {
                if (retries > 3) {
                    console.warn('Redis: Max reconnect attempts reached. Running without Redis.');
                    return false; // stop retrying
                }
                return Math.min(retries * 500, 3000);
            }
        }
    });

    redisClient.on('error', (err) => {
        if (redisReady) console.error('Redis Client Error:', err.message);
    });

    redisClient.on('ready', () => {
        redisReady = true;
        console.log('✅ Redis connected successfully');
    });
} else {
    console.warn('⚠️  REDIS_PASS not set — running without Redis (block-user disabled).');
}

// Proxy that safely no-ops when Redis is unavailable
const safeRedis = {
    connect: async () => {
        if (!redisClient) return;
        try {
            await redisClient.connect();
        } catch (err) {
            console.warn('Redis connect failed — continuing without Redis:', err.message);
        }
    },
    set: async (...args) => {
        if (!redisClient || !redisReady) return null;
        try { return await redisClient.set(...args); } catch { return null; }
    },
    get: async (...args) => {
        if (!redisClient || !redisReady) return null;
        try { return await redisClient.get(...args); } catch { return null; }
    },
    exists: async (...args) => {
        if (!redisClient || !redisReady) return 0;
        try { return await redisClient.exists(...args); } catch { return 0; }
    },
    expire: async (...args) => {
        if (!redisClient || !redisReady) return null;
        try { return await redisClient.expire(...args); } catch { return null; }
    },
    del: async (...args) => {
        if (!redisClient || !redisReady) return null;
        try { return await redisClient.del(...args); } catch { return null; }
    }
};

module.exports = safeRedis;
