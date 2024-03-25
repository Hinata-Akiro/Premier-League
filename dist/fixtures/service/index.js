"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchFixtures = exports.getFixturesByStatus = exports.getFixtureByUniqueLink = exports.editFixture = exports.findAll = exports.findOne = exports.deleteFixture = exports.createFixture = void 0;
const fixture_schema_1 = __importDefault(require("../model/fixture-schema"));
const model_1 = __importDefault(require("../../teams/model"));
const crud_1 = require("../../utils/crud");
const shortid_1 = __importDefault(require("shortid"));
const fuse_js_1 = __importDefault(require("fuse.js"));
const createFixture = async ({ homeTeam, awayTeam, ...createFixture }) => {
    const [existingHomeTeam, existingAwayTeam] = await Promise.all([
        model_1.default.findOne({ _id: homeTeam }),
        model_1.default.findOne({ _id: awayTeam })
    ]);
    const errorMessage = (!existingHomeTeam && !existingAwayTeam) ? "Home and away teams not found" :
        (!existingHomeTeam) ? "Home team not found" :
            "Away team not found";
    if (!existingHomeTeam || !existingAwayTeam) {
        return {
            code: 400,
            message: errorMessage,
        };
    }
    const newFixture = await fixture_schema_1.default.create({
        homeTeam: existingHomeTeam._id,
        awayTeam: existingAwayTeam._id,
        ...createFixture,
        uniqueLink: shortid_1.default.generate()
    });
    return {
        code: 201,
        msg: "Fixture created successfully",
        data: newFixture,
    };
};
exports.createFixture = createFixture;
const deleteFixture = (0, crud_1.deleteDocument)(fixture_schema_1.default);
exports.deleteFixture = deleteFixture;
const findOne = (id) => {
    const result = fixture_schema_1.default.findOne({ _id: id }).populate('homeTeam', 'name')
        .populate('awayTeam', 'name');
    return result;
};
exports.findOne = findOne;
const getFixtureByUniqueLink = (uniqueLink) => {
    const result = fixture_schema_1.default.aggregate([
        { $match: { uniqueLink: uniqueLink } },
        { $lookup: { from: "teams", localField: "homeTeam", foreignField: "_id", as: "homeTeam" } },
        { $lookup: { from: "teams", localField: "awayTeam", foreignField: "_id", as: "awayTeam" } },
        { $unwind: { path: "$homeTeam", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$awayTeam", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 1,
                homeTeam: "$homeTeam.name",
                awayTeam: "$awayTeam.name",
                date: 1,
                time: 1,
                homeScore: 1,
                awayScore: 1,
                status: 1
            }
        }
    ]);
    return result;
};
exports.getFixtureByUniqueLink = getFixtureByUniqueLink;
const findAll = () => {
    const result = fixture_schema_1.default.aggregate([
        { $lookup: { from: "teams", localField: "homeTeam", foreignField: "_id", as: "homeTeam" } },
        { $lookup: { from: "teams", localField: "awayTeam", foreignField: "_id", as: "awayTeam" } },
        { $unwind: { path: "$homeTeam", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$awayTeam", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 1,
                homeTeam: "$homeTeam.name",
                awayTeam: "$awayTeam.name",
                date: 1,
                time: 1,
                homeScore: 1,
                awayScore: 1,
                uniqueLink: 1,
                status: 1,
                createdAt: 1,
                updatedAt: 1
            }
        },
        { $sort: { createdAt: 1 } }
    ]);
    return result;
};
exports.findAll = findAll;
const editFixture = (id, data) => {
    return fixture_schema_1.default.updateOne({ _id: id }, { $set: { ...data } }, { new: true, runValidators: true });
};
exports.editFixture = editFixture;
const getFixturesByStatus = (status) => {
    const result = fixture_schema_1.default.aggregate([
        { $match: { status: status.toUpperCase() } },
        { $lookup: { from: "teams", localField: "homeTeam", foreignField: "_id", as: "homeTeam" } },
        { $lookup: { from: "teams", localField: "awayTeam", foreignField: "_id", as: "awayTeam" } },
        { $unwind: { path: "$homeTeam", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$awayTeam", preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 1,
                homeTeam: "$homeTeam.name",
                awayTeam: "$awayTeam.name",
                date: 1,
                time: 1,
                homeScore: 1,
                awayScore: 1,
                status: 1
            }
        },
        { $sort: { createdAt: 1 } }
    ]);
    return result;
};
exports.getFixturesByStatus = getFixturesByStatus;
const initializeFixtureFuse = (fixtures) => {
    const options = {
        keys: ['homeTeam.name', 'awayTeam.name', 'date', 'time', "status"]
    };
    return new fuse_js_1.default(fixtures, options);
};
const searchFixtures = async (query) => {
    const allFixtures = await fixture_schema_1.default.find().populate('homeTeam', 'name')
        .populate('awayTeam', 'name');
    const fixtureFuse = initializeFixtureFuse(allFixtures);
    return fixtureFuse.search(query);
};
exports.searchFixtures = searchFixtures;
