"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateStatus = exports.validateFixtures = exports.validateTeam = exports.validateLoginUser = exports.validateUser = void 0;
const express_validator_1 = require("express-validator");
const fixtures_enum_1 = require("../fixtures/enum/fixtures-enum");
const validateUser = [
    (0, express_validator_1.check)('name')
        .notEmpty()
        .isString()
        .withMessage('Name is required'),
    (0, express_validator_1.check)('email')
        .isEmail()
        .isString()
        .withMessage('Invalid email'),
    (0, express_validator_1.check)('password')
        .isLength({ min: 5 })
        .isString()
        .withMessage('Password must be at least 5 characters'),
];
exports.validateUser = validateUser;
const validateLoginUser = [
    (0, express_validator_1.check)("email")
        .notEmpty()
        .isString()
        .withMessage('Email is required'),
    (0, express_validator_1.check)("password")
        .notEmpty()
        .isString()
        .withMessage('Password is required'),
];
exports.validateLoginUser = validateLoginUser;
const validateTeam = [
    (0, express_validator_1.check)('name')
        .notEmpty().withMessage('Name is required')
        .isString()
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    (0, express_validator_1.check)('country')
        .notEmpty().withMessage('Country is required')
        .isString()
        .isLength({ min: 2, max: 50 }).withMessage('Country must be between 2 and 50 characters'),
    (0, express_validator_1.check)('city')
        .notEmpty().withMessage('City is required')
        .isString()
        .isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters'),
    (0, express_validator_1.check)('stadium')
        .notEmpty().withMessage('Stadium is required')
        .isString()
        .isLength({ min: 2, max: 100 }).withMessage('Stadium must be between 2 and 100 characters'),
    (0, express_validator_1.check)('founded')
        .notEmpty().withMessage('Founded is required')
        .isISO8601().withMessage('Founded must be a valid date string in ISO 8601 format'),
    (0, express_validator_1.check)('numberOfTitles')
        .notEmpty().withMessage('Number of titles is required')
        .isNumeric().withMessage('Number of titles must be numeric')
        .isInt({ min: 0 }).withMessage('Number of titles must be a non-negative integer')
];
exports.validateTeam = validateTeam;
const validateFixtures = [
    (0, express_validator_1.check)('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date string in ISO 8601 format'),
    (0, express_validator_1.check)('homeScore')
        .optional()
        .isInt({ min: 0 }).withMessage('Home score must be a non-negative integer'),
    (0, express_validator_1.check)('awayScore')
        .optional()
        .isInt({ min: 0 }).withMessage('Away score must be a non-negative integer'),
    (0, express_validator_1.check)('time')
        .notEmpty().withMessage('Time is required')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Time must be in HH:mm format'),
    (0, express_validator_1.check)('status')
        .optional()
        .isIn(Object.values(fixtures_enum_1.FixtureEnum)).withMessage(`Invalid status. Status must be one of: ${Object.values(fixtures_enum_1.FixtureEnum).join(', ')}`)
];
exports.validateFixtures = validateFixtures;
const validateStatus = [
    (0, express_validator_1.check)('status')
        .notEmpty().withMessage('Status is required')
        .isIn(Object.values(fixtures_enum_1.FixtureEnum)).withMessage(`Invalid status. Status must be one of: ${Object.values(fixtures_enum_1.FixtureEnum).join(', ')}`)
];
exports.validateStatus = validateStatus;
