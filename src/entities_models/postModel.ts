import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import { EmployerPosts, Post } from "../interfaces/models/employerPosts";

const commentSchema: Schema = new Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const postSchema: Schema = new Schema({
    image_urls: {
        type: [String],
    },
    description: {
        type: String
    },
    likes: {
        type: [String]
    },
    comments: {
        type: [commentSchema]
    },
    saved: {
        type: [String]
    },
    postedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
});

const postsSchema: Schema = new Schema({
    employer_id: {
        type: mongoose.Types.ObjectId,
    },
    posts: {
        type: [postSchema]
    }
});

const postsModel = model<EmployerPosts>('post', postsSchema);

export default postsModel;