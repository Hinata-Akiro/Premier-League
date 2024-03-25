import supertest from "supertest";
import app from "../../app";
import testdb from "../testdb";
import { createUser,deleteUsers } from "../helper/test-helper";
import { createMockUser } from "../mock-data/mock-data";
import { hashPassword } from "../../utils/helper";
import { UserRole } from "../../users/enum";
import { IUser } from "../../users/interface";

const api = supertest(app);

beforeAll(async () => {
    testdb.dbConnect();
  });
  
  afterAll(async () => {
    testdb.dbDisconnect();
    testdb.dbCleanUp();
  });

 describe("POST /api/v1/users/register", () => {
    it("Should register a user when the body is correct", async () => {
        const payload = createMockUser
        const url = "/api/v1/users/register";

      const { body } = await api
      .post(url)
      .send(payload)
      .expect(201);
    expect(body).toMatchObject({
      code: 201,
      msg: "You have successfully signed up",
      data: {
        _id: expect.any(String),
        name: payload.name,
        email: payload.email,
        password: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: expect.any(Number),
      },
    });
    })

    it('should return an error message with status code 400 when a user with the same email already exists', async () => {
        const payload = createMockUser
        const url = "/api/v1/users/register";

     const {body} = await api
     .post(url)
     .send(payload)
     .expect(400);

     expect(body).toMatchObject({
         code: 400,
         msg: `User with email ${payload.email} already exisit`,
     })
    })
 });


 describe("POST /api/v1/users/login", () => {
    let userValue: IUser;
  beforeEach(async () => {
    userValue = await createUser({
      name: "victor barny",
      email: "victor@gmail.com",
      password: await hashPassword("password"),
      role: UserRole.Admin,
    });
  });

  afterEach(async () => {
    await deleteUsers();
  });

  it("Should login a user when the body is correct", async () => {
    const payload = {
      email: userValue.email,
      password: "password",
    };
    const url = "/api/v1/users/login";
    const { body } = await api.post(url).send(payload).expect(200)

    expect(body).toMatchObject({
      msg: "You have successfully logged in",
      token: expect.any(String),
      name: expect.any(String),
    });
   });

   it('should return an error message with status code 400 when the email or password is incorrect', async () => {
    const payload = {
      email: userValue.email,
      password: "<PASSWORD>",
    };
    const url = "/api/v1/users/login";
    const { body } = await api.post(url).send(payload).expect(400)

    expect(body).toMatchObject({
      msg: expect.any(String),
    });
   });

   it('should return an error message with status code 400 when the email or password is incorrect', async () => {
    const payload = {
      email:  "victord@gmail.com",
      password: "password",
    };
    const url = "/api/v1/users/login";
    const { body } = await api.post(url).send(payload).expect(400)
    expect(body).toMatchObject({
      msg: expect.any(String),
    });
    })

    it('should return an error message with status code 400 when the email or password is incorrect', async () => {
    const payload = {
      email:  "victord@gmail.com",
      password: "<PASSWORD>",
    };
    const url = "/api/v1/users/login";
    const { body } = await api.post(url).send(payload).expect(400)
    expect(body).toMatchObject({
      msg: expect.any(String),
    });
    })
 });
