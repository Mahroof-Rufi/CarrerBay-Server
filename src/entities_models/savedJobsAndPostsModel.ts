import mongoose, { Schema, model } from "mongoose";

const jobs: Schema = new Schema({
    job_id: {
        type: mongoose.Types.ObjectId,
        ref: 'job'
    }
});

const posts: Schema = new Schema({
    post_id: {
        type: mongoose.Types.ObjectId,
        ref: 'post'
    }
});

const userSavedJobsAndPostSchema: Schema = new Schema({
    user_id: {
        type:mongoose.Types.ObjectId,
        ref:'user',
        required: true
    },
    savedJobs: [jobs],
    savedPosts: [posts],

})

const savedJobsAndPostsModel = model('savedJobsAndPosts', userSavedJobsAndPostSchema);

export default savedJobsAndPostsModel