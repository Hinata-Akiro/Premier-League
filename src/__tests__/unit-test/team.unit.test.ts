import { Request, Response, NextFunction } from 'express';
import {
    createNewTeam,
    deleteTeamById,
    updateTeamById,
    getOneTeam,
    getAllTeams
} from '../../teams/controller';
import { Result, ValidationError, validationResult } from 'express-validator';
import { createTeam, deleteTeam, editTeam } from '../../teams/service';
import { ITeam } from '../../teams/interface';


jest.mock('express-validator');

jest.mock('../../teams/service', () => ({
    createTeam: jest.fn(),
    deleteTeam: jest.fn(),
    editTeam: jest.fn()
  }));


  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  describe('createNewTeam', () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    const fakeTeamData: ITeam = {
        name: 'Test Team',
        country: 'Test Country',
        city: 'Test City',
        stadium: 'Test Stadium',
        founded: new Date().toISOString(),
        numberOfTitles: 0
    };
  
    beforeEach(() => {
      req = {body:{
        name: fakeTeamData.name,
        country: fakeTeamData.country,
        city: fakeTeamData.city,
        stadium: fakeTeamData.stadium,
        founded: fakeTeamData.founded,
        numberOfTitles: fakeTeamData.numberOfTitles
      }} as Request;
      res = mockResponse();
      next = jest.fn();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    })

    it('should return 201 if team is created successfully', async () => {
        (validationResult as jest.MockedFunction<typeof validationResult>).mockReturnValue({ isEmpty: () => true } as Result<ValidationError>);
    
    
        const fakeCreatedTeam = {
            _id: 'fakeId',
            ...fakeTeamData,
            createdAt: new Date(), 
            updatedAt: new Date(), 
        };
    
        (createTeam as jest.Mock).mockResolvedValue(fakeCreatedTeam);
    
        await createNewTeam(req as Request, res as Response, next);
    
        expect(validationResult).toHaveBeenCalledWith(req);
        expect(createTeam).toHaveBeenCalledWith(fakeTeamData);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({
          code: 201,
          msg: 'team created successfully',
          data: fakeCreatedTeam,
        });
    });
    
    it('should return 400 if validation fails', async () => {
        (validationResult as jest.MockedFunction<typeof validationResult>).mockReturnValue({
            isEmpty: () => false,
            array: () => [{ msg: 'Error message 1' }, { msg: 'Error message 2' }],
        } as Result<ValidationError>);

        await createNewTeam(req as Request, res as Response, next);

        expect(validationResult).toHaveBeenCalledWith(req);
        expect(createTeam).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
    });
})

// describe('deleteTeamById', () => {
//     let req: Partial<Request>;
//     let res: Partial<Response>;
//     let next: jest.Mock;

//     beforeEach(() => {
//         req = {
//             params: { id: "validTeamId" },
//             body: {}
//         } as unknown as Request;
//           res = {
//             status: jest.fn().mockReturnThis(),
//             json: jest.fn()
//           };
//           next = jest.fn();
//       });

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     it('should return 400 if team ID is invalid', async () => {
//         if (req.params) {
//             req.params.id = 'invalidTeamId';
//         }

//         await deleteTeamById(req as Request, res as Response, next);

//         expect(next).toHaveBeenCalledWith({ code: 400, msg: 'Invalid team ID' });
//     });

//     it('should return 403 if deletion operation fails', async () => {
//         const mockedDeleteResponse = { acknowledged: false, deletedCount: 0 };
//         if(req.params) {
//             req.params.id = 'validTeamId';
//         }
//         (deleteTeam as jest.Mock).mockResolvedValueOnce(mockedDeleteResponse);

//         await deleteTeamById(req as Request, res as Response, next);

//         expect(deleteTeam).toHaveBeenCalledWith('validTeamId');
//         expect(next).toHaveBeenCalledWith({ code: 403, msg: 'We could not perform the delete operation on the selected Team at the moment, please try again later' });
//     });
// })

// describe('updateTeamById', () => {
//     let req: Partial<Request>;
//     let res: Partial<Response>;
//     let next: jest.Mock;
  
//     beforeEach(() => {
//       req = {
//         params: { id: 'validObjectId' },
//         body: { name: 'New Team Name' }
//       };
//       res = {
//         status: jest.fn().mockReturnThis(),
//         json: jest.fn()
//       };
//       next = jest.fn();
//     });
  
//     it('should update team by ID', async () => {
//       const mockResponse = { acknowledged: true, modifiedCount: 1 };
//       (editTeam as jest.Mock).mockResolvedValue(mockResponse);;
  
//       await updateTeamById(req as Request, res as Response, next);
  
//       expect(editTeam).toHaveBeenCalledWith('validObjectId', req.body);
//       expect(res.status).toHaveBeenCalledWith(200);
//       expect(res.json).toHaveBeenCalledWith({ code: 200, msg: 'Successfully updated' });
//       expect(next).not.toHaveBeenCalled();
//     });
  
//     it('should handle invalid team ID', async () => {
//         if (req.params) {
//            req.params.id = 'invalidObjectId';
//         }
//       await updateTeamById(req as Request, res as Response, next);
  
//       expect(next).toHaveBeenCalledWith({ code: 400, msg: 'Invalid team ID' });
//       expect(editTeam).not.toHaveBeenCalled();
//       expect(res.status).not.toHaveBeenCalled();
//       expect(res.json).not.toHaveBeenCalled();
//     });
  
//     it('should handle update failure', async () => {
//       const mockResponse = { acknowledged: true, modifiedCount: 0 };
//       (editTeam as jest.Mock).mockResolvedValue(mockResponse);;
  
//       await updateTeamById(req as Request, res as Response, next);
  
//       expect(editTeam).toHaveBeenCalledWith('validObjectId', req.body);
//       expect(next).toHaveBeenCalledWith({ code: 403, msg: 'We could not perform the update operation on the selected Team at the moment, please try again later' });
//       expect(res.status).not.toHaveBeenCalled();
//       expect(res.json).not.toHaveBeenCalled();
//     });
  
//     it('should handle internal server error', async () => {
//       (editTeam as jest.Mock).mockRejectedValue(new Error('Some error occurred'));
  
//       await updateTeamById(req as Request, res as Response, next);
  
//       expect(editTeam).toHaveBeenCalledWith('validObjectId', req.body);
//       expect(next).toHaveBeenCalledWith({ code: 500, msg: 'internal server error, please try again later' });
//       expect(res.status).not.toHaveBeenCalled();
//       expect(res.json).not.toHaveBeenCalled();
//     });
//   });