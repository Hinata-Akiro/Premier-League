import Team from "../../teams/model";
import Fixtures from "../../fixtures/model/fixture-schema";
import User from "../../users/models/user-model";
import { IFixtures } from "../../fixtures/interface";
import { IUser } from "../../users/interface";
import { ITeam } from "../../teams/interface";

const createUser = (payload: IUser) => {
    return User.create(payload);
}

const createFixture = (payload: IFixtures) => {
    return Fixtures.create(payload);
}

const createTeam = (payload: ITeam) => {
    return Team.create(payload);
}

const deleteUsers = () => {
    return User.deleteMany({});
}

const deleteTeams = () => {
    return Team.deleteMany({});
}

const deleteFixtures = () => {
    return Fixtures.deleteMany({});
}

export { createUser, createFixture, createTeam, deleteFixtures, deleteTeams, deleteUsers};