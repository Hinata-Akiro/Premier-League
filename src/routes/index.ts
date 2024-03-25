import { Router } from "express";
import userRouter from "./users-routes";
import teamRouter from "./teams-routes";
import fixtureRouter from "./fixtures-route"

const router = Router();

router.use("/users", userRouter);

router.use("/teams", teamRouter);

router.use("/fixtures", fixtureRouter);


export default router;


