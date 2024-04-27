import Otp from "../../domain/OTP";
interface OTP {
    insertOTP(email:string,otp:number): Promise<boolean>
    getOtpByEmail(email:string) : Promise<Otp | null>
}
export default OTP