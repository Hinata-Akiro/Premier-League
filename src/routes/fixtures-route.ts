import { Router } from "express";
import {createNewFixture, deleteFixtureById, editFixtureById, getOneFixture, getAllFixtures,findFixtureByUniqueLink,findFixturesByStatus,searchHandler} from "../fixtures/controller"
import { validateFixtures, validateStatus } from "../utils/validator";
import { authGuard, adminGuard } from "../middleware/auth";

const fixtureRouter = Router();


fixtureRouter.get('/', authGuard,adminGuard,getAllFixtures);

fixtureRouter.get('/search',searchHandler);

fixtureRouter.get('/:id',authGuard,adminGuard, getOneFixture);

fixtureRouter.post('/',authGuard,adminGuard, validateFixtures,createNewFixture);

fixtureRouter.put('/:id',authGuard,adminGuard, editFixtureById);

fixtureRouter.delete('/:id',authGuard,adminGuard, deleteFixtureById);

fixtureRouter.get('/link/:uniqueLink',authGuard,adminGuard,findFixtureByUniqueLink);

fixtureRouter.get('/status/:status',authGuard,validateStatus,findFixturesByStatus);



export default fixtureRouter;
