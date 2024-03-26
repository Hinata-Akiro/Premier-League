import supertest from "supertest";
import app from "../../app";
import testdb from "../testdb";
import { createMockTeam } from "../mock-data/mock-data";
import { createTeam,createUser,deleteTeams, deleteUsers } from "../helper/test-helper";
import { ITeam } from "../../teams/interface";
import { IUser } from "../../users/interface";
import { createToken, hashPassword } from "../../utils/helper";
import { UserRole } from "../../users/enum";
import Team from "../../teams/model";


const api = supertest(app);


beforeAll(async () => {
    testdb.dbConnect();
  });
  
  afterAll(async () => {
    testdb.dbDisconnect();
    testdb.dbCleanUp();
  });


describe("createTeam", () => {
    let userValue: IUser;
    let userToken: string;
    beforeEach(async () => {
      userValue = await createUser({
        name: "victor barny",
        email: "victor@gmail.com",
        password: await hashPassword("password"),
        role: UserRole.Admin,
      });

     userToken = await createToken(userValue?._id as string)
    });
  
    afterEach(async () => {
      jest.clearAllMocks();
      await deleteUsers();
    });

    it("should create a team", async () => {
     const payload = createMockTeam
     const url = "/api/v1/teams/create-new-team";

     const {body} = await api
     .post(url)
     .set("Authorization", `Bearer ${userToken}`)
     .send(payload)
     .expect(201);
    
     expect(body).toMatchObject({
        code: 201,
        msg: "team created successfully",
        data: {
          _id: expect.any(String),
          name: payload.name,
          logo: payload.logo,
          country: payload.country,
          city: payload.city,
          stadium: payload.stadium,
          numberOfTitles: payload.numberOfTitles,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: expect.any(Number),
        },
      });
    });
    it("should return 400 with validation errors if request body is invalid", async () => {
         const {founded ,...rest} = createMockTeam
         
        const invalidPayload = { rest };
        const url = "/api/v1/teams/create-new-team";

        const { body } = await api
            .post(url)
            .set("Authorization", `Bearer ${userToken}`)
            .send(invalidPayload)
            .expect(400);

        expect(body).toHaveProperty("errors");
    });

    it("should return 500 if creating a team fails due to a database error", async () => {
        jest.spyOn(Team, "create").mockRejectedValueOnce(new Error("internal server error..., please try again"));
    
        const payload = createMockTeam;
        const url = "/api/v1/teams/create-new-team";
    
        const { body } = await api
            .post(url)
            .set("Authorization", `Bearer ${userToken}`)
            .send(payload)
            .expect(500);
    
        expect(body).toHaveProperty("error")
    });

    it("should return 400 if the team name already exists in the database", async () => {
        jest.spyOn(Team, "create").mockRejectedValueOnce({ code: 11000, keyValue: { name: "Existing Team" } });
    
        const payload = createMockTeam; 
        const url = "/api/v1/teams/create-new-team";
    
        const { body } = await api
            .post(url)
            .set("Authorization", `Bearer ${userToken}`)
            .send(payload)
            .expect(400);
    
        expect(body).toHaveProperty("error")
    });
});

describe("deleteTeamById", () => {
    let userValue: IUser;
    let userToken: string;
    let team: ITeam;
    beforeEach(async () => {
      userValue = await createUser({
        name: "victor barny",
        email: "victor@gmail.com",
        password: await hashPassword("password"),
        role: UserRole.Admin,
      });

     userToken = await createToken(userValue?._id as string)


      team = await createTeam({
        name: createMockTeam.name,
        country: "USA",
        city: "New York",
        stadium: "Stadium 1",
        founded: "2020-01-01",
        numberOfTitles: 1,
      });

    });
  
    afterEach(async () => {
      jest.clearAllMocks();
      await deleteUsers();
      await deleteTeams();
    });

    it("should return 400 if team ID is invalid", async () => {
        const invalidTeamId = "invalidId"; 
        const url = `/api/v1/teams/${invalidTeamId}/delete`;

        const { body } = await api
            .delete(url)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(400);

        expect(body).toHaveProperty("error")
    });

    it("should return 404 if team deletion operation fails", async () => {
        const validTeamId = team?._id; 
        const url = `/api/v1/teams/${validTeamId}/delete`;

        jest.spyOn(Team, "deleteOne").mockResolvedValueOnce({ acknowledged: true, deletedCount: 0 });

        const { body } = await api
            .delete(url)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(404);

        expect(body).toHaveProperty("error")
    });

    it("should return 200 if team is successfully deleted", async () => {
        const validTeamId = team?._id; 
        const url = `/api/v1/teams/${validTeamId}/delete`;

       
        jest.spyOn(Team, "deleteOne").mockResolvedValueOnce({ acknowledged: true, deletedCount: 1 });

        const { body } = await api
            .delete(url)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(200);

        expect(body).toEqual({
            code: 200,
            msg: "Successfully deleted",
        });
    });
});

describe("updateTeamById", () => {
    let userValue: IUser;
    let userToken: string;
    let team: ITeam;
    beforeEach(async () => {
      userValue = await createUser({
        name: "victor barny",
        email: "victor@gmail.com",
        password: await hashPassword("password"),
        role: UserRole.Admin,
      });

     userToken = await createToken(userValue?._id as string)


      team = await createTeam({
        name: createMockTeam.name,
        country: "USA",
        city: "New York",
        stadium: "Stadium 1",
        founded: "2020-01-01",
        numberOfTitles: 1,
      });

    });
  
    afterEach(async () => {
      jest.clearAllMocks();
      await deleteUsers();
      await deleteTeams();
    });

    it("should return 400 if team ID is invalid", async () => {
        const invalidTeamId = "invalidId"; 
        const url = `/api/v1/teams/${invalidTeamId}/update`;

        const { body } = await api
            .put(url)
            .set("Authorization", `Bearer ${userToken}`)
            .expect(400);

            expect(body).toHaveProperty("error")

    });

    it("should return 200 if team is successfully updated", async () => {
        const validTeamId = team?._id; 
        const url = `/api/v1/teams/${validTeamId}/update`;

        const { body } = await api
            .put(url)
            .set("Authorization", `Bearer ${userToken}`)
            .send({name:createMockTeam.name})
            .expect(200);

        expect(body).toEqual({
            code: 200,
            msg: "Successfully updated",
        });
    });
})

describe('fetchOne', () => {
    let userValue: IUser;
    let userToken: string;
    let team: ITeam;
    beforeEach(async () => {
      userValue = await createUser({
        name: "victor barny",
        email: "victor@gmail.com",
        password: await hashPassword("password"),
        role: UserRole.Admin,
      });

     userToken = await createToken(userValue?._id as string)


      team = await createTeam({
        name: createMockTeam.name,
        country: "USA",
        city: "New York",
        stadium: "Stadium 1",
        founded: "2020-01-01",
        numberOfTitles: 1,
      });

    });
  
    afterEach(async () => {
      jest.clearAllMocks();
      await deleteUsers();
      await deleteTeams();
    });

    it('should return data when valid ID is provided', async () => {
        const validTeamId = team?._id; 
        const url = `/api/v1/teams/${validTeamId}`;

        const { body } = await api
          .get(url)
          .set("Authorization", `Bearer ${userToken}`)
          .expect(200);

          expect(body).toEqual({
            code: 200,
            data: {
              _id: expect.any(String),
              name: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              __v: expect.any(Number),
              city: expect.any(String), 
              country: expect.any(String), 
              founded: expect.any(String),
              numberOfTitles: expect.any(Number),
              stadium: expect.any(String),
            },
          });
    })

    it('should return 404 if data is not found', async () => {
        const nonExistentId = '65fd9370e91efb6b1edddd83'; 
        const url = `/api/v1/teams/${nonExistentId}`;
    
        const { body } = await api
          .get(url)
          .set("Authorization", `Bearer ${userToken}`)
          .expect(404);
    
        expect(body).toEqual({
           error:{
            code: 404,
            msg: 'Data not found',
           }
        });
    });

    it('should return 400 if invalid ID is provided', async () => {
        const invalidId = 'invalidId'; 
        const url = `/api/v1/teams/${invalidId}`;
    
        const { body } = await api
          .get(url)
          .set("Authorization", `Bearer ${userToken}`)
          .expect(400);
    
          expect(body).toEqual({
            error: {
                code: 400,
                msg: 'Invalid  ID',
            },
        });
    });
});

describe('fetchAll', () => {
    let userValue: IUser;
    let userToken: string;
    let team: ITeam;
    beforeEach(async () => {
      userValue = await createUser({
        name: "victor barny",
        email: "victor@gmail.com",
        password: await hashPassword("password"),
        role: UserRole.Admin,
      });

     userToken = await createToken(userValue?._id as string)


      team = await createTeam({
        name: createMockTeam.name,
        country: "USA",
        city: "New York",
        stadium: "Stadium 1",
        founded: "2020-01-01",
        numberOfTitles: 1,
      });

    });
  
    afterEach(async () => {
      jest.clearAllMocks();
      await deleteUsers();
      await deleteTeams();
    });

    it('should return data and status code 200 if data is successfully fetched', async () => {
      const url = `/api/v1/teams`;
      const { body, status } = await api.get(url)
          .set("Authorization", `Bearer ${userToken}`);
  
      expect(status).toBe(200); 
      expect(body.msg).toBe("Successfully fetched");
      expect(body.data).toEqual(expect.any(Array)); 
      expect(body.data.length).toBeGreaterThan(0); 
      expect(body.data[0]).toEqual(expect.objectContaining({ 
          _id: expect.any(String),
          name: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: expect.any(Number),
          city: expect.any(String), 
          country: expect.any(String), 
          founded: expect.any(String),
          numberOfTitles: expect.any(Number),
          stadium: expect.any(String),
      }));
  });
});

