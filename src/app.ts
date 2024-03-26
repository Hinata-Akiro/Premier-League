import express, { Express, Request, Response } from 'express';
import rateLimit from "express-rate-limit";
import router from './routes';
import { errorHandler, errorLogger, invalidUrl } from './middleware/error-middleware';
import helmet from 'helmet';
import { CustomRequest } from './utils/custome-response';
import session from 'express-session';
import config from './config/varibales';
import { client as redisClient, redisConnect } from './cache/redis';
import {cachingMiddleware} from './middleware/caching-middleware';
import connectRedis from "connect-redis";
import Redis from 'ioredis';

const app: Express = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: "Too many requests from this IP address, please try again later"
}));

// Create Redis client

(async () => {
    await redisConnect(); 

    // const RedisClient = new Redis();
    // const RedisStore = connectRedis( session );
    app.use(
        session({
            // store:new RedisStore({ client: RedisClient}),
            name: 'quid',
            secret: config.sessionSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
            },
        })
    );
})();

app.use(cachingMiddleware);


declare global {
    namespace Express {
        interface Request extends CustomRequest { }
    }
}

app.get("/", (req: Request, res: Response) => {
    res.send("Welcome to the Premier League application!");
});

app.use('/api/v1', router);

app.use(invalidUrl);
app.use(errorLogger);
app.use(errorHandler);


export default app;
