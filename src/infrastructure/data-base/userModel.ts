import { Schema, model } from "mongoose";
import { user } from "../../domain/user";

const userSchema: Schema<user> = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    profile_url: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
    },
    industry: {
        type: String,
    },
    DOB: {
        type: Date,
    },
    gender: {
        type: String,
    },
    about: {
        type: String,
    },
    google_id: {
        type:String
    },
    city: {
        type: String
    },
    state: {
        type:String
    },
    gitHub_url: {
        type:String
    },
    portfolio_url: {
        type:String
    },
    resume_url: {
        type:String
    },
    
})

const userModel = model<user>('user', userSchema);

export default userModel