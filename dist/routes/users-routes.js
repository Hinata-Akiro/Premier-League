"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("../users/controller");
const express_1 = require("express");
const validator_1 = require("../utils/validator");
const userRouter = (0, express_1.Router)();
userRouter.post("/register", validator_1.validateUser, controller_1.register);
userRouter.post("/login", validator_1.validateLoginUser, controller_1.login);
exports.default = userRouter;
