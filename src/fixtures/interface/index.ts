import { ObjectId } from "mongoose";
import { FixtureEnum } from "../enum/fixtures-enum";

export interface IFixtures {
    _id?: string;
    homeTeam?: string,
    awayTeam?: string,
    time: string,
    homeScore?: number,
    awayScore?: number
    date: Date,
    status:FixtureEnum,
    uniqueLink: string;
    createdAt?: string;
    updatedAt?: string;
}