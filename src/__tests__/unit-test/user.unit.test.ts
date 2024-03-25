import { Request, Response, NextFunction } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import { register, login } from '../../users/controller';
import { createToken, hashPassword } from '../../utils/helper';
import { createUserService, loginUserService } from '../../users/service';

jest.mock('express-validator');
jest.mock('../../utils/helper');
jest.mock('../../users/service/index.ts');

describe('Auth Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(async() => {
    req = { body: {
      name: 'John',
      email: 'victor@gmail.com',
      password: "password"
    } };
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      (validationResult as jest.MockedFunction<typeof validationResult>).mockReturnValue({ isEmpty: () => true } as Result<ValidationError>);
      const hashedPassword = 'hashedPassword'; 
      (hashPassword as jest.Mock).mockResolvedValue(hashedPassword);
      (createUserService as jest.Mock).mockResolvedValue({ code: 201, msg: 'You have successfully signed up' });

      await register(req as Request, res as Response, next);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(createUserService).toHaveBeenCalledWith({ ...req.body, password: hashedPassword });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({ code: 201, msg: 'You have successfully signed up' });
    });

    it('should handle registration failure', async () => {
      (validationResult as jest.MockedFunction<typeof validationResult>).mockReturnValue({ isEmpty: () => true } as Result<ValidationError>);
      (createUserService as jest.Mock).mockResolvedValue({ code: 400, msg: 'Registration failed' });

      await register(req as Request, res as Response, next);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(createUserService).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ code: 400, msg: 'Registration failed' });
    });
  });

  describe('login', () => {
    it('should log in with valid credentials', async () => {
      (validationResult as jest.MockedFunction<typeof validationResult>).mockReturnValue({ isEmpty: () => true } as Result<ValidationError>);
      (createToken as jest.Mock).mockResolvedValue('mockedToken');
      (loginUserService as jest.Mock).mockResolvedValue({ code: 200, msg: 'Login successful', user: { name: 'John' } });

      await login(req as Request, res as Response, next);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(loginUserService).toHaveBeenCalledWith(req.body);
      expect(createToken).toHaveBeenCalledWith(undefined);
      expect(res.status).toHaveBeenCalledWith(200);
      // expect(res.send).toHaveBeenCalledWith({ code: 200, msg: 'Login successful', name: 'John', token: 'mockedToken' });
    });

    it('should handle login failure', async () => {
      (validationResult as jest.MockedFunction<typeof validationResult>).mockReturnValue({ isEmpty: () => true } as Result<ValidationError>);
      (loginUserService as jest.Mock).mockResolvedValue({ code: 400, msg: 'Invalid credentials' });

      await login(req as Request, res as Response, next);

      expect(validationResult).toHaveBeenCalledWith(req);
      expect(loginUserService).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
