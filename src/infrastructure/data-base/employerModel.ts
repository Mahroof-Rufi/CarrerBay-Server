import { Schema, model } from "mongoose";
import employer from "../../domain/employer";

const employerSchema: Schema<employer> = new Schema({
    companyName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    is_Verfied: {
        type: Boolean,
        required: true
    }
})

const employerModel = model<employer>('employer', employerSchema);

export default employerModel