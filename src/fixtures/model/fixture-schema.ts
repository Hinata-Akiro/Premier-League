import mongoose, { Schema, Document } from 'mongoose';
import { IFixtures } from '../interface';
import { FixtureEnum } from '../enum/fixtures-enum';

const FixturesSchema: Schema = new Schema({
    homeTeam: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    awayTeam: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    date: {
        type: Date,
        required: true,
    },
    homeScore: {
        type: Number,
        default: 0,
        required: true,
    },
    awayScore: {
        type: Number,
        default: 0,
        required: true,
    },
    status: {
        type: String,
        enum: FixtureEnum,
        default: FixtureEnum.PENDING,
    },
    time: {
        type: String,
        required: true,
    },
    uniqueLink: { type: String, required: true, unique: true },
},{
    timestamps: true,
});


const Fixtures = mongoose.model<IFixtures>("Fixtures", FixturesSchema);

export  default Fixtures