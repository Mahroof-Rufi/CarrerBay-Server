import { Schema, model } from "mongoose";
import admin from "../../domain/admin";

const adminSchema: Schema<admin> = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

const adminModel = model<admin>('admin', adminSchema);

export default adminModel