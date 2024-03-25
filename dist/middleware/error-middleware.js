"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidUrl = exports.errorLogger = exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    if (error.code) {
        return res.status(error.code).json({ error });
    }
    res.status(500).json({ error });
};
exports.errorHandler = errorHandler;
const errorLogger = (error, req, res, next) => {
    return next(error);
};
exports.errorLogger = errorLogger;
const invalidUrl = (req, res, next) => {
    return res.status(404).json({ error: { code: 404, msg: "Url not found. Kindly check and try again" } });
};
exports.invalidUrl = invalidUrl;
