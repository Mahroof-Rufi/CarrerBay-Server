import employerOTPModel from "../../entities_models/employerOTPModal";
import otp from "../../interfaces/models/OTP"
import IOTPRepository from "../../interfaces/iRepositories/iOTPRepository";

class EmployerOTPRepository implements IOTPRepository {

    async insertOTP(email: string, otp: number): Promise<boolean> {
        try {
            await employerOTPModel.create({
                email:email,
                OTP:otp,
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
            let otp = await employerOTPModel.findOne({ email:email })
            return otp;
        } catch (error) {
            console.error(error);
            return null
        }
    }
       
}
export default EmployerOTPRepository