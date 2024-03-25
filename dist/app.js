"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middleware/error-middleware");
const helmet_1 = __importDefault(require("helmet"));
const express_session_1 = __importDefault(require("express-session"));
const varibales_1 = __importDefault(require("./config/varibales"));
const redis_1 = require("./cache/redis");
const caching_middleware_1 = require("./middleware/caching-middleware");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP address, please try again later"
}));
// Create Redis client
(async () => {
    await (0, redis_1.redisConnect)();
    // const redisStore = new RedisStore({ client: client });
    app.use((0, express_session_1.default)({
        // store:redisStore,
        secret: varibales_1.default.sessionSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24,
        },
    }));
})();
app.use(caching_middleware_1.cachingMiddleware);
app.get("/", (req, res) => {
    res.send("Welcome to the Premier League application!");
});
app.use('/api/v1', routes_1.default);
app.use(error_middleware_1.invalidUrl);
app.use(error_middleware_1.errorLogger);
app.use(error_middleware_1.errorHandler);
app.use((req, res) => {
    res.status(404).send({
        status: "error",
        message: "Route not found, kindly check the URL",
        error: "Not found",
    });
});
exports.default = app;
