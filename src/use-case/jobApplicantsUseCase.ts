import AppliedJobsRepository from "../infrastructure/repositories/appliedJobsRepository"
import JobApplicantsRepository from "../infrastructure/repositories/jobApplicantsRepository"
import IJobApplicantsUseCase from "../interfaces/iUseCases/iJobApplicantsUseCase"
import { JobApplicantsOutput } from "../interfaces/models/jobApplicantsOutput"
import Jwt from "../providers/jwt"

class JobApplicantsUseCase implements IJobApplicantsUseCase{

    constructor(
        private readonly _jobApplicantsRepository:JobApplicantsRepository,
        private readonly _userAppliedJobs:AppliedJobsRepository,
        private readonly _jwt:Jwt
    ) {}

    async fetchJobApplicants(jobId:string) {
        const res = await this._jobApplicantsRepository.findOne(jobId)
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
        const res = await this._jobApplicantsRepository.updateCandidateStatus(jobId,user_id,newStatus)
        const updateUserSide = await this._userAppliedJobs.updateJobStatusById(user_id, jobId, newStatus)
        if (res && updateUserSide) {
            return {
                status:200,
                message:'Candidate status update successful',
                appliedUsers:res
            }
        } else {
            return {
                status:404,
                message:'Candidate not found'
            }
        } 
    }

    async rejectCandidate(job_id: string, user_id: string): Promise<JobApplicantsOutput> {
        const res = await this._jobApplicantsRepository.rejectCandidateStatus(job_id,user_id)
        const updateUserSide = await this._userAppliedJobs.rejectApplication(user_id,job_id)
        if (res && updateUserSide) {
            return {
                status:200,
                message:'Candidate application rejected successful',
                appliedUsers:res
            }
        } else {
            return {
                status:404,
                message:'Candidate not found'
            }
        } 
    }

    async applyJobs(token:string, jobId:string) {
        
        const decodedToken = this._jwt.verifyToken(token,"User")
        const res = await this._userAppliedJobs.addAppliedJob(decodedToken?.id, jobId)
        if (!res) {
            return {
                status:404,
                message:'User not found'
            }
        } else {
            const job = await this._jobApplicantsRepository.addAppliedUser(jobId, decodedToken?.id)
            
            if (!job) {
                return {
                    status:404,
                    message:'Job not found'
                }
            }
            return {
                status:201,
                message:'Job application send successful',
                updatedAppliedJobs:res
            }
        }
    }

    async verifyUserApplication(token:string, jobId:string) {
        const decodedToken = this._jwt.verifyToken(token,"Employer")
        const jobApplicants = await this._jobApplicantsRepository.findOneCandidate(jobId,decodedToken?.id)
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

    async fetchAppliedJobs(token:string) {
        const decodedToken = this._jwt.verifyToken(token,"User")
        const appliedJobs = await this._userAppliedJobs.findOneById(decodedToken?.id)
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

}

export default JobApplicantsUseCase