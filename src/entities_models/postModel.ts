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
    }
});

const postsSchema: Schema = new Schema({
    employer_id: {
        type: mongoose.Types.ObjectId,
    },
    posts: {
        type: [postSchema]
    }
});

const postsModel = model<EmployerPosts>('posts', postsSchema);

export default postsModel;