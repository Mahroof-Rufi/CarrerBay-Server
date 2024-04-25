import { Schema, model } from "mongoose";
import user from "../../domain/user";

const userSchema: Schema<user> = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const userModel = model<user>('user', userSchema);

export default userModel