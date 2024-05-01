import Otp from "../../domain/OTP";
interface OTP {
    insertOTP(email:string,otp:number): Promise<boolean>
    getOtpByEmail(email:string) : Promise<Otp | null>
    deleteMany(email:string): Promise<boolean | null>
}
export default OTP