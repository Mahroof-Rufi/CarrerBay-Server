import mongoose, { Schema, model } from "mongoose";

const appliedJobSchema: Schema = new Schema({
    job_id: {
        type: mongoose.Types.ObjectId,
        ref:'job'
    },
    status: {
        type: String,
        required:true
    },
    rejected: {
        type: Boolean,
        required:true,
        default: false
    },
    appliedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const userAppliedJobsSchema: Schema = new Schema({
    user_id: {
        type:mongoose.Types.ObjectId,
        ref:'user',
        required: true
    },
    appliedJobs: {
        type: [appliedJobSchema]
    }
})

const appliedJobsModel = model('appliedJob', userAppliedJobsSchema);

export default appliedJobsModel