"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessToken = exports.createToken = exports.comparePassword = exports.hashPassword = void 0;
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const varibales_1 = __importDefault(require("../config/varibales"));
/**
 * Hashes a password using Argon2 hashing algorithm.
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} - A promise that resolves with the hashed password.
 */
const hashPassword = async (password) => {
    return await argon2_1.default.hash(password);
};
exports.hashPassword = hashPassword;
/**
 * Compares a plain text password with a hashed password.
 * @param {string} hashedPassword - The hashed password stored in the database.
 * @param {string} password2 - The plain text password to be compared.
 * @returns {Promise<boolean>} - A promise that resolves with a boolean indicating whether the passwords match.
 */
const comparePassword = async (hashedPassword, password2) => {
    return await argon2_1.default.verify(hashedPassword, password2);
};
exports.comparePassword = comparePassword;
/**
 * Creates a JSON Web Token (JWT) for authentication.
 * @param {string} id - The unique identifier associated with the user.
 * @returns {Promise<string>} - A promise that resolves with the generated JWT.
 */
const createToken = async (id) => {
    const token = jsonwebtoken_1.default.sign({ id: id }, varibales_1.default.jwtSecret, {
        expiresIn: "1d"
    });
    return token;
};
exports.createToken = createToken;
/**
 * Verifies the authenticity of a JSON Web Token (JWT).
 * @param {string} token - The JWT to be verified.
 * @returns {object | string} - The decoded payload of the JWT if verification is successful, otherwise throws an error.
 */
const verifyToken = (token) => {
    try {
        const verifiedToken = jsonwebtoken_1.default.verify(token, varibales_1.default.jwtSecret);
        return verifiedToken;
    }
    catch (error) {
        return { code: 401, msg: error.message };
    }
};
const accessToken = (tokenheader) => {
    if (typeof tokenheader === 'undefined')
        return { code: 401, msg: "Unauthorized. You must provide access token" };
    const bearer = tokenheader.split(' ');
    const decodedToken = verifyToken(bearer[1]);
    return decodedToken;
};
exports.accessToken = accessToken;
