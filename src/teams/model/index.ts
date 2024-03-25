import mongoose, { Schema, Document } from 'mongoose';
import { ITeam } from '../interface';

const teamSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    stadium: {
        type: String,
        required: true
    },
    founded: {
        type: Date,
        required: true
    },
    numberOfTitles: {
        type: Number,
        required: true
    }
},{
    timestamps: true
});

const Team = mongoose.model<ITeam>('Team', teamSchema);

export default Team;
