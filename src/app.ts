import express, { Express, Request, Response } from 'express';
import rateLimit from "express-rate-limit";
import router from './routes';
import { errorHandler, errorLogger, invalidUrl } from './middleware/error-middleware';
import helmet from 'helmet';
import { CustomRequest } from './utils/custome-response';
import session from 'express-session';
import RedisStore from "connect-redis";
import config from './config/varibales';
import { client, redisConnect } from './cache/redis';
import {cachingMiddleware} from './middleware/caching-middleware';

const app: Express = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP address, please try again later"
}));

// Create Redis client
(async () => {
    await redisConnect(); 

    // const redisStore = new RedisStore({ client: client });
   
    app.use(
        session({
            // store:redisStore,
            secret: config.sessionSecret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: false,
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

app.use((req: Request, res: Response) => {
    res.status(404).send({
        status: "error",
        message: "Route not found, kindly check the URL",
        error: "Not found",
    });
});

export default app;
