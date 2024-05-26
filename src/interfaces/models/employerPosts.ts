import mongoose from "mongoose";
import { Post } from "./subModels/posts";

export interface EmployerPosts {
    employer_id?: mongoose.Types.ObjectId;
    posts: Post[];
}

export { Post }