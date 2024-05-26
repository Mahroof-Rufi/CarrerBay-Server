import { model, Schema } from "mongoose";
import OTP from "../interfaces/models/OTP";

const userOTPSchema = new Schema<OTP>({
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

const otpModel = model<OTP>('userOtp', userOTPSchema)

export default otpModel  