import jobApplicantsModel from "../entities_models/jobApplicantsModel";
import adminRepository from "../infrastructure/repositories/adminRepository";
import AppliedJobsRepository from "../infrastructure/repositories/appliedJobsRepository";
import employerRepository from "../infrastructure/repositories/employerRepository";
import JobApplicantsRepository from "../infrastructure/repositories/jobApplicantsRepository";
import JobsRepository from "../infrastructure/repositories/jobsRepository";
import userRepository from "../infrastructure/repositories/userRepository";
import IAdminUseCase from "../interfaces/iUseCases/iAdminUseCase";
import { AdminOutput } from "../interfaces/models/adminOutput";
import Jwt from "../providers/jwt";

class AdminUseCase implements IAdminUseCase {

    constructor(
        private readonly _adminRepo:adminRepository,
        private readonly _userRepo:userRepository,
        private readonly _employerRepo:employerRepository,
        private readonly _jobsRepo:JobsRepository,
        private readonly _appliedJobsRepo:AppliedJobsRepository,
        private readonly _jobApplications:JobApplicantsRepository,
        private readonly _jwt:Jwt
        ) {}

    async login(email:string, password:string) {
        const admin = await this._adminRepo.findByEmail(email)
        if (admin) {
            if (password !== admin.password) {
                return {
                    status: 400,
                    message: 'Invalid credentials'
                }
            }
            const accessToken = this._jwt.createAccessToken(admin.id, 'admin')
            const refreshToken = this._jwt.createRefreshToken(admin.id, 'admin')
            return {
                status: 200,
                accessToken: accessToken,
                refreshToken: refreshToken,
                message: 'Login successfully'
            }
        } else {
            return {
                status: 400,
                message: 'Data not found'
            }
        }
    }

    async refreshToken(refreshToken: string): Promise<AdminOutput> {
        const decodedToken = await this._jwt.verifyRefreshToken(refreshToken)
        if (decodedToken?.id && decodedToken?.role) {
            const newAccessToken = await this._jwt.createAccessToken(decodedToken?.id,decodedToken?.role)
            const newRefreshToken = await this._jwt.createRefreshToken(decodedToken?.id, decodedToken?.role)
            return {
                status:200,
                message:'Token updated successfully',
                accessToken:newAccessToken,
                refreshToken:newRefreshToken,
            }
        } else {
            return {
                status:401,
                message:'Refresh token expired',
                refreshTokenExpired: true,
            }
        }
    }

    async getDashboardStatistics(startDate: string, endDate: string): Promise<AdminOutput> {
        const userStats = await this._userRepo.getUsersStatistics(startDate ,endDate)
        const employerStats = await this._employerRepo.getEmployersStatistics(startDate, endDate)
        const jobStats = await this._jobsRepo.getJobsStatistics(startDate, endDate)
        const jobApplicationStats = await this._appliedJobsRepo.getAppliedJobsStatistics(startDate, endDate)
        const hiringStats = await this._jobApplications.getHiringStatistics(startDate, endDate)

        const totalNoOfUsers = await this._userRepo.fetchUsersCount()
        const totalNoOfEmployers = await this._employerRepo.FetchEmployersCount()
        const totalNoOfJobs = await this._jobsRepo.FetchJobsCount({ isActive:true, isClosed:false })
        const totalNoOfAppliedJobs = await this._appliedJobsRepo.getTotalAppliedJobsCount()

        return {
            status:200,
            message:'Dashboard statistics found successful',
            userStats:userStats,
            employerStats:employerStats,
            jobsStats:jobStats,
            appliedJobsStats:jobApplicationStats,
            hiringStats:hiringStats,
            totalNoOfUsers:totalNoOfUsers,
            totalNoOfEmployers:totalNoOfEmployers,
            totalNoOfJobs:totalNoOfJobs,
            totalNoOfAppliedJobs:totalNoOfAppliedJobs
        }
    }

    async fetchAllUsers(pageNo:number, sort:string, search:string, filter:any) {
        const limit = 10
        const skip = (pageNo - 1) * limit;
        const users = await this._userRepo.fetchAllUsers(skip, limit, '' ,sort, filter, search)
        const totalUsersCount = await this._userRepo.fetchUsersCount('',filter)
        
        return {
            status:200,
            message:'Users found successfully',
            users:users,
            totalUsersCount:totalUsersCount
        }
    }

    async userAction(user_id:string) {
        const updatedUser = await this._userRepo.changeStatusById(user_id)
        if (!updatedUser) {
            return {
                status:400,
                message:'User not found'
            }
        }
        return {
            status:200,
            message:'User action successful',
            updatedUser:updatedUser
        }
    }

    async fetchUserByUserId(user_id:string) {
        const userData = await this._userRepo.findById(user_id)
        if (userData) {
            return {
                status:200,
                message:'User found successfully',
                userData:userData
            }
        } else {
            return {
                status:400,
                message:'User not found'
            }
        }
    }  

    async fetchAllEmployers(pageNo:number, sort:string, search:string, filter?:any) {
        const limit = 10
        const skip = (pageNo - 1) * limit;
        const employers = await this._employerRepo.fetchAllEmployers(skip, limit, '',sort, search,filter)
        const totalEmployersCount = await this._employerRepo.FetchEmployersCount(filter)
        return {
            status:200,
            message:'Employers found successfully',
            employers:employers,
            totalEmployersCount:totalEmployersCount
        }
    }

    async fetchEmployerById(employer_id:string) {
        const employerData = await this._employerRepo.findById(employer_id)
        if (employerData) {
            return {
                status:200,
                message:'Employer found successfully',
                employerData:employerData
            }
        } else {
            return {
                status:400,
                message:'Employer not found'
            }
        }
    }

    async employerAction(employer_id:string) {
        const updatedEmployer = await this._employerRepo.changeStatusById(employer_id)
        if (!updatedEmployer) {
            return {
                status:400,
                message:'Employer not found'
            }
        }
        return {
            status:200,
            message:'Employer action successful',
            updatedEmployer:updatedEmployer
        }
    }

    async verifyEmployer(employer_id: string): Promise<AdminOutput> {
        const verifiedEmployer = await this._employerRepo.verifyAccountById(employer_id)
        if (!verifiedEmployer) {
            return {
                status:400,
                message:'Employer not found'
            }
        }
        return {
            status:200,
            message:'Employer action successful',
            employer:verifiedEmployer
        }
    }

    async fetchAllJobs(pageNo:number, sort:string, search:string, filter?:any) {
        const limit = 10
        const skip = (pageNo - 1) * limit;
        const jobs = await this._jobsRepo.fetch8Jobs(skip, limit,sort, search,filter)
        const totalJobsCount = await this._jobsRepo.FetchJobsCount(filter)
        return {
            status:200,
            message:'Employers found successfully',
            jobs:jobs,
            totalJobsCount:totalJobsCount
        }
    }

    async jobAction(job_id: string): Promise<AdminOutput> {
        const updatedJob = await this._jobsRepo.changeStatusById(job_id)
        if (!updatedJob) {
            return {
                status:400,
                message:'Job not found'
            }
        }
        return {
            status:200,
            message:'Job action successful',
            updatedJob:updatedJob
        }
    }

}

export default AdminUseCase