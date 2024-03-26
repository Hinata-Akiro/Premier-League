import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { createFixture,deleteFixture,editFixture,findAll,findOne,getFixtureByUniqueLink,getFixturesByStatus,searchFixtures } from '../service';
import { searchTeams } from '../../teams/service';
import { fetchAll, fetchOne } from '../../utils/crud';
import mongoose,{ Types } from 'mongoose';
import { setToCache } from '../../middleware/caching-middleware';
import { IFixtures } from '../interface';




const createNewFixture = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const homeTeam = req.query.homeTeam  as string
    const awayTeam = req.query.awayTeam as string


    if (!homeTeam || !mongoose.Types.ObjectId.isValid(homeTeam) ||
    !awayTeam || !mongoose.Types.ObjectId.isValid(awayTeam)) {
        return next({ code: 400, msg: "Invalid home team ID or away team ID." });
     }

    try {
        const { code, msg, data } = await createFixture({homeTeam, awayTeam, ...req.body});
        if (code === 201) {
            return res.status(code).send({ msg: msg, data: data});
        }else if (code === 400) {
            return res.status(code).send({ msg: msg });
        }
    } catch (error) {
        return next({ code: 500, msg: "Internal Server Error", error });
    }
}

const deleteFixtureById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fixtureId = req.params.id;
        
        if (!fixtureId || !mongoose.Types.ObjectId.isValid(fixtureId)) {
            return next({ code: 400, msg: 'Invalid fixture ID' });
        }
        const response = await deleteFixture(fixtureId);
        if (response.acknowledged && response.deletedCount) {
            return res.status(200).json({ code: 200, msg: "Successfully deleted" });
        } else {
            return next({ code: 404, msg: 'Fixture data not found' });
        }
    } catch (error) {
        return next({ code: 500, msg: 'internal server error, please try again later' });
    }
}


const editFixtureById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const fixtureId = req.params.id;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (!fixtureId || !mongoose.Types.ObjectId.isValid(fixtureId)) {
            return next({ code: 400, msg: 'Invalid fixture ID' });
        }

        const response = await editFixture(fixtureId, req.body);
        if (response.acknowledged && response.modifiedCount) {
            return res.status(200).json({ code: 200, msg: "Successfully updated" });
        } else {
            return next({ code: 404, msg: 'Fixture data not found' });
        }
    } catch (error: any) {
        return next({ code: 500, msg: 'internal server error, please try again later' || error.message });
    }
}

const findFixtureByUniqueLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const uniqueLink = req.params.uniqueLink;
        if (!uniqueLink) {
            return next({ code: 400, msg: 'Invalid uniqueLink' });
        }
        const response = await getFixtureByUniqueLink(uniqueLink);
        if (response) {
            const cacheKey = req.originalUrl
            await setToCache(cacheKey,response,600)
            return res.status(200).json({ code: 200, msg: "Successfully fetched", data: response });
        } else {
            return next({ code: 404, msg: 'Fixture not found'  });
        }
    } catch (error: any) {
        return next({ code: 500, msg: 'internal server error, please try again later'|| error.message });
    }
}

const findFixturesByStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const status = req.params.status;
        if (!status) {
            return next({ code: 400, msg: 'Invalid status' });
        }
        const response:IFixtures[] = await getFixturesByStatus(status);
        if (response.length > 0) {
            const cacheKey = req.originalUrl
            await setToCache(cacheKey,response,600)
            return res.status(200).json({ code: 200, msg: "Successfully fetched", data: response });
        } else {
            return next({ code: 404, msg: 'Fixtures not found'  });
        }
    } catch (error:any) {
        return next({ code: 500, msg: 'internal server error, please try again later'|| error.message });
    }
}

const searchHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const searchQuery: string = req.query.searchQuery as string;
        if (!searchQuery) {
            return res.status(400).json({ msg: 'Search query is required' });
        }

        const fixtureResults = await searchFixtures(searchQuery);
        const teamResults = await searchTeams(searchQuery);

        if (fixtureResults.length === 0 && teamResults.length === 0) {
            return res.status(404).json({ message: 'No results found for the provided query' });
        }

        const cacheKey = req.originalUrl
        await setToCache(cacheKey,teamResults,600)

        return res.status(200).json({msg:"data retrieved successfully", fixtures: fixtureResults, teams: teamResults });
    } catch (error:any) {
        return next({ code: 500, msg: 'internal server error, please try again later'|| error.message });
    }
};

const getOneFixture = fetchOne(findOne)
const getAllFixtures = fetchAll(findAll)


export { createNewFixture, deleteFixtureById, editFixtureById, getOneFixture, getAllFixtures,findFixtureByUniqueLink,findFixturesByStatus , searchHandler};