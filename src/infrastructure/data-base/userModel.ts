import { Schema, model } from "mongoose";
import user from "../../domain/user";

const userSchema: Schema<user> = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
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
    google_id: {
        type:String
    }
})

const userModel = model<user>('user', userSchema);

export default userModel