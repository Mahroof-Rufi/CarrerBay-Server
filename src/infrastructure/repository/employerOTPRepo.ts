import OTP from "../../use-case/interface/OTP";
import employerOTPModel from "../data-base/employerOTPModal";
import otp from "../../domain/OTP"

class employerOTPRepo implements OTP{

    async insertOTP(email: string, otp: number): Promise<boolean> {
        try {
            await employerOTPModel.create({
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
            let otp = await employerOTPModel.findOne({email:email})
            return otp;
        } catch (error) {
            console.error(error);
            return null
        }
    }

    async deleteMany(email: string): Promise<boolean | null> {
        try {
            await employerOTPModel.deleteMany({email:email})
            return true
        } catch (error) {
            console.error(error);  
            return null          
        }
    }
       
}
export default employerOTPRepo