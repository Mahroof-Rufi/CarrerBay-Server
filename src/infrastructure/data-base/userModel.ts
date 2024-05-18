import mongoose, { Schema, model } from "mongoose";
import { education, experience, user } from "../../domain/user";


const experienceSchema = new Schema<experience>({
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


const educationSchema = new Schema<education>({
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
    experiences: {
        type: [experienceSchema]
    },
    educations: {
        type: [educationSchema]
    },
    skills: {
        type: [String],
    },
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'job' }]
})

const userModel = model<user>('user', userSchema);

export default userModel