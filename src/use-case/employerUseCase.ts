import employer from "../domain/employer";
import employerRepository from "../infrastructure/repository/employerRepository";
import employerOTPRepository from "../infrastructure/repository/employerOTPRepository";
import GenerateOTP from "../infrastructure/utils/generateOTP";
import NodeMailer from "../infrastructure/utils/nodeMailer";
import Jwt from "../infrastructure/utils/jwt";
import jobsRepository from "../infrastructure/repository/jobsRepository";
import Job from "../domain/job";
import jobApplicantsRepository from "../infrastructure/repository/jobApplicantsRepository";
import appliedJobsRepository from "../infrastructure/repository/appliedJobsRepository";
import PostsRepository from "../infrastructure/repository/postsRepository";

class employerUseCase {

    constructor(
        private employerRepository:employerRepository,
        private employerOTPRepoitory:employerOTPRepository,
        private jobRepository:jobsRepository,
        private GenerateOTP:GenerateOTP,
        private mailer:NodeMailer,
        private jwt:Jwt,
        private jobApplicantsRepository:jobApplicantsRepository,
        private usersAppliedJobs:appliedJobsRepository,
        private postsRepository:PostsRepository
    ) {}

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

    async login(email:string, employerPassword:string) {
        const employerData = await this.employerRepository.findByEmail(email)

        if (employerData) {    
            if (employerPassword !== employerData.password) {
                return {
                    status: 400,
                    message: 'Invalid credentials'
                }
            }
            console.log('here the employer data');
            console.log(employerData);
            
            
            const token = this.jwt.createToken(employerData._id, 'Normal-employer')
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
        const decode = this.jwt.verifyToken(token)
        const res = await this.employerRepository.findById(decode?.id)
        if (res) {
            return {
                status:200,
                employerData:res,
                message:'Operation success'
            }
        } else {
            return {
                status:401,
                message:'Unauthorized Access'
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

    async updateProfile(newData:employer) {
        const data = await this.employerRepository.updateProfile(newData.email, newData)
        if (data) {
            const updatedData = await this.employerRepository.findByEmail(data.email)
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
        const otp = await this.employerOTPRepoitory.getOtpByEmail(email)
        if (otp?.OTP == OTP) {
            const updatedData = await this.employerRepository.updateEmail(email,newMail)
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

    async fetchJobs(token:string, title?:string | undefined) {
        const decode = this.jwt.verifyToken(token)
        const jobs = await this.jobRepository.fetch8Jobs(decode?.id, title)
        return {
            status: 200,
            jobs: jobs
        }        
    }

    async addNewJobPost(jobData:Job, token:string) {
        const decode = this.jwt.verifyToken(token)
        jobData.company_id = decode?.id
        const currentDate = new Date()
        jobData.postedAt = currentDate
        jobData.active = true
        const job = await this.jobRepository.insertOneJob(jobData)
        if (job) {
            return {
                status: 200,
                message: 'Job Post Successfull',
                job: job
            }
        } else {
            return {
                status: 400,
                message: 'Something went wrong'
            }
        }
    }

    async editJobPost(jobId:string, jobData:Job) {
        const updatedJob = await this.jobRepository.updateJobByID(jobId, jobData)
        if (updatedJob) {
            return {
                status: 200,
                message: 'Job Post updated succesfully',
                updatedJob: updatedJob
            }
        } else {
            return {
                status: 400,
                message: 'Something went wrong update job'
            }
        }
    }

    async deleteJob(jobId:string) {
        const res = await this.jobRepository.deleteJobById(jobId)
        if (res) {
            return {
                status:200,
                message:'Job deleted successfully'
            }
        } else {
            return {
                status:401,
                message:'Something went wrong'
            }
        }
    }

    async fetchJobApplicants(jobId:string) {
        const res = await this.jobApplicantsRepository.findOne(jobId)
        if (res) {
            return {
                status:200,
                appliedUsers:res,
                message:'applied users found successfully'
            }
        } else {
            return {
                status:200,
                message:'applied users not found'
            }
        } 
    }

    async updateCandidateStatus(jobId:string, user_id:string, newStatus:string) {
        const res = await this.jobApplicantsRepository.updateCandidateStatus(jobId,user_id,newStatus)
        const updateUserSide = await this.usersAppliedJobs.updateJobStatusById(user_id, jobId, newStatus)
        if (res && updateUserSide) {
            return {
                status:200,
                updatedCandidateData:res,
                message:'Candidate status update successfull'
            }
        } else {
            return {
                status:404,
                message:'Candidate not found'
            }
        } 
    }

    async fetchPosts(token:string) {
        const decode = this.jwt.verifyToken(token)
        const posts = await this.postsRepository.fetchPostsById(decode?.id)
        if (posts) {
            return {
                status:200,
                posts:posts,
                message:'Posts found successfully'
            }
        }
        return {
            status: 404,
            message: 'Posts not found'
        }
    }

    async addPost(description:string,token:string, urls?:string[]) {
        const decode = this.jwt.verifyToken(token)
        const res = await this.postsRepository.addPost(description,decode?.id, urls)
        if (res) {
            return {
                status:201,
                message:'Post uploaded succesfully'
            }
        }
        return {
            status:400,
            message:'post upload failed'
        }
    }
}

export default employerUseCase