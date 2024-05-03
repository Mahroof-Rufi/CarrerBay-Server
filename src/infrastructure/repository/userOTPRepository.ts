import OTPInterface from "../../use-case/interface/OTPInterface";
import otp from "../../domain/OTP"
import otpModel from "../data-base/userOTPModel";

class userOTPRepository implements OTPInterface{

    async insertOTP(email: string, otp: number): Promise<boolean> {
        try {
            await otpModel.create({
                email: email,
                OTP: otp,
                createdAt: Date.now()
            })
            return true
        } catch (error) {
            console.error(error);
            return false
        }
    }

    async getOtpByEmail(email: string): Promise<otp | null> {
        try {
            let otp = await otpModel.findOne({email:email})
            return otp;
        } catch (error) {
            console.error(error);
            return null
        }
    }
       
}
export default userOTPRepository