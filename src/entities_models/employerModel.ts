import { Schema, model } from "mongoose";
import employer from "../interfaces/models/employer";

const employerSchema: Schema<employer> = new Schema({
    companyName: {
        type: String,
        required: true
    },
    profile_url: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    noOfWorkersRange: {
        type: String,
    },
    web_url: {
        type: String,
    },
    instagram_url: {
        type: String,
    },
    X_url: {
        type: String
    },
    about: {
        type: String
    },
    isActive: {
        type: Boolean,
        default:true
    }
})

const employerModel = model<employer>('employer', employerSchema);

export default employerModel