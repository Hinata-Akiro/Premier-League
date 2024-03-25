"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const testdb_1 = __importDefault(require("../testdb"));
const test_helper_1 = require("../helper/test-helper");
const mock_data_1 = require("../mock-data/mock-data");
const helper_1 = require("../../utils/helper");
const enum_1 = require("../../users/enum");
const api = (0, supertest_1.default)(app_1.default);
beforeAll(async () => {
    testdb_1.default.dbConnect();
});
afterAll(async () => {
    testdb_1.default.dbDisconnect();
    testdb_1.default.dbCleanUp();
});
describe("POST /api/v1/users/register", () => {
    it("Should register a user when the body is correct", async () => {
        const payload = mock_data_1.createMockUser;
        const url = "/api/v1/users/register";
        const { body } = await api
            .post(url)
            .send(payload)
            .expect(201);
        expect(body).toMatchObject({
            code: 201,
            msg: "You have successfully signed up",
            data: {
                _id: expect.any(String),
                name: payload.name,
                email: payload.email,
                password: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                __v: expect.any(Number),
            },
        });
    });
    it('should return an error message with status code 400 when a user with the same email already exists', async () => {
        const payload = mock_data_1.createMockUser;
        const url = "/api/v1/users/register";
        const { body } = await api
            .post(url)
            .send(payload)
            .expect(400);
        expect(body).toMatchObject({
            code: 400,
            msg: `User with email ${payload.email} already exisit`,
        });
    });
});
describe("POST /api/v1/users/login", () => {
    let userValue;
    beforeEach(async () => {
        userValue = await (0, test_helper_1.createUser)({
            name: "victor barny",
            email: "victor@gmail.com",
            password: await (0, helper_1.hashPassword)("password"),
            role: enum_1.UserRole.Admin,
        });
    });
    afterEach(async () => {
        await (0, test_helper_1.deleteUsers)();
    });
    it("Should login a user when the body is correct", async () => {
        const payload = {
            email: userValue.email,
            password: "password",
        };
        const url = "/api/v1/users/login";
        const { body } = await api.post(url).send(payload).expect(200);
        expect(body).toMatchObject({
            msg: "You have successfully logged in",
            token: expect.any(String),
            name: expect.any(String),
        });
    });
    it('should return an error message with status code 400 when the email or password is incorrect', async () => {
        const payload = {
            email: userValue.email,
            password: "<PASSWORD>",
        };
        const url = "/api/v1/users/login";
        const { body } = await api.post(url).send(payload).expect(400);
        expect(body).toMatchObject({
            msg: expect.any(String),
        });
    });
    it('should return an error message with status code 400 when the email or password is incorrect', async () => {
        const payload = {
            email: "victord@gmail.com",
            password: "password",
        };
        const url = "/api/v1/users/login";
        const { body } = await api.post(url).send(payload).expect(400);
        expect(body).toMatchObject({
            msg: expect.any(String),
        });
    });
    it('should return an error message with status code 400 when the email or password is incorrect', async () => {
        const payload = {
            email: "victord@gmail.com",
            password: "<PASSWORD>",
        };
        const url = "/api/v1/users/login";
        const { body } = await api.post(url).send(payload).expect(400);
        expect(body).toMatchObject({
            msg: expect.any(String),
        });
    });
});
