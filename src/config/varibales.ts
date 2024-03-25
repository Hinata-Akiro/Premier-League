import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT,
  mongoUri: process.env.MONGO_URI as string,
  jwtSecret: process.env.JWT_SECRET as string,
  redisUrl: process.env.redisURL as string,
  sessionSecret: process.env.SESSION_SECRET as string
};

export default config;