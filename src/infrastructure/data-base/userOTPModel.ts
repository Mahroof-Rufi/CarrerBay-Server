import { model, Schema } from "mongoose";
import OTP from "../../domain/OTP";

const userOTPSchema = new Schema({
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