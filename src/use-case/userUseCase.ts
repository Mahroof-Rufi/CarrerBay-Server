import { education } from './../domain/user';
import { user, EditUser, experience } from "../domain/user";
import jobsRepository from "../infrastructure/repository/jobsRepository";
import userOTPRepository from "../infrastructure/repository/userOTPRepository";
import userRepository from "../infrastructure/repository/userRepository";
import GenerateOTP from "../infrastructure/utils/generateOTP";
import Jwt from "../infrastructure/utils/jwt";
import NodeMailer from "../infrastructure/utils/nodeMailer";
import appliedJobsRepository from '../infrastructure/repository/appliedJobsRepository';
import jobApplicantsRepository from '../infrastructure/repository/jobApplicantsRepository';
import PostsRepository from '../infrastructure/repository/postsRepository';


class userUseCase {

    constructor(
        private userRepository: userRepository,
        private jwt: Jwt,
        private generateOTP: GenerateOTP,
        private sendMail: NodeMailer,
        private userOTPRepo:userOTPRepository,
        private jobsRepository: jobsRepository,
        private appliedJobsRepository: appliedJobsRepository,
        private jobApplicantsRepository: jobApplicantsRepository,
        private postsRepository: PostsRepository
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
                console.log('before inserting');
                console.log(userData);
                
                
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
            const token = this.jwt.createToken(userData._id, 'Normal-User')
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
            const token = this.jwt.createToken(user._id, 'Normal-User')
            return {
                status: 200,
                token: token,
                userDate: user,
                message: 'Login successfully'
            }
        } else {
            const res:user = await this.userRepository.insertOne({firstName:fullName,email:email,g_id:google_id})
            if (res) {
                const token = this.jwt.createToken(res._id, 'Normal-User')
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

    async fetchUserDataWithToken(token:string) {
        const decode = this.jwt.verifyToken(token)
        const res = await this.userRepository.findById(decode?.id)
        if (res) {
            return {
                status: 200,
                userData: res,
                message: 'Operation success'
            }
        } else {
            return {
                status: 401,
                userData: res
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

    async updateUserProfile(newData:EditUser, user_id:string) {

        const allowedUpdates = [
            'firstName', 'lastName', 'profile_url', 'jobTitle', 'industry', 'DOB', 'gender', 'city', 'state',
            'remort', 'resume_url', 'portfolio_url', 'gitHub_url', 'about', 'experiences', 'educations', 'skills'
        ];
        console.log('kkkk');
        
        console.log(newData);
        
        const updateValidator = Object.keys(newData).every((update) => allowedUpdates.includes(update));

        if (!updateValidator) {
            return {
                status:405,
                message:'disallowed fields found'
            }
        }

        const userdata:user | null = await this.userRepository.findById(user_id)

        if (!userdata) {
            return {
                status:404,
                message:'User not found'
            }
        }

        const res = await this.userRepository.findByIdAndUpdate(user_id, newData)
        if (res) {
            return {
                status:201,
                updatedData:res,
                message:'User profile update succesfull'
            }
        } else {
            return {
                status:404,
                message:'User not found'
            }
        }
    }

    async updateUserExperience(user_id:string, experience:experience, exp_id?:string,) {
        if (exp_id) {
            
            const res = await this.userRepository.updateUserExperience(user_id, exp_id, experience)
            if (res) {
                return {
                    status:201,
                    updatedData:res,
                    message:'User added updated'
                }
            } else {
                return {
                    status:404,
                    message:'User not found 1'
                }
            }
        } else {
            const res = await this.userRepository.addUserExperience(user_id, experience)
            if (res) {
                return {
                    status:201,
                    updatedData:res,
                    message:'User experience updated'
                }
            } else {
                return {
                    status:404,
                    message:'User not found 2'
                }
            }
        }
    }

    async updateUserEducation(user_id:string, education:education, edcn_id?:string,) {
        if (edcn_id) {
            const res = await this.userRepository.updateUserEducation(user_id, education, edcn_id)
            if (res) {
                return {
                    status:201,
                    updatedData:res,
                    message:'User added updated'
                }
            } else {
                return {
                    status:404,
                    message:'User not found 1'
                }
            }
        } else {
            const res = await this.userRepository.addUserEducation(user_id, education)
            if (res) {
                return {
                    status:201,
                    updatedData:res,
                    message:'User education added successfully'
                }
            } else {
                return {
                    status:404,
                    message:'User not found'
                }
            }
        }
    }

    async updateUserSkills(user_id:string, skills:string[]) {
        const res = await this.userRepository.updateUserSkills(user_id, skills)
        if (res) {
            return {
                status:201,
                updatedData:res,
                message:'User skill updated successfully'
            }
        } else {
            return {
                status:404,
                message:'User not found'
            }
        }
    }

    async applyJobs(user_id:string, jobId:string) {
        const res = await this.appliedJobsRepository.addAppliedJob(user_id, jobId)
        if (!res) {
            return {
                status:404,
                message:'User not found'
            }
        } else {
            const job = await this.jobApplicantsRepository.addAppliedUser(jobId, user_id)
            
            if (!job) {
                return {
                    status:404,
                    message:'Job not found'
                }
            }
            return {
                status:201,
                message:'Job application succesfull',
                updatedJob:job,
                updatedUser:res
            }
        }
    }

    async verifyUserApplication(user_id:string, jobId:string) {
        const jobApplicants = await this.jobApplicantsRepository.findOneCandidate(jobId,user_id)
        if (jobApplicants) {
            if (jobApplicants) {
                return {
                    status:200,
                    isApplied:true,
                    message:'user application exists'
                }
            } else {
                return {
                    status:200,
                    isApplied:false,
                    message:'user application not found'
                }
            }      
        }
        return {
            status:200,
            isApplied:false,
            message:'Job not found'
        }
    }

    async fetchAppliedJobs(user_id:string) {
        const appliedJobs = await this.appliedJobsRepository.findOneById(user_id)
        if (!appliedJobs) {
            return {
                status:200,
                message:'Applied jobs not found'
            }
        }
        return {
            status:200,
            appliedJobs: appliedJobs,
            message:'Applied jobs found'
        }
    }
    
    async fetchPosts() {
        const posts = await this.postsRepository.fetchAllPosts()
        return {
            status:200,
            posts: posts,
            message:'Posts found'
        }
    }
}

export default userUseCase