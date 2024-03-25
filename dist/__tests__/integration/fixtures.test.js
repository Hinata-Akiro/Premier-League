"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const testdb_1 = __importDefault(require("../testdb"));
const mock_data_1 = require("../mock-data/mock-data");
const test_helper_1 = require("../helper/test-helper");
const helper_1 = require("../../utils/helper");
const enum_1 = require("../../users/enum");
const fixture_schema_1 = __importDefault(require("../../fixtures/model/fixture-schema"));
const fixtures_enum_1 = require("../../fixtures/enum/fixtures-enum");
const api = (0, supertest_1.default)(app_1.default);
beforeAll(async () => {
    testdb_1.default.dbConnect();
});
afterAll(async () => {
    testdb_1.default.dbDisconnect();
    testdb_1.default.dbCleanUp();
});
describe('createNewFixture', () => {
    let userValue;
    let userToken;
    let homeTeam;
    let awayTeam;
    beforeEach(async () => {
        userValue = await (0, test_helper_1.createUser)({
            name: "John Doe",
            email: "john@example.com",
            password: await (0, helper_1.hashPassword)("password"),
            role: enum_1.UserRole.Admin,
        });
        userToken = await (0, helper_1.createToken)(userValue?._id);
        homeTeam = await (0, test_helper_1.createTeam)({
            name: mock_data_1.createMockTeam.name,
            country: "Country A",
            city: "City A",
            stadium: "Stadium A",
            founded: new Date().toISOString(),
            numberOfTitles: 5,
        });
        awayTeam = await (0, test_helper_1.createTeam)({
            name: "Away Team",
            country: "Country B",
            city: "City B",
            stadium: "Stadium B",
            founded: new Date().toISOString(),
            numberOfTitles: 3,
        });
    });
    afterEach(async () => {
        jest.clearAllMocks();
        await (0, test_helper_1.deleteUsers)();
        await (0, test_helper_1.deleteTeams)();
        await (0, test_helper_1.deleteFixtures)();
    });
    it('should return 201 and fixture data when valid input is provided', async () => {
        const payload = mock_data_1.createMockFixture;
        const response = await api
            .post(`/api/v1/fixtures?homeTeam=${homeTeam._id?.toString()}&awayTeam=${awayTeam._id?.toString()}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
            homeScore: payload.homeScore,
            awayScore: payload.awayScore,
            date: payload.date,
            time: "19:00",
            status: payload.status,
        })
            .expect(201);
        expect(response.body).toHaveProperty('msg', 'Fixture created successfully');
        expect(response.body.data).toMatchObject({
            _id: expect.any(String),
            homeTeam: expect.any(String),
            awayTeam: expect.any(String),
            date: expect.any(String),
            time: expect.any(String),
            homeScore: expect.any(Number),
            awayScore: expect.any(Number),
            status: expect.any(String),
            uniqueLink: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            __v: expect.any(Number),
        });
    });
    it('should return 500 with error message when server error occurs', async () => {
        const payload = mock_data_1.createMockFixture;
        jest.spyOn(fixture_schema_1.default, 'create').mockImplementationOnce(() => {
            throw new Error('Server error occurred');
        });
        const response = await api
            .post(`/api/v1/fixtures?homeTeam=${homeTeam._id?.toString()}&awayTeam=${awayTeam._id?.toString()}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
            homeScore: payload.homeScore,
            awayScore: payload.awayScore,
            date: payload.date,
            time: "19:00",
            status: payload.status,
        })
            .expect(500);
        expect(response.body.error).toHaveProperty('msg', 'Internal Server Error');
    });
    it('should return 400 with error message when invalid input is provided', async () => {
        const homeTeamId = 'invalidTeamId';
        const response = await api
            .post(`/api/v1/fixtures?homeTeam=${homeTeamId}&awayTeam=${awayTeam._id?.toString()}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
            date: '2024-03-30',
            time: '15:00'
        })
            .expect(400);
        expect(response.body.error).toHaveProperty('msg', 'Invalid home team ID or away team ID.');
    });
});
describe('deleteFixtureById', () => {
    let userValue;
    let userToken;
    let homeTeam;
    let awayTeam;
    let fixture;
    beforeEach(async () => {
        userValue = await (0, test_helper_1.createUser)({
            name: "John Doe",
            email: "john@example.com",
            password: await (0, helper_1.hashPassword)("password"),
            role: enum_1.UserRole.Admin,
        });
        userToken = await (0, helper_1.createToken)(userValue?._id);
        homeTeam = await (0, test_helper_1.createTeam)({
            name: mock_data_1.createMockTeam.name,
            country: "Country A",
            city: "City A",
            stadium: "Stadium A",
            founded: new Date().toISOString(),
            numberOfTitles: 5,
        });
        awayTeam = await (0, test_helper_1.createTeam)({
            name: "Away Team",
            country: "Country B",
            city: "City B",
            stadium: "Stadium B",
            founded: new Date().toISOString(),
            numberOfTitles: 3,
        });
        fixture = await (0, test_helper_1.createFixture)({
            homeTeam: homeTeam._id,
            awayTeam: awayTeam._id,
            date: new Date(),
            time: "19:00",
            homeScore: 1,
            awayScore: 1,
            status: fixtures_enum_1.FixtureEnum.COMPLETED,
            uniqueLink: "uniqueLink",
        });
    });
    afterEach(async () => {
        jest.clearAllMocks();
        await (0, test_helper_1.deleteUsers)();
        await (0, test_helper_1.deleteTeams)();
        await (0, test_helper_1.deleteFixtures)();
    });
    it('should return 200 and a success message when a valid fixture ID is provided', async () => {
        jest.spyOn(fixture_schema_1.default, "deleteOne").mockResolvedValueOnce({ acknowledged: true, deletedCount: 1 });
        const fixtureId = fixture._id;
        const res = await api.delete(`/api/v1/fixtures/${fixtureId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(200);
        expect(res.body).toEqual({ code: 200, msg: 'Successfully deleted' });
    });
    it("should return 400 if Fixture ID is invalid", async () => {
        const invalidFixtureId = "invalidId";
        const url = `/api/v1/fixtures/${invalidFixtureId}`;
        const { body } = await api
            .delete(url)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(400);
        expect(body).toHaveProperty("error");
    });
});
describe("UpdateFixtureById", () => {
    let userValue;
    let userToken;
    let homeTeam;
    let awayTeam;
    let fixture;
    beforeEach(async () => {
        userValue = await (0, test_helper_1.createUser)({
            name: "John Doe",
            email: "john@example.com",
            password: await (0, helper_1.hashPassword)("password"),
            role: enum_1.UserRole.Admin,
        });
        userToken = await (0, helper_1.createToken)(userValue?._id);
        homeTeam = await (0, test_helper_1.createTeam)({
            name: mock_data_1.createMockTeam.name,
            country: "Country A",
            city: "City A",
            stadium: "Stadium A",
            founded: new Date().toISOString(),
            numberOfTitles: 5,
        });
        awayTeam = await (0, test_helper_1.createTeam)({
            name: "Away Team",
            country: "Country B",
            city: "City B",
            stadium: "Stadium B",
            founded: new Date().toISOString(),
            numberOfTitles: 3,
        });
        fixture = await (0, test_helper_1.createFixture)({
            homeTeam: homeTeam._id,
            awayTeam: awayTeam._id,
            date: new Date(),
            time: "19:00",
            homeScore: 1,
            awayScore: 1,
            status: fixtures_enum_1.FixtureEnum.COMPLETED,
            uniqueLink: "uniqueLink",
        });
    });
    afterEach(async () => {
        jest.clearAllMocks();
        await (0, test_helper_1.deleteUsers)();
        await (0, test_helper_1.deleteTeams)();
        await (0, test_helper_1.deleteFixtures)();
    });
    it("should return 200 if fixture is successfully updated", async () => {
        const validTeamId = fixture?._id;
        const url = `/api/v1/fixtures/${validTeamId}`;
        const { body } = await api
            .put(url)
            .set("Authorization", `Bearer ${userToken}`)
            .send({ date: mock_data_1.createMockFixture.date })
            .expect(200);
        expect(body).toEqual({
            code: 200,
            msg: "Successfully updated",
        });
    });
    it("should return 400 if fixture ID is invalid", async () => {
        const invalidTeamId = "invalidId";
        const url = `/api/v1/fixtures/${invalidTeamId}`;
        const { body } = await api
            .put(url)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(400);
        expect(body).toHaveProperty("error");
    });
});
describe("findFixturesByUniqueLink", () => {
    let userValue;
    let userToken;
    let homeTeam;
    let awayTeam;
    let fixture;
    beforeEach(async () => {
        userValue = await (0, test_helper_1.createUser)({
            name: "John Doe",
            email: "john@example.com",
            password: await (0, helper_1.hashPassword)("password"),
            role: enum_1.UserRole.Admin,
        });
        userToken = await (0, helper_1.createToken)(userValue?._id);
        homeTeam = await (0, test_helper_1.createTeam)({
            name: mock_data_1.createMockTeam.name,
            country: "Country A",
            city: "City A",
            stadium: "Stadium A",
            founded: new Date().toISOString(),
            numberOfTitles: 5,
        });
        awayTeam = await (0, test_helper_1.createTeam)({
            name: "Away Team",
            country: "Country B",
            city: "City B",
            stadium: "Stadium B",
            founded: new Date().toISOString(),
            numberOfTitles: 3,
        });
        fixture = await (0, test_helper_1.createFixture)({
            homeTeam: homeTeam._id,
            awayTeam: awayTeam._id,
            date: new Date(),
            time: "19:00",
            homeScore: 1,
            awayScore: 1,
            status: fixtures_enum_1.FixtureEnum.COMPLETED,
            uniqueLink: "uniqueLink",
        });
    });
    afterEach(async () => {
        jest.clearAllMocks();
        await (0, test_helper_1.deleteUsers)();
        await (0, test_helper_1.deleteTeams)();
        await (0, test_helper_1.deleteFixtures)();
    });
    it('should return 200 and fixture data when a valid unique link is provided', async () => {
        const res = await api
            .get(`/api/v1/fixtures/link/${fixture.uniqueLink}`)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(200);
        expect(res.body.code).toBe(200);
        expect(res.body.msg).toBe('Successfully fetched');
    });
    it("should return 400 if unique link is invalid", async () => {
        const invalidLink = "";
        const url = `/api/v1/fixtures/link/${invalidLink}`;
        const { body } = await api
            .get(url)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(400);
        expect(body).toHaveProperty("error");
    });
    it('should cache fixture data when fetched for the first time', async () => {
        const res = await api
            .get(`/api/v1/fixtures/link/${fixture.uniqueLink}`)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(200);
        expect(res.body.msg).toBe('data retrieved successfully');
    });
});
describe("getOneFixture", () => {
    let userValue;
    let userToken;
    let homeTeam;
    let awayTeam;
    let fixture;
    beforeEach(async () => {
        userValue = await (0, test_helper_1.createUser)({
            name: "John Doe",
            email: "john@example.com",
            password: await (0, helper_1.hashPassword)("password"),
            role: enum_1.UserRole.Admin,
        });
        userToken = await (0, helper_1.createToken)(userValue?._id);
        homeTeam = await (0, test_helper_1.createTeam)({
            name: mock_data_1.createMockTeam.name,
            country: "Country A",
            city: "City A",
            stadium: "Stadium A",
            founded: new Date().toISOString(),
            numberOfTitles: 5,
        });
        awayTeam = await (0, test_helper_1.createTeam)({
            name: "Away Team",
            country: "Country B",
            city: "City B",
            stadium: "Stadium B",
            founded: new Date().toISOString(),
            numberOfTitles: 3,
        });
        fixture = await (0, test_helper_1.createFixture)({
            homeTeam: homeTeam._id,
            awayTeam: awayTeam._id,
            date: new Date(),
            time: "19:00",
            homeScore: 1,
            awayScore: 1,
            status: fixtures_enum_1.FixtureEnum.COMPLETED,
            uniqueLink: "uniqueLink",
        });
    });
    afterEach(async () => {
        jest.clearAllMocks();
        await (0, test_helper_1.deleteUsers)();
        await (0, test_helper_1.deleteTeams)();
        await (0, test_helper_1.deleteFixtures)();
    });
    it('should return 200 and fixture data when a valid unique link is provided', async () => {
        const res = await api
            .get(`/api/v1/fixtures/${fixture._id}`)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(200);
        expect(res.body.code).toBe(200);
        expect(res.body.data).toEqual({
            _id: expect.any(String),
            homeTeam: {
                _id: expect.any(String),
                name: homeTeam.name,
            },
            awayTeam: {
                _id: expect.any(String),
                name: awayTeam.name,
            },
            date: expect.any(String),
            time: fixture.time,
            homeScore: fixture.homeScore,
            awayScore: fixture.awayScore,
            status: fixture.status,
            uniqueLink: fixture.uniqueLink,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            __v: expect.any(Number),
        });
    });
    it("should return 400 if fixture ID is invalid", async () => {
        const invalidTeamId = "invalidId";
        const url = `/api/v1/fixtures/${invalidTeamId}`;
        const { body } = await api
            .get(url)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(400);
        expect(body).toHaveProperty("error");
    });
});
describe("getAllFixtures", () => {
    let userValue;
    let userToken;
    let homeTeam;
    let awayTeam;
    let fixture;
    beforeEach(async () => {
        userValue = await (0, test_helper_1.createUser)({
            name: "John Doe",
            email: "john@example.com",
            password: await (0, helper_1.hashPassword)("password"),
            role: enum_1.UserRole.Admin,
        });
        userToken = await (0, helper_1.createToken)(userValue?._id);
        homeTeam = await (0, test_helper_1.createTeam)({
            name: mock_data_1.createMockTeam.name,
            country: "Country A",
            city: "City A",
            stadium: "Stadium A",
            founded: new Date().toISOString(),
            numberOfTitles: 5,
        });
        awayTeam = await (0, test_helper_1.createTeam)({
            name: "Away Team",
            country: "Country B",
            city: "City B",
            stadium: "Stadium B",
            founded: new Date().toISOString(),
            numberOfTitles: 3,
        });
        fixture = await (0, test_helper_1.createFixture)({
            homeTeam: homeTeam._id,
            awayTeam: awayTeam._id,
            date: new Date(),
            time: "19:00",
            homeScore: 1,
            awayScore: 1,
            status: fixtures_enum_1.FixtureEnum.COMPLETED,
            uniqueLink: "uniqueLink",
        });
    });
    afterEach(async () => {
        jest.clearAllMocks();
        await (0, test_helper_1.deleteUsers)();
        await (0, test_helper_1.deleteTeams)();
        await (0, test_helper_1.deleteFixtures)();
    });
    it("should return data and status code 200 if data is successfully fetched", async () => {
        const { body } = await api
            .get("/api/v1/fixtures")
            .set("Authorization", `Bearer ${userToken}`)
            .expect(200);
        expect(body.code).toBe(200);
        expect(body.msg).toBe('Successfully fetched');
        expect(body.data.length).toBeGreaterThan(0);
    });
});
describe("getFixturesByStatus", () => {
    let userValue;
    let userToken;
    let homeTeam;
    let awayTeam;
    let fixture;
    beforeEach(async () => {
        userValue = await (0, test_helper_1.createUser)({
            name: "John Doe",
            email: "john@example.com",
            password: await (0, helper_1.hashPassword)("password"),
            role: enum_1.UserRole.Admin,
        });
        userToken = await (0, helper_1.createToken)(userValue?._id);
        homeTeam = await (0, test_helper_1.createTeam)({
            name: mock_data_1.createMockTeam.name,
            country: "Country A",
            city: "City A",
            stadium: "Stadium A",
            founded: new Date().toISOString(),
            numberOfTitles: 5,
        });
        awayTeam = await (0, test_helper_1.createTeam)({
            name: "Away Team",
            country: "Country B",
            city: "City B",
            stadium: "Stadium B",
            founded: new Date().toISOString(),
            numberOfTitles: 3,
        });
        fixture = await (0, test_helper_1.createFixture)({
            homeTeam: homeTeam._id,
            awayTeam: awayTeam._id,
            date: new Date(),
            time: "19:00",
            homeScore: 1,
            awayScore: 1,
            status: fixtures_enum_1.FixtureEnum.COMPLETED,
            uniqueLink: "uniqueLink",
        });
    });
    afterEach(async () => {
        jest.clearAllMocks();
        await (0, test_helper_1.deleteUsers)();
        await (0, test_helper_1.deleteTeams)();
        await (0, test_helper_1.deleteFixtures)();
    });
    it("should return data and status code 200 if data is successfully fetched", async () => {
        const { body } = await api
            .get("/api/v1/fixtures/status/completed")
            .set("Authorization", `Bearer ${userToken}`)
            .expect(200);
        expect(body.code).toBe(200);
        expect(body.msg).toBe('Successfully fetched');
        expect(body.data.length).toBeGreaterThan(0);
    });
});
describe("searchHandler", () => {
    let userValue;
    let userToken;
    let homeTeam;
    let awayTeam;
    let fixture;
    beforeEach(async () => {
        userValue = await (0, test_helper_1.createUser)({
            name: "John Doe",
            email: "john@example.com",
            password: await (0, helper_1.hashPassword)("password"),
            role: enum_1.UserRole.Admin,
        });
        userToken = await (0, helper_1.createToken)(userValue?._id);
        homeTeam = await (0, test_helper_1.createTeam)({
            name: mock_data_1.createMockTeam.name,
            country: "Country A",
            city: "City A",
            stadium: "Stadium A",
            founded: new Date().toISOString(),
            numberOfTitles: 5,
        });
        awayTeam = await (0, test_helper_1.createTeam)({
            name: "Away Team",
            country: "Country B",
            city: "City B",
            stadium: "Stadium B",
            founded: new Date().toISOString(),
            numberOfTitles: 3,
        });
        fixture = await (0, test_helper_1.createFixture)({
            homeTeam: homeTeam._id,
            awayTeam: awayTeam._id,
            date: new Date(),
            time: "19:00",
            homeScore: 1,
            awayScore: 1,
            status: fixtures_enum_1.FixtureEnum.COMPLETED,
            uniqueLink: "uniqueLink",
        });
    });
    afterEach(async () => {
        jest.clearAllMocks();
        await (0, test_helper_1.deleteUsers)();
        await (0, test_helper_1.deleteTeams)();
        await (0, test_helper_1.deleteFixtures)();
    });
    it("should return data and status code 200 if data is successfully fetched", async () => {
        const search = homeTeam.name;
        const response = await api
            .get(`/api/v1/fixtures/search?searchQuery=${search}`)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(200);
        expect(response.status).toBe(200);
        expect(response.body.msg).toBe('data retrieved successfully');
        expect(response.body.fixtures.length).toBeGreaterThan(0);
        expect(response.body.teams.length).toBeGreaterThan(0);
    });
});
