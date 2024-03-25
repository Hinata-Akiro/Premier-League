import { register,login } from "../users/controller";
import { Router } from "express";
import { validateLoginUser, validateUser } from "../utils/validator";

const userRouter = Router();

userRouter.post("/register",validateUser, register);
userRouter.post("/login",validateLoginUser,login);


export default userRouter;