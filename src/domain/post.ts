import mongoose from "mongoose";

export interface Comment {
    user_id: mongoose.Types.ObjectId;
    comment: string;
}

export interface Post {
    image_urls: string[];
    description: string;
    likes: string[];
    comments: Comment[];
    saved: string[];
}

export interface EmployerPosts {
    employer_id?: mongoose.Types.ObjectId;
    posts: Post[];
}