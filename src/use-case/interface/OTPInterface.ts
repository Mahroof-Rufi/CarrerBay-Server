import Otp from "../../domain/OTP";
interface OTPInterface {
    insertOTP(email:string,otp:number): Promise<boolean>
    getOtpByEmail(email:string) : Promise<Otp | null>
}
export default OTPInterface