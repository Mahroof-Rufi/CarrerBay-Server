import OTP from "../../use-case/interface/OTP";
import otp from "../../domain/OTP"
import otpModel from "../data-base/userOTPModel";

class OtpRepo implements OTP{

    async insertOTP(email: string, otp: number): Promise<boolean> {
        try {
            await otpModel.create({
                email: email,
                OTP: otp
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

    async deleteMany(email: string): Promise<boolean | null> {
        try {
            await otpModel.deleteMany({email:email})
            return true
        } catch (error) {
            console.error(error);     
            return null       
        }
    }
       
}
export default OtpRepo