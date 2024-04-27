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
    }
})

const otpModel = model<OTP>('otp', userOTPSchema)

export default otpModel  