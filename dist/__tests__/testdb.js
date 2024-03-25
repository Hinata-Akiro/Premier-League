"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const dbConnect = async function () {
    const mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    await mongoose_1.default.connect(mongoServer.getUri());
};
const dbCleanUp = async () => {
    const mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    if (mongoServer) {
        const collections = await mongoose_1.default.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
};
const dbDisconnect = async () => {
    const mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    await mongoose_1.default.connection.dropDatabase();
    await mongoose_1.default.connection.close();
    await mongoServer.stop();
};
exports.default = {
    dbConnect,
    dbCleanUp,
    dbDisconnect,
};
