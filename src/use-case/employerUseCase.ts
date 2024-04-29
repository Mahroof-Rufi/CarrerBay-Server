import employer from "../domain/employer";
import employerRepo from "./interface/employerController";
import employerOTPRepo from "../infrastructure/repository/employerOTPRepo";
import GenerateOTP from "../infrastructure/utils/generateOTP";
import NodeMailer from "../infrastructure/utils/nodeMailer";
import Jwt from "../infrastructure/utils/jwt";

class employerUseCase {

    constructor(
        private employerRepository:employerRepo,
        private employerOTPRepo:employerOTPRepo,
        private GenerateOTP:GenerateOTP,
        private mailer:NodeMailer,
        private jwt:Jwt) {}

    async sendOTP(email:string) {
        const OTP = this.GenerateOTP.generateOTP()
        const employer = this.employerRepository.findByEmail(email)
        if (!email) {
            const res = await this.mailer.sendMail(email,parseInt(OTP))
            this.employerOTPRepo.insertOTP(email,parseInt(OTP))
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

    async register(employerData:employer) {
        const employer = await this.employerRepository.findByEmail(employerData.email)
        if(!employer) {
            const otp = await this.employerOTPRepo.getOtpByEmail(employerData.email)
            if (otp?.OTP == employerData.OTP) {
                await this.employerRepository.insertOne(employerData)
                return {
                    status: 200,
                    data: 'Registration successfull'
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

    async login(email:string, password:string) {
        const employerData = await this.employerRepository.findByEmail(email)

        if (employerData) {
            if (password !== employerData.password) {
                return {
                    status: 400,
                    message: 'Invalid credentials'
                }
            }
            const token = this.jwt.createToken(employerData.id, 'Normal-employer')
            return {
                status: 200,
                token: token,
                userDate: employerData,
                message: 'Login successfully'
            }
        } else {
            return {
                status: 400,
                message: 'Data not found'
            }
        }
    }
}

export default employerUseCase