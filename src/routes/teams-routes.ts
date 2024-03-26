import { createNewTeam , deleteTeamById, updateTeamById, getOneTeam,getAllTeams} from "../teams/controller";
import { Router } from "express";
import { validateTeam } from "../utils/validator";
import { adminGuard, authGuard } from "../middleware/auth";

const teamRouter = Router();

teamRouter.post("/create-new-team",authGuard,adminGuard, validateTeam ,createNewTeam);
teamRouter.delete("/:id/delete",authGuard,adminGuard, deleteTeamById)
teamRouter.put("/:id/update", authGuard,adminGuard,updateTeamById)
teamRouter.get("/:id",authGuard,adminGuard, getOneTeam)
teamRouter.get("/",authGuard,adminGuard, getAllTeams)




export default teamRouter;