import { IFixtures } from "../interface";
import Fixtures from "../model/fixture-schema";
import Team from "../../teams/model";
import { deleteDocument } from "../../utils/crud";
import mongoose,{ Types } from 'mongoose';
import shortid from 'shortid';
import Fuse from 'fuse.js';



const createFixture = async ({ homeTeam, awayTeam, ...createFixture }: IFixtures) => {
    const [existingHomeTeam, existingAwayTeam] = await Promise.all([
        Team.findOne({ _id: homeTeam }),
        Team.findOne({ _id: awayTeam })
      ]);


      const errorMessage = (!existingHomeTeam && !existingAwayTeam) ? "Home and away teams not found" :
      (!existingHomeTeam) ? "Home team not found" :
      "Away team not found";


     if (!existingHomeTeam || !existingAwayTeam) {
       return {
        code: 400,
        msg: errorMessage,
     };
    }
    

  const newFixture = await Fixtures.create({
    homeTeam: existingHomeTeam._id,
    awayTeam: existingAwayTeam._id,
    ...createFixture,
    uniqueLink: shortid.generate()
});

  return {
    code: 201,
    msg: "Fixture created successfully",
    data: newFixture,
  };
};

const deleteFixture = deleteDocument(Fixtures)

const findOne = (id: string) => {
    const result =  Fixtures.findOne({_id: id}).populate('homeTeam', 'name')
    .populate('awayTeam', 'name')

    return result;
};


const getFixtureByUniqueLink = (uniqueLink: string) => {
    const result =  Fixtures.aggregate([
        { $match: { uniqueLink: uniqueLink } }, 
        { $lookup: { from: "teams", localField: "homeTeam", foreignField: "_id", as: "homeTeam" } },
        { $lookup: { from: "teams", localField: "awayTeam", foreignField: "_id", as: "awayTeam" } },
        { $unwind: { path: "$homeTeam", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$awayTeam", preserveNullAndEmptyArrays: true } },
        { 
            $project: { 
                _id: 1, 
                homeTeam: "$homeTeam.name", 
                awayTeam: "$awayTeam.name", 
                date: 1, 
                time: 1, 
                homeScore: 1, 
                awayScore: 1, 
                status: 1 
            } 
        }
    ]);

    return result;
};


const findAll = () => {
   const result = Fixtures.aggregate([
        { $lookup: { from: "teams", localField: "homeTeam", foreignField: "_id", as: "homeTeam" } },
        { $lookup: { from: "teams", localField: "awayTeam", foreignField: "_id", as: "awayTeam" } },
        { $unwind: { path: "$homeTeam", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$awayTeam", preserveNullAndEmptyArrays: true } },
        { 
            $project: { 
                _id: 1, 
                homeTeam: "$homeTeam.name", 
                awayTeam: "$awayTeam.name", 
                date: 1, 
                time: 1, 
                homeScore: 1, 
                awayScore: 1, 
                uniqueLink: 1,
                status: 1 ,
                createdAt: 1,
                updatedAt: 1
            } 
        },
        { $sort: { createdAt: 1 } }
    ]);

    return result;
}


const editFixture = (id: string, data: Partial<IFixtures>) => {
    return Fixtures.updateOne(
        { _id: id },
        { $set: {...data} },
        { new: true, runValidators: true }
    )
}

const getFixturesByStatus = (status: string) => {
    const result = Fixtures.aggregate([
        { $match: { status: status.toUpperCase() } }, 
        { $lookup: { from: "teams", localField: "homeTeam", foreignField: "_id", as: "homeTeam" } },
        { $lookup: { from: "teams", localField: "awayTeam", foreignField: "_id", as: "awayTeam" } },
        { $unwind: { path: "$homeTeam", preserveNullAndEmptyArrays: true } },
        { $unwind: { path: "$awayTeam", preserveNullAndEmptyArrays: true } },
        { 
            $project: { 
                _id: 1, 
                homeTeam: "$homeTeam.name", 
                awayTeam: "$awayTeam.name", 
                date: 1, 
                time: 1, 
                homeScore: 1, 
                awayScore: 1, 
                status: 1 
            } 
        },
        { $sort: { createdAt: 1 } } 
    ]);

    return result;
}

const initializeFixtureFuse = (fixtures: IFixtures[]) => {
    const options = {
        keys: ['homeTeam.name', 'awayTeam.name', 'date', 'time',"status"]
      };
    return new Fuse(fixtures, options);
};

const searchFixtures = async (query: string) => {
    const allFixtures = await Fixtures.find().populate('homeTeam', 'name')
    .populate('awayTeam', 'name')
    const fixtureFuse = initializeFixtureFuse(allFixtures);
    return fixtureFuse.search(query); 
};



export {
    createFixture,
    deleteFixture,
    findOne,
    findAll,
    editFixture,
    getFixtureByUniqueLink,
    getFixturesByStatus,
    searchFixtures,
}