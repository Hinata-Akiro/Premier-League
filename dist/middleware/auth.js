"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminGuard = exports.authGuard = void 0;
const user_model_1 = __importDefault(require("../users/models/user-model"));
const helper_1 = require("../utils/helper");
const jsonwebtoken_1 = require("jsonwebtoken");
const enum_1 = require("../users/enum");
const authGuard = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const response = (0, helper_1.accessToken)(token);
        if (response.code === 401) {
            return res.status(401).send({
                msg: response.msg,
                error: "Unauthorized",
            });
        }
        const user = await user_model_1.default.findById(response.id);
        if (!user) {
            return res.status(404).send({
                msg: "User not found",
                error: "User not found",
            });
        }
        req.user = user;
        return next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.TokenExpiredError) {
            return res.status(401).send({
                msg: "Token has expired",
                error: "Token has expired",
            });
        }
    }
};
exports.authGuard = authGuard;
const adminGuard = (req, res, next) => {
    const user = req.user;
    if (user.role !== enum_1.UserRole.Admin) {
        return res.status(403).send({
            msg: "Forbidden: You do not have permission to access this resource",
            error: "Forbidden",
        });
    }
    return next();
};
exports.adminGuard = adminGuard;
