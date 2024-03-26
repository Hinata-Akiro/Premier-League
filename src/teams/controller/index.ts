import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { createTeam,deleteTeam ,editTeam,findOne, findAll} from '../service';
import mongoose from 'mongoose';
import { fetchAll, fetchOne } from '../../utils/crud';



const createNewTeam = async (req: Request, res: Response, next: NextFunction) => {
   try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const response = await createTeam(req.body)

    return res.status(201).send({
        code: 201,
        msg: "team created successfully",
        data: response
    })
   } catch (error:any) {
    return next({
        code: error.code === 11000 ? 400 : 500,
        msg: error.code === 11000 
            ? `Team with ${error.keyValue.name} already exists`
            : error.message || "internal server error..., please try again"
    });
   }
};

const deleteTeamById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teamId = req.params.id;
        if (!teamId || !mongoose.Types.ObjectId.isValid(teamId)) {
            return next({ code: 400, msg: 'Invalid team ID' });
        }
        const response = await deleteTeam(teamId);
        if (response.acknowledged && response.deletedCount) {
            return res.status(200).json({ code: 200, msg: "Successfully deleted" });
        } else {
            return next({ code: 404, msg: 'Team id not found' });
        }
    } catch (error) {
        return next({ code: 500, msg: 'internal server error, please try again later' });
    }
}

const updateTeamById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teamId = req.params.id;
        if (!teamId ||!mongoose.Types.ObjectId.isValid(teamId)) {
            return next({ code: 400, msg: 'Invalid team ID' });
        }
        const response = await editTeam(teamId, req.body);
        if (response.acknowledged && response.modifiedCount) {
            return res.status(200).json({ code: 200, msg: "Successfully updated" });
        } else {
            return next({ code: 404, msg: 'Team id not found' });
        }
    } catch (error) {
        return next({ code: 500, msg: 'internal server error, please try again later' });
    }
};

const getOneTeam = fetchOne(findOne)
const getAllTeams = fetchAll(findAll)

export {createNewTeam, deleteTeamById,updateTeamById, getOneTeam, getAllTeams}