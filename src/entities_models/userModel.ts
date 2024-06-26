import mongoose, { Schema, model } from "mongoose";
import { User } from "../interfaces/models/user";
import { Experience } from "../interfaces/models/subModels/experience";
import { Education } from "../interfaces/models/subModels/education";


const experienceSchema = new Schema<Experience>({
    jobTitle: {
        type: String, 
        required: true 
    },
    companyName: { 
        type: String, 
        required: true 
    },
    jobType: { 
        type: String, 
        required: true 
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date 
    },
    present: { 
        type: Boolean, 
        required: true 
    },
    city: { 
        type: String 
    },
    state: { 
        type: String 
    },
    remort: { 
        type: Boolean, 
        required: true 
    },
    overView: { 
        type: String, 
        required: true 
    },
    technologies: { 
        type: [String], 
        required: true 
    }
});


const educationSchema = new Schema<Education>({
    universityName: {
        type:String,
        required:true
    },
    subject: {
        type:String,
        required:true
    },
    startDate: {
        type:Date,
        required:true
    },
    endDate: {
        type:Date
    },
    present: {
        type:Boolean,
        required:true
    },
    city: {
        type:String,
    },
    state: {
        type:String
    },
    distance: {
        type:Boolean,
        required:true
    }
});


const userSchema: Schema<User> = new Schema({
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
    experiences: {
        type: [experienceSchema]
    },
    educations: {
        type: [educationSchema]
    },
    skills: {
        type: [String],
    },
    isActive: {
        type: Boolean,
        default: true
    },
    joinedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const userModel = model<User>('user', userSchema);

export default userModel