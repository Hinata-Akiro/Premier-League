"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.redisConnect = void 0;
const redis_1 = require("redis");
const varibales_1 = __importDefault(require("../config/varibales"));
const client = (0, redis_1.createClient)({ url: varibales_1.default.redisUrl });
exports.client = client;
client.on("connect", () => console.log("Cache is connecting"));
client.on("ready", () => console.log("Cache is ready"));
client.on("end", () => console.log("Cache disconnected"));
client.on("reconnecting", () => console.log("Cache is reconnecting"));
client.on("error", (e) => console.log(e));
const redisConnect = async () => {
    await client.connect();
};
exports.redisConnect = redisConnect;
// If the Node process ends, close the Cache connection
process.on("SIGINT", async () => {
    await client.disconnect();
});
