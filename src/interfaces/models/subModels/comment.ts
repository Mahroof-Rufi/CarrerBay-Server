import mongoose from "mongoose";

export interface Comment {
    user_id: mongoose.Types.ObjectId;
    comment: string;
}