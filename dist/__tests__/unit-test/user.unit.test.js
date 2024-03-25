"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const controller_1 = require("../../users/controller");
const helper_1 = require("../../utils/helper");
const service_1 = require("../../users/service");
jest.mock('express-validator');
jest.mock('../../utils/helper');
jest.mock('../../users/service/index.ts');
describe('Auth Controller', () => {
    let req;
    let res;
    let next;
    beforeEach(async () => {
        req = { body: {
                name: 'John',
                email: 'victor@gmail.com',
                password: "password"
            } };
        res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        next = jest.fn();
    });
    describe('register', () => {
        it('should register a new user', async () => {
            express_validator_1.validationResult.mockReturnValue({ isEmpty: () => true });
            const hashedPassword = 'hashedPassword';
            helper_1.hashPassword.mockResolvedValue(hashedPassword);
            service_1.createUserService.mockResolvedValue({ code: 201, msg: 'You have successfully signed up' });
            await (0, controller_1.register)(req, res, next);
            expect(express_validator_1.validationResult).toHaveBeenCalledWith(req);
            expect(service_1.createUserService).toHaveBeenCalledWith({ ...req.body, password: hashedPassword });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({ code: 201, msg: 'You have successfully signed up' });
        });
        it('should handle registration failure', async () => {
            express_validator_1.validationResult.mockReturnValue({ isEmpty: () => true });
            service_1.createUserService.mockResolvedValue({ code: 400, msg: 'Registration failed' });
            await (0, controller_1.register)(req, res, next);
            expect(express_validator_1.validationResult).toHaveBeenCalledWith(req);
            expect(service_1.createUserService).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ code: 400, msg: 'Registration failed' });
        });
    });
    describe('login', () => {
        it('should log in with valid credentials', async () => {
            express_validator_1.validationResult.mockReturnValue({ isEmpty: () => true });
            helper_1.createToken.mockResolvedValue('mockedToken');
            service_1.loginUserService.mockResolvedValue({ code: 200, msg: 'Login successful', user: { name: 'John' } });
            await (0, controller_1.login)(req, res, next);
            expect(express_validator_1.validationResult).toHaveBeenCalledWith(req);
            expect(service_1.loginUserService).toHaveBeenCalledWith(req.body);
            expect(helper_1.createToken).toHaveBeenCalledWith(undefined);
            expect(res.status).toHaveBeenCalledWith(200);
            // expect(res.send).toHaveBeenCalledWith({ code: 200, msg: 'Login successful', name: 'John', token: 'mockedToken' });
        });
        it('should handle login failure', async () => {
            express_validator_1.validationResult.mockReturnValue({ isEmpty: () => true });
            service_1.loginUserService.mockResolvedValue({ code: 400, msg: 'Invalid credentials' });
            await (0, controller_1.login)(req, res, next);
            expect(express_validator_1.validationResult).toHaveBeenCalledWith(req);
            expect(service_1.loginUserService).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(400);
        });
    });
});
