import { Request, Response, NextFunction } from 'express';
import { ErrorFormatter, Result, ValidationError, validationResult } from 'express-validator';
import { IFixtures } from '../../fixtures/interface';
import * as fixtureService from "../../fixtures/service"
import { createNewFixture, findFixtureByUniqueLink } from '../../fixtures/controller';
import { fetchAll } from '../../utils/crud';

jest.mock('express-validator');


jest.mock('../../fixtures/service', () => ({
    createFixture: jest.fn(),
    deleteFixture: jest.fn(),
    findOne: jest.fn(),
    getFixtureByUniqueLink: jest.fn(),
    findAll: jest.fn(),
    editFixture: jest.fn(),
    getFixturesByStatus: jest.fn(),
    searchFixtures: jest.fn()
  }));

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  describe('getFixtures', () => {

    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            query: {  },
            body: {  },
        } as unknown as Request;

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        } as unknown as Response;

        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 status code and JSON data when successful', async () => {
        const mockRequest = {} as Request;
        const mockResponse = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as unknown as Response;
        const mockNext = jest.fn();
  
        const mockFn = jest.fn().mockResolvedValue([{ id: 1, name: 'John' }]);
  
        await fetchAll(mockFn)(mockRequest, mockResponse, mockNext);
  
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
          code: 200,
          msg: "Successfully fetched",
          data: [{ id: 1, name: 'John' }],
        });
      });
  })