import user from "../domain/user";
import OtpRepo from "../infrastructure/repository/OTPRepo";
import GenerateOTP from "../infrastructure/utils/generateOTP";
import Jwt from "../infrastructure/utils/jwt";
import NodeMailer from "../infrastructure/utils/nodeMailer";
import UserRepo from "./interface/userController";


class userUseCase {

    constructor(
        private userRepo: UserRepo,
        private jwt: Jwt,
        private generateOTP: GenerateOTP,
        private sendMail: NodeMailer,
        private OtpRepo:OtpRepo) { }


    async sendOTP(email:string) {
        const OTP = this.generateOTP.generateOTP()   
        const user = this.userRepo.findByEmail(email) 
        if (!user) {
            const res = await this.sendMail.sendMail(email,parseInt(OTP));
            this.OtpRepo.insertOTP(email,parseInt(OTP))
            if (res) {
                return {
                    status: 200,
                    data: 'OTP send successfully'
                }
            } else {
                return {
                    status: 400,
                    data: 'OTP send failed, try again'
                }
            }
        } else {
            return {
                status: 400,
                data: 'Email already exists'
            }
        }
    }


    async signUp(userData: user) {
        const user = await this.userRepo.findByEmail(userData.email)
        if (!user) {
            const otp = await this.OtpRepo.getOtpByEmail(userData.email)
            if (otp?.OTP == userData.OTP) {
                await this.userRepo.insertOne(userData)
                return {
                    status: 200,
                    data: 'User registration successfull'
                }
            } else {
                return {
                    status: 400,
                    data: 'Invalid OTP'
                }
            }
        } else {
            return {
                status: 400,
                data: 'Email already exists'
            }
        }
    }

    async logIn(email: string, password: string) {
        const userData = await this.userRepo.findByEmail(email)

        if (userData) {
            if (password !== userData.password) {
                return {
                    status: 400,
                    message: 'Invalid credentials'
                }
            }
            const token = this.jwt.createToken(userData.id, 'Normal-User')
            return {
                status: 200,
                token: token,
                userDate: userData,
                message: 'Login successfully'
            }
        } else {
            return {
                status: 400,
                message: 'User not found'
            }
        }
    }

}

export default userUseCase