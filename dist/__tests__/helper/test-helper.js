"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUsers = exports.deleteTeams = exports.deleteFixtures = exports.createTeam = exports.createFixture = exports.createUser = void 0;
const model_1 = __importDefault(require("../../teams/model"));
const fixture_schema_1 = __importDefault(require("../../fixtures/model/fixture-schema"));
const user_model_1 = __importDefault(require("../../users/models/user-model"));
const createUser = (payload) => {
    return user_model_1.default.create(payload);
};
exports.createUser = createUser;
const createFixture = (payload) => {
    return fixture_schema_1.default.create(payload);
};
exports.createFixture = createFixture;
const createTeam = (payload) => {
    return model_1.default.create(payload);
};
exports.createTeam = createTeam;
const deleteUsers = () => {
    return user_model_1.default.deleteMany({});
};
exports.deleteUsers = deleteUsers;
const deleteTeams = () => {
    return model_1.default.deleteMany({});
};
exports.deleteTeams = deleteTeams;
const deleteFixtures = () => {
    return fixture_schema_1.default.deleteMany({});
};
exports.deleteFixtures = deleteFixtures;
