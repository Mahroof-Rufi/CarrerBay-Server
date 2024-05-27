import mongoose, { Schema, model } from "mongoose";

const appliedUsersSchema: Schema = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    status: {
        type: String,
        required:true
    },
    rejected: {
        type: Boolean,
        required:true,
        default: false
    }
})

const jobApplicantsSchema: Schema = new Schema({
    job_id: {
        type: mongoose.Types.ObjectId,
        ref: 'job',
        required: true
    },
    appliedUsers: {
        type: [appliedUsersSchema]
    }
})

const jobApplicantsModel = model('jobApplicant', jobApplicantsSchema);

export default jobApplicantsModel