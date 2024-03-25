import { createClient } from "redis";
import config from "../config/varibales";


const client = createClient({ url: config.redisUrl });

client.on("connect", () => console.log("Cache is connecting"));
client.on("ready", () => console.log("Cache is ready"));
client.on("end", () => console.log("Cache disconnected"));
client.on("reconnecting", () => console.log("Cache is reconnecting"));
client.on("error", (e) => console.log(e));

const redisConnect = async () => {
  await client.connect();
};

// If the Node process ends, close the Cache connection
process.on("SIGINT", async () => {
  await client.disconnect();
});

export {
  redisConnect,
  client,
};