"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const fixtures_enum_1 = require("../enum/fixtures-enum");
const FixturesSchema = new mongoose_1.Schema({
    homeTeam: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team', required: true },
    awayTeam: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Team', required: true },
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
        enum: fixtures_enum_1.FixtureEnum,
        default: fixtures_enum_1.FixtureEnum.PENDING,
    },
    time: {
        type: String,
        required: true,
    },
    uniqueLink: { type: String, required: true, unique: true },
}, {
    timestamps: true,
});
const Fixtures = mongoose_1.default.model("Fixtures", FixturesSchema);
exports.default = Fixtures;
