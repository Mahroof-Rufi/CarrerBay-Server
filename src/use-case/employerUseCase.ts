import employer from "../domain/employer";
import employerRepository from "../infrastructure/repository/employerRepository";
import employerOTPRepository from "../infrastructure/repository/employerOTPRepository";
import GenerateOTP from "../infrastructure/utils/generateOTP";
import NodeMailer from "../infrastructure/utils/nodeMailer";
import Jwt from "../infrastructure/utils/jwt";

class employerUseCase {

    constructor(
        private employerRepository:employerRepository,
        private employerOTPRepoitory:employerOTPRepository,
        private GenerateOTP:GenerateOTP,
        private mailer:NodeMailer,
        private jwt:Jwt) {}

    async sendOTP(email:string) {
        const OTP = this.GenerateOTP.generateOTP()
        const employer = await this.employerRepository.findByEmail(email)
        if (!employer) {
            const res = await this.mailer.sendMail(email,parseInt(OTP))
            this.employerOTPRepoitory.insertOTP(email,parseInt(OTP))
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
            const otp = await this.employerOTPRepoitory.getOtpByEmail(employerData.email)
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

    async forgotpasswordSendOTP(email:string) {
        const company = await this.employerRepository.findByEmail(email)       
        
        if(company) {
            const OTP = this.GenerateOTP.generateOTP()
            const res = await this.mailer.sendMail(email, parseInt(OTP))
            this.employerOTPRepoitory.insertOTP(email, parseInt(OTP))
            if (res) {
                return {
                    status: 200,
                    message: 'OTP send successfully'
                }
            } else {
                return {
                    status: 400,
                    message: 'OTP sending failed, try again'
                }
            }
        } else {
            return {
                status:400,
                message: 'Email not exists'
            }
        }
    }

    async resetPassword(email:string, OTP:number, password:string) {
        const realOTP = await this.employerOTPRepoitory.getOtpByEmail(email)
        if (realOTP?.OTP == OTP) {
            const res = await this.employerRepository.updatePassword(email, password)
            if (res) {
                return {
                    status: 200,
                    message: 'Password updated Successfully'
                }
            } else {
                return {
                    status: 400,
                    message: 'Something went wrong'
                }
            }
        } else {
            return {
                status: 400,
                message: 'Invalid OTP'
            }
        }
    }
}

export default employerUseCase