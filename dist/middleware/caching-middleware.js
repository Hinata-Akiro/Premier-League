"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setToCache = exports.cachingMiddleware = void 0;
const redis_1 = require("../cache/redis");
const getFromCache = async (key) => {
    try {
        const cachedData = await redis_1.client.get(key);
        return cachedData ? JSON.parse(cachedData) : null;
    }
    catch (err) {
        console.error("Error fetching from cache:", err);
        return null;
    }
};
// Function to store data in Redis
const setToCache = async (key, payload, ttl = 60 * 60) => {
    try {
        await redis_1.client.set(key, JSON.stringify(payload), { EX: ttl });
    }
    catch (err) {
        console.error("Error storing in cache:", err);
    }
};
exports.setToCache = setToCache;
// Caching middleware
const cachingMiddleware = async (req, res, next) => {
    const cacheKey = req.originalUrl;
    const cachedData = await getFromCache(cacheKey);
    if (cachedData) {
        console.log("Data retrieved from cache:", cacheKey);
        res.send({ msg: "data retrieved successfully", data: cachedData });
    }
    else {
        next();
    }
};
exports.cachingMiddleware = cachingMiddleware;
