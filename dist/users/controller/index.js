"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const helper_1 = require("../../utils/helper");
const service_1 = require("../service");
const register = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const hashedPassword = await (0, helper_1.hashPassword)(req.body.password);
        req.body.password = hashedPassword;
        const response = await (0, service_1.createUserService)(req.body);
        return res.status(response.code).send(response);
    }
    catch (error) {
        return res.status(400).json({ msg: error.errors });
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        const { code, msg, user } = await (0, service_1.loginUserService)(req.body);
        if (code === 200 && user) {
            const token = await (0, helper_1.createToken)(user._id);
            return res.status(code).send({ msg, name: user.name, token });
        }
        else if (code === 400) {
            return res.status(code).send({ msg });
        }
    }
    catch (error) {
        return next({ code: 500, msg: "Internal Server Error", error });
    }
};
exports.login = login;
