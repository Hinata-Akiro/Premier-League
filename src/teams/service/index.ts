import { ITeam } from "../interface";
import Team from "../model";
import { deleteDocument } from "../../utils/crud";
import Fuse from 'fuse.js';


const createTeam = async (createTeamData: ITeam) => {
    return await Team.create(createTeamData);
};

const deleteTeam = deleteDocument(Team)

const findOne = (id:string) => {
    return Team.findOne({ _id: id });
  };

const findAll = () =>{
    return Team.find().sort({createdAt: 1});
}

const editTeam = (id: string, details: Partial<ITeam>) => {
    return Team.updateOne(
      { _id: id },
      { $set: { ...details } },
      { new: true, runValidators: true }
    );
  };

  const initializeTeamFuse = (teams: ITeam[]) => {
    const options = {
      keys: ['name', 'country', 'city', 'stadium'],
      };
      return new Fuse(teams, options);
};

const searchTeams = async (query: string) => {
    const allTeams = await Team.find();
    const teamFuse = initializeTeamFuse(allTeams);
    return teamFuse.search(query);
};


export { createTeam , deleteTeam, editTeam , findOne, findAll,searchTeams};