import employer from "../interfaces/models/employer";
import employerRepository from "../infrastructure/repositories/employerRepository";
import employerOTPRepository from "../infrastructure/repositories/employerOTPRepository";
import GenerateOTP from "../providers/generateOTP";
import NodeMailer from "../providers/nodeMailer";
import Jwt from "../providers/jwt";

class EmployerUseCase {

    constructor(
        private readonly _employerRepository:employerRepository,
        private readonly _employerOTPRepository:employerOTPRepository,
        private readonly _OTPGenerator:GenerateOTP,
        private readonly _mailer:NodeMailer,
        private readonly _jwt:Jwt,
    ) {}

    async sendOTP(email:string) {
        const OTP = this._OTPGenerator.generateOTP()
        const employer = await this._employerRepository.findByEmail(email)
        if (!employer) {
            const res = await this._mailer.sendMail(email,parseInt(OTP))
            this._employerOTPRepository.insertOTP(email,parseInt(OTP))
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
        const employer = await this._employerRepository.findByEmail(employerData.email)
        if(!employer) {
            const otp = await this._employerOTPRepository.getOtpByEmail(employerData.email)
            if (otp?.OTP == employerData.OTP) {
                await this._employerRepository.insertOne(employerData)
                return {
                    status: 200,
                    data: 'Registration successful'
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

    async login(email:string, employerPassword:string) {
        const employerData = await this._employerRepository.findByEmail(email)

        if (employerData) {    
            if (employerPassword !== employerData.password) {
                return {
                    status: 400,
                    message: 'Invalid credentials'
                }
            } else if (!employerData.isActive) {
                return {
                    status:400,
                    message: 'This account blocked by Admin'
                }
            }
            
            
            const token = this._jwt.createToken(employerData._id, 'Normal-employer')
            const { password, ...employerDataWithoutPassword } = employerData;
            return {
                status: 200,
                token: token,
                employerData: employerDataWithoutPassword,
                message: 'Login successfully'
            }
        } else {
            return {
                status: 400,
                message: 'Data not found'
            }
        }
    }

    async fetchEmployerData(token:string) {
        const decode = this._jwt.verifyToken(token)
        const res = await this._employerRepository.findById(decode?.id)
        if (res) {
            return {
                status:200,
                employerData:res,
                message:'Operation success'
            }
        } else {
            return {
                status:401,
                message:'Employer not found'
            }
        }
    }

    async forgotpasswordSendOTP(email:string) {
        const company = await this._employerRepository.findByEmail(email)       
        
        if(company) {
            const OTP = this._OTPGenerator.generateOTP()
            const res = await this._mailer.sendMail(email, parseInt(OTP))
            this._employerOTPRepository.insertOTP(email, parseInt(OTP))
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
        const realOTP = await this._employerOTPRepository.getOtpByEmail(email)
        if (realOTP?.OTP == OTP) {
            const res = await this._employerRepository.updatePassword(email, password)
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

    async loadCompanies() {
        const employers = await this._employerRepository.fetchAllEmployers()
        if (!employers) {
            return {
                status:400,
                message:'Employers not found'
            }
        }
        return {
            status:200,
            message:'Employers found successfully',
            employers:employers
        }
    }

    async updateProfile(newData:employer) {
        const data = await this._employerRepository.updateProfile(newData.email, newData)
        if (data) {
            const updatedData = await this._employerRepository.findByEmail(data.email)
            return {
                status: 200,
                oldProfileUrl: data.profile_url,
                updatedData:updatedData,
                message: 'Profile updated successfully'
            }
        } else {
            return {
                status: 400,
                message: 'Something went wrong'
            }
        }
    }


    async updateEmailWithOTP(email:string, OTP:number, newMail:string) {
        const otp = await this._employerOTPRepository.getOtpByEmail(email)
        if (otp?.OTP == OTP) {
            const updatedData = await this._employerRepository.updateEmail(email,newMail)
            return {
                status: 200,
                message: 'Email updated Successfully',
                updatedData: updatedData
            }
        } else {
            return {
                status: 400,
                message: 'Invalid OTP',
            }
        }
    }
    
}

export default EmployerUseCase