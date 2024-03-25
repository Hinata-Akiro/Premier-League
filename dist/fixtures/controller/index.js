"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchHandler = exports.findFixturesByStatus = exports.findFixtureByUniqueLink = exports.getAllFixtures = exports.getOneFixture = exports.editFixtureById = exports.deleteFixtureById = exports.createNewFixture = void 0;
const express_validator_1 = require("express-validator");
const service_1 = require("../service");
const service_2 = require("../../teams/service");
const crud_1 = require("../../utils/crud");
const mongoose_1 = __importDefault(require("mongoose"));
const caching_middleware_1 = require("../../middleware/caching-middleware");
const createNewFixture = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const homeTeam = req.query.homeTeam;
    const awayTeam = req.query.awayTeam;
    if (!homeTeam || !mongoose_1.default.Types.ObjectId.isValid(homeTeam) ||
        !awayTeam || !mongoose_1.default.Types.ObjectId.isValid(awayTeam)) {
        return next({ code: 400, msg: "Invalid home team ID or away team ID." });
    }
    try {
        const { code, msg, data } = await (0, service_1.createFixture)({ homeTeam, awayTeam, ...req.body });
        if (code === 201) {
            return res.status(code).send({ msg: msg, data: data });
        }
        else if (code === 400) {
            return res.status(code).send({ msg });
        }
    }
    catch (error) {
        return next({ code: 500, msg: "Internal Server Error", error });
    }
};
exports.createNewFixture = createNewFixture;
const deleteFixtureById = async (req, res, next) => {
    try {
        const fixtureId = req.params.id;
        if (!fixtureId || !mongoose_1.default.Types.ObjectId.isValid(fixtureId)) {
            return next({ code: 400, msg: 'Invalid fixture ID' });
        }
        const response = await (0, service_1.deleteFixture)(fixtureId);
        if (response.acknowledged && response.deletedCount) {
            return res.status(200).json({ code: 200, msg: "Successfully deleted" });
        }
        else {
            return next({ code: 403, msg: 'We could not perform the delete operation on the selected Team at the moment, please try again later' });
        }
    }
    catch (error) {
        return next({ code: 500, msg: 'internal server error, please try again later' });
    }
};
exports.deleteFixtureById = deleteFixtureById;
const editFixtureById = async (req, res, next) => {
    try {
        const fixtureId = req.params.id;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        if (!fixtureId || !mongoose_1.default.Types.ObjectId.isValid(fixtureId)) {
            return next({ code: 400, msg: 'Invalid fixture ID' });
        }
        const response = await (0, service_1.editFixture)(fixtureId, req.body);
        if (response.acknowledged && response.modifiedCount) {
            return res.status(200).json({ code: 200, msg: "Successfully updated" });
        }
        else {
            return next({ code: 403, msg: 'We could not perform the update operation on the selected Fixture at the moment, please try again later' });
        }
    }
    catch (error) {
        return next({ code: 500, msg: 'internal server error, please try again later' || error.message });
    }
};
exports.editFixtureById = editFixtureById;
const findFixtureByUniqueLink = async (req, res, next) => {
    try {
        const uniqueLink = req.params.uniqueLink;
        if (!uniqueLink) {
            return next({ code: 400, msg: 'Invalid uniqueLink' });
        }
        const response = await (0, service_1.getFixtureByUniqueLink)(uniqueLink);
        if (response) {
            const cacheKey = req.originalUrl;
            await (0, caching_middleware_1.setToCache)(cacheKey, response, 600);
            return res.status(200).json({ code: 200, msg: "Successfully fetched", data: response });
        }
        else {
            return next({ code: 404, msg: 'Fixture not found' });
        }
    }
    catch (error) {
        return next({ code: 500, msg: 'internal server error, please try again later' || error.message });
    }
};
exports.findFixtureByUniqueLink = findFixtureByUniqueLink;
const findFixturesByStatus = async (req, res, next) => {
    try {
        const status = req.params.status;
        if (!status) {
            return next({ code: 400, msg: 'Invalid status' });
        }
        const response = await (0, service_1.getFixturesByStatus)(status);
        if (response.length > 0) {
            const cacheKey = req.originalUrl;
            await (0, caching_middleware_1.setToCache)(cacheKey, response, 600);
            return res.status(200).json({ code: 200, msg: "Successfully fetched", data: response });
        }
        else {
            return next({ code: 404, msg: 'Fixtures not found' });
        }
    }
    catch (error) {
        return next({ code: 500, msg: 'internal server error, please try again later' || error.message });
    }
};
exports.findFixturesByStatus = findFixturesByStatus;
const searchHandler = async (req, res, next) => {
    try {
        const searchQuery = req.query.searchQuery;
        if (!searchQuery) {
            return res.status(400).json({ msg: 'Search query is required' });
        }
        const fixtureResults = await (0, service_1.searchFixtures)(searchQuery);
        const teamResults = await (0, service_2.searchTeams)(searchQuery);
        if (fixtureResults.length === 0 && teamResults.length === 0) {
            return res.status(404).json({ message: 'No results found for the provided query' });
        }
        const cacheKey = req.originalUrl;
        await (0, caching_middleware_1.setToCache)(cacheKey, teamResults, 600);
        return res.status(200).json({ msg: "data retrieved successfully", fixtures: fixtureResults, teams: teamResults });
    }
    catch (error) {
        return next({ code: 500, msg: 'internal server error, please try again later' || error.message });
    }
};
exports.searchHandler = searchHandler;
const getOneFixture = (0, crud_1.fetchOne)(service_1.findOne);
exports.getOneFixture = getOneFixture;
const getAllFixtures = (0, crud_1.fetchAll)(service_1.findAll);
exports.getAllFixtures = getAllFixtures;
