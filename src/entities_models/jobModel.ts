import mongoose, { Schema, model } from "mongoose";
import Job from "../interfaces/models/job";
import employerModel from "./employerModel";

const jobSchema = new Schema<Job>({
    company_id: {
        type: String,
        ref: employerModel,
        required: true
    },
    jobTitle: {
        type: String,
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
    jobType: {
        type: String,
        required: true
    },
    minimumPay: {
        type: Number,
        required: true
    },
    maximumPay: {
        type: Number,
        required: true
    },
    payType: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true
    },
    workShift: {
        type: String,
        required: true
    },
    overView: {
        type: String,
        required: true
    },
    responsibilities: {
        type: [String],
        required: true
    },
    qualifications: {
        type: [String],
        required: true
    },
    postedAt: {
        type: Date,
        required: true
    },
    isClosed: {
        type: Boolean,
        required: true,
        default: false
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
})

const jobModel = model<Job>('job', jobSchema);

export default jobModel