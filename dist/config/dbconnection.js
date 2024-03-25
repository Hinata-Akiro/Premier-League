"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const varibales_1 = __importDefault(require("./varibales"));
mongoose_1.default.set('strictQuery', false);
const url = varibales_1.default.mongoUri;
const dbConnection = () => {
    if (!url) {
        throw new Error('MongoDB connection URL is not provided');
    }
    return mongoose_1.default.connect(url)
        .then(() => {
        console.log('MongoDB connected successfully!');
    })
        .catch(error => {
        throw new Error('Sorry, we could not connect to the database at the moment');
    });
};
exports.dbConnection = dbConnection;
