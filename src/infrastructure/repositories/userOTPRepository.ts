import otp from "../../interfaces/models/OTP"
import otpModel from "../../entities_models/userOTPModel";
import IOTPRepository from "../../interfaces/iRepositories/iOTPRepository";

class UserOTPRepository implements IOTPRepository{

    async insertOTP(email: string, otp: number): Promise<boolean> {
        try {
            await otpModel.findOneAndUpdate(
                { email:email },
                { OTP:otp, createdAt: Date.now() },
                { upsert:true }
            )
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
export default UserOTPRepository