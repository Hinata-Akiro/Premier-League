import mongoose from "mongoose";
import { IUser } from "../interface";
import { UserRole } from "../enum";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: UserRole,
        default: UserRole.User,
    }
},
    { timestamps: true });

const User = mongoose.model<IUser>("User", userSchema);

export default User;