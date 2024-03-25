"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTeams = exports.getOneTeam = exports.updateTeamById = exports.deleteTeamById = exports.createNewTeam = void 0;
const express_validator_1 = require("express-validator");
const service_1 = require("../service");
const mongoose_1 = __importDefault(require("mongoose"));
const crud_1 = require("../../utils/crud");
const createNewTeam = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const response = await (0, service_1.createTeam)(req.body);
        return res.status(201).send({
            code: 201,
            msg: "team created successfully",
            data: response
        });
    }
    catch (error) {
        return next({
            code: error.code === 11000 ? 400 : 500,
            msg: error.code === 11000
                ? `Team with ${error.keyValue.name} already exists`
                : error.message || "internal server error..., please try again"
        });
    }
};
exports.createNewTeam = createNewTeam;
const deleteTeamById = async (req, res, next) => {
    try {
        const teamId = req.params.id;
        if (!teamId || !mongoose_1.default.Types.ObjectId.isValid(teamId)) {
            return next({ code: 400, msg: 'Invalid team ID' });
        }
        const response = await (0, service_1.deleteTeam)(teamId);
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
exports.deleteTeamById = deleteTeamById;
const updateTeamById = async (req, res, next) => {
    try {
        const teamId = req.params.id;
        if (!teamId || !mongoose_1.default.Types.ObjectId.isValid(teamId)) {
            return next({ code: 400, msg: 'Invalid team ID' });
        }
        const response = await (0, service_1.editTeam)(teamId, req.body);
        if (response.acknowledged && response.modifiedCount) {
            return res.status(200).json({ code: 200, msg: "Successfully updated" });
        }
        else {
            return next({ code: 403, msg: 'We could not perform the update operation on the selected Team at the moment, please try again later' });
        }
    }
    catch (error) {
        return next({ code: 500, msg: 'internal server error, please try again later' });
    }
};
exports.updateTeamById = updateTeamById;
const getOneTeam = (0, crud_1.fetchOne)(service_1.findOne);
exports.getOneTeam = getOneTeam;
const getAllTeams = (0, crud_1.fetchAll)(service_1.findAll);
exports.getAllTeams = getAllTeams;
