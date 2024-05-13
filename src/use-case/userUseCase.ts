import user from "../domain/user";
import jobsRepository from "../infrastructure/repository/jobsRepository";
import userOTPRepository from "../infrastructure/repository/userOTPRepository";
import userRepository from "../infrastructure/repository/userRepository";
import GenerateOTP from "../infrastructure/utils/generateOTP";
import Jwt from "../infrastructure/utils/jwt";
import NodeMailer from "../infrastructure/utils/nodeMailer";


class userUseCase {

    constructor(
        private userRepository: userRepository,
        private jwt: Jwt,
        private generateOTP: GenerateOTP,
        private sendMail: NodeMailer,
        private userOTPRepo:userOTPRepository,
        private jobsRepository: jobsRepository
    ) { }


    async sendOTP(email:string) {
        const OTP = this.generateOTP.generateOTP()   
        const user = await this.userRepository.findByEmail(email) 
        if (!user) {
            const res = await this.sendMail.sendMail(email,parseInt(OTP));
            this.userOTPRepo.insertOTP(email,parseInt(OTP))
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
        const user = await this.userRepository.findByEmail(userData.email)
        if (!user) {
            const otp = await this.userOTPRepo.getOtpByEmail(userData.email)
            if (otp?.OTP == userData.OTP) {
                await this.userRepository.insertOne(userData)
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
        const userData = await this.userRepository.findByEmail(email)

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

    async gAuth(fullName:string, email: string, password: string, google_id:string) {
        const user = await this.userRepository.findByEmail(email)
        if (user) {
            const token = this.jwt.createToken(user.id, 'Normal-User')
            return {
                status: 200,
                token: token,
                userDate: user,
                message: 'Login successfully'
            }
        } else {
            const res:user = await this.userRepository.insertOne({firstName:fullName,email:email,password:password,id:google_id})
            if (res) {
                const token = this.jwt.createToken(res.id, 'Normal-User')
                return {
                    status: 200,
                    token: token,
                    userDate: user,
                    message: 'Login successfully'
                }
            }
            return {
                status: 400,
                message: 'Something went wrong'
            }
            
        }
    }

    async forgotpasswordSendOTP(email:string) {
        const user = await this.userRepository.findByEmail(email)       
        
        if(user) {
            const OTP = this.generateOTP.generateOTP()
            const res = await this.sendMail.sendMail(email, parseInt(OTP))
            this.userOTPRepo.insertOTP(email, parseInt(OTP))
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
        const realOTP = await this.userOTPRepo.getOtpByEmail(email)
        if (realOTP?.OTP == OTP) {
            const res = await this.userRepository.updatePassword(email, password)
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

    async fetchJobs() {
        const jobs = await this.jobsRepository.fetchAll6Jobs()
        return {
            status: 200,
            jobs: jobs
        }
    }

}

export default userUseCase