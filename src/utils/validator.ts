import { check } from "express-validator";
import { FixtureEnum } from "../fixtures/enum/fixtures-enum";

const validateUser = [
    check('name')
        .notEmpty()
        .isString()
        .withMessage('Name is required'),
    check('email')
        .isEmail()
        .isString()
        .withMessage('Invalid email'),
    check('password')
        .isLength({ min: 5 })
        .isString()
        .withMessage('Password must be at least 5 characters'),
];


const validateLoginUser = [
    check("email")
         .notEmpty()
        .isString()
         .withMessage('Email is required'),
    check("password")
          .notEmpty()
          .isString()
          .withMessage('Password is required'),
]


 const validateTeam = [
    check('name')
        .notEmpty().withMessage('Name is required')
        .isString()
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    check('country')
        .notEmpty().withMessage('Country is required')
        .isString()
        .isLength({ min: 2, max: 50 }).withMessage('Country must be between 2 and 50 characters'),
    check('city')
        .notEmpty().withMessage('City is required')
        .isString()
        .isLength({ min: 2, max: 50 }).withMessage('City must be between 2 and 50 characters'),
    check('stadium')
        .notEmpty().withMessage('Stadium is required')
        .isString()
        .isLength({ min: 2, max: 100 }).withMessage('Stadium must be between 2 and 100 characters'),
    check('founded')
        .notEmpty().withMessage('Founded is required')
        .isISO8601().withMessage('Founded must be a valid date string in ISO 8601 format'),
    check('numberOfTitles')
        .notEmpty().withMessage('Number of titles is required')
        .isNumeric().withMessage('Number of titles must be numeric')
        .isInt({ min: 0 }).withMessage('Number of titles must be a non-negative integer')
];

const validateFixtures = [
    check('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date string in ISO 8601 format'),
    check('homeScore')
        .optional()
        .isInt({ min: 0 }).withMessage('Home score must be a non-negative integer'),
    check('awayScore')
        .optional()
        .isInt({ min: 0 }).withMessage('Away score must be a non-negative integer'),
    check('time')
        .notEmpty().withMessage('Time is required')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Time must be in HH:mm format'),
    check('status')
        .optional()
        .isIn(Object.values(FixtureEnum)).withMessage(`Invalid status. Status must be one of: ${Object.values(FixtureEnum).join(', ')}`)
];

const validateStatus = [
    check('status')
       .notEmpty().withMessage('Status is required')
       .isIn(Object.values(FixtureEnum)).withMessage(`Invalid status. Status must be one of: ${Object.values(FixtureEnum).join(', ')}`)
]


export { validateUser,validateLoginUser, validateTeam,validateFixtures,validateStatus};