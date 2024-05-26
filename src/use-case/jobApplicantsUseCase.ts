import AppliedJobsRepository from "../infrastructure/repositories/appliedJobsRepository"
import JobApplicantsRepository from "../infrastructure/repositories/jobApplicantsRepository"
import Jwt from "../providers/jwt"

class JobApplicantsUseCase {

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

    async applyJobs(token:string, jobId:string) {
        const decodedToken = this._jwt.verifyToken(token)
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
        const decodedToken = this._jwt.verifyToken(token)
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
        const decodedToken = this._jwt.verifyToken(token)
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