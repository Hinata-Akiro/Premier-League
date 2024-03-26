import argon from "argon2";
import jwt from "jsonwebtoken";
import config from "../config/varibales";

/**
 * Hashes a password using Argon2 hashing algorithm.
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} - A promise that resolves with the hashed password.
 */
const hashPassword = async (password: string): Promise<string> => {
    return await argon.hash(password);
}

/**
 * Compares a plain text password with a hashed password.
 * @param {string} hashedPassword - The hashed password stored in the database.
 * @param {string} password2 - The plain text password to be compared.
 * @returns {Promise<boolean>} - A promise that resolves with a boolean indicating whether the passwords match.
 */
const comparePassword = async (hashedPassword: string, password2: string): Promise<boolean> => {
    return await argon.verify(hashedPassword, password2);
}

/**
 * Creates a JSON Web Token (JWT) for authentication.
 * @param {string} id - The unique identifier associated with the user.
 * @returns {Promise<string>} - A promise that resolves with the generated JWT.
 */
const createToken = async (id: string): Promise<string> => {
    const token = jwt.sign({ id: id }, config.jwtSecret,  {
        expiresIn: "1d" 
    });
    return token;
}

/**
 * Verifies the authenticity of a JSON Web Token (JWT).
 * @param {string} token - The JWT to be verified.
 * @returns {object | string} - The decoded payload of the JWT if verification is successful, otherwise throws an error.
 */
const verifyToken = (token: string) => {
    try {
        const verifiedToken = jwt.verify(token, config.jwtSecret);
        return verifiedToken;
      } catch (error:any) {
        return { code: 401, msg: error.message };
      }
}


const accessToken = (tokenheader: string | undefined): any => {
    if (typeof tokenheader === 'undefined') return { code: 401, msg: "Unauthorized. You must provide access token" };
    const bearer = tokenheader.split(' ');
    const decodedToken = verifyToken(bearer[1]);
    return decodedToken;
  };



export { hashPassword, comparePassword, createToken, accessToken , verifyToken};