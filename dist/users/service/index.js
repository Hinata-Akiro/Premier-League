"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserService = exports.createUserService = void 0;
const helper_1 = require("../../utils/helper");
const user_model_1 = __importDefault(require("../models/user-model"));
const createUserService = async (user) => {
    try {
        const createUser = new user_model_1.default(user);
        const results = await createUser.save();
        return results.errors
            ? {
                code: 500,
                msg: "The server could not process your request at the moment",
            }
            : { code: 201, msg: `You have successfully signed up`, data: results };
    }
    catch (error) {
        if (error.code == 11000)
            return { code: 400, msg: `User with email ${user.email} already exisit` };
        return { code: 400, msg: error.message };
    }
};
exports.createUserService = createUserService;
//login a user 
const loginUserService = async (data) => {
    try {
        const user = await user_model_1.default.findOne({ email: data.email });
        if (!user)
            return { code: 400, msg: `User with email ${data.email} does not exist` };
        const isMatch = await (0, helper_1.comparePassword)(user.password, data.password);
        if (!isMatch)
            return { code: 400, msg: `Password does not match` };
        return { code: 200, msg: `You have successfully logged in`, user: user };
    }
    catch (error) {
        return { code: 400, msg: error.message };
    }
};
exports.loginUserService = loginUserService;
