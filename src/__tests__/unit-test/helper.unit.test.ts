import argon from "argon2";
import jwt, { JwtPayload } from "jsonwebtoken";
import { hashPassword, comparePassword, createToken, accessToken, verifyToken } from "../../utils/helper";
import config from "../../config/varibales"; 
import * as utils from "../../utils/helper";

jest.mock("argon2");
jest.mock("jsonwebtoken");

describe("hashPassword", () => {
  it("should hash the password using argon2", async () => {
    const password = "password123";
    const hashedPassword = "hashedPassword123";
    (argon.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const result = await hashPassword(password);

    expect(argon.hash).toHaveBeenCalledWith(password);
    expect(result).toBe(hashedPassword);
  });
});

describe("comparePassword", () => {
  it("should compare the plain text password with the hashed password", async () => {
    const hashedPassword = "hashedPassword123";
    const password2 = "password123";
    const match = true;
    (argon.verify as jest.Mock).mockResolvedValue(match);

    const result = await comparePassword(hashedPassword, password2);

    expect(argon.verify).toHaveBeenCalledWith(hashedPassword, password2);
    expect(result).toBe(match);
  });
});

describe("createToken", () => {
    it('should generate a JWT token with the given user ID and return it', async () => {
        const id = "12345";
        const token = await createToken(id);
        const decoded: JwtPayload = jwt.verify(token, config.jwtSecret) as JwtPayload;
        expect(decoded).toBe(decoded);
      });
});


describe("accessToken", () => {
    it('should return the decoded payload of a valid JWT when given a valid token', () => {
        const token = 'valid_token';
        const expectedPayload: { id: string } = { id: 'user_id' };
        const jwtVerifyMock = jest.spyOn(jwt, 'verify').mockReturnValue(expectedPayload as any);
    
        const result = verifyToken(token);
    
        expect(jwtVerifyMock).toHaveBeenCalledWith(token, config.jwtSecret);
        expect(result).toEqual(expectedPayload);
    
        jwtVerifyMock.mockRestore();
    });
});
