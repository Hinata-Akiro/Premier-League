import { NextFunction, Request, Response } from "express";
import { client } from "../cache/redis"; 

const getFromCache = async (key: string) => {
  try {
    const cachedData = await client.get(key);
    return cachedData ? JSON.parse(cachedData) : null; 
  } catch (err) {
    console.error("Error fetching from cache:", err);
    return null;
  }
};

// Function to store data in Redis
const setToCache = async (key: string, payload: any, ttl = 60 * 60) => { 
  try {
    await client.set(key, JSON.stringify(payload), { EX: ttl }); 
  } catch (err) {
    console.error("Error storing in cache:", err);
  }
};

// Caching middleware
const cachingMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cacheKey = req.originalUrl; 

  const cachedData = await getFromCache(cacheKey);

  if (cachedData) {
    console.log("Data retrieved from cache:", cacheKey);
    res.send({msg:"data retrieved successfully",data:cachedData});
  } else {
    next(); 
  }
};

export  {cachingMiddleware, setToCache};
