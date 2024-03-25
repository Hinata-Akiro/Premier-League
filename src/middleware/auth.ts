import { Request, Response, NextFunction } from "express";
import User from "../users/models/user-model";
import { accessToken } from "../utils/helper";
import { TokenExpiredError } from "jsonwebtoken";
import { UserRole } from "../users/enum";


const authGuard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
    const response =  accessToken(token);
    if (response.code === 401) {
        return res.status(401).send({
            msg:response.msg,
            error: "Unauthorized",
        });
    }

    const user = await User.findById(response.id);

    if (!user) {
        return res.status(404).send({
            msg: "User not found",
            error: "User not found",
        });
    }
    req.user = user;
    return next();
    } catch (error:any) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).send({
                msg: "Token has expired",
                error: "Token has expired",
            });
        }
    }
};


const adminGuard = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user.role !== UserRole.Admin) {
        return res.status(403).send({
            msg: "Forbidden: You do not have permission to access this resource",
            error: "Forbidden",
        });
    }

    return next();
};


export { authGuard, adminGuard };