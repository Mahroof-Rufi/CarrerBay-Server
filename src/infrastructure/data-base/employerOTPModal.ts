import { model, Schema } from "mongoose";
import OTP from "../../domain/OTP";

const employerOTPSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    OTP: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
})

const employerOTPModel = model<OTP>('employerOTP', employerOTPSchema)

export default employerOTPModel  