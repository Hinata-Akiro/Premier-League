"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchTeams = exports.findAll = exports.findOne = exports.editTeam = exports.deleteTeam = exports.createTeam = void 0;
const model_1 = __importDefault(require("../model"));
const crud_1 = require("../../utils/crud");
const fuse_js_1 = __importDefault(require("fuse.js"));
const createTeam = async (createTeamData) => {
    return await model_1.default.create(createTeamData);
};
exports.createTeam = createTeam;
const deleteTeam = (0, crud_1.deleteDocument)(model_1.default);
exports.deleteTeam = deleteTeam;
const findOne = (id) => {
    return model_1.default.findOne({ _id: id });
};
exports.findOne = findOne;
const findAll = () => {
    return model_1.default.find().sort({ createdAt: 1 });
};
exports.findAll = findAll;
const editTeam = (id, details) => {
    return model_1.default.updateOne({ _id: id }, { $set: { ...details } }, { new: true, runValidators: true });
};
exports.editTeam = editTeam;
const initializeTeamFuse = (teams) => {
    const options = {
        keys: ['name', 'country', 'city', 'stadium'],
    };
    return new fuse_js_1.default(teams, options);
};
const searchTeams = async (query) => {
    const allTeams = await model_1.default.find();
    const teamFuse = initializeTeamFuse(allTeams);
    return teamFuse.search(query);
};
exports.searchTeams = searchTeams;
