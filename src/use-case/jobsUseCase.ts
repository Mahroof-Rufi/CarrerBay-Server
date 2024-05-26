import JobsRepository from "../infrastructure/repositories/jobsRepository"
import Jwt from "../providers/jwt"
import Job from "../interfaces/models/job"

class JobsUseCase {

    constructor(
        private readonly _jwt:Jwt,
        private readonly _jobRepository:JobsRepository
    ) {}

    async fetchJobs() {
        const jobs = await this._jobRepository.fetchAll6Jobs()
        return {
            status: 200,
            jobs: jobs
        }
    }

    async fetchJobsByEmployerId(token:string, title?:string | undefined) {
        const decode = this._jwt.verifyToken(token)
        const jobs = await this._jobRepository.fetch8Jobs(decode?.id, title)
        return {
            status: 200,
            jobs: jobs
        }        
    }

    async fetchSearchedJobs(token:string, searchQuery:string) {
        const decode = this._jwt.verifyToken(token)
        const searchedJobs = await this._jobRepository.fetchSearchedJobsByCompanyId(decode?.id, searchQuery)
        return {
            status: 200,
            jobs: searchedJobs
        }
    }

    async addNewJobPost(jobData:Job, token:string) {
        const decode = this._jwt.verifyToken(token)
        jobData.company_id = decode?.id
        const currentDate = new Date()
        jobData.postedAt = currentDate
        jobData.active = true
        const job = await this._jobRepository.insertOneJob(jobData)
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
        const updatedJob = await this._jobRepository.updateJobByID(jobId, jobData)
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
        const res = await this._jobRepository.deleteJobById(jobId)
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

    async searchJobs(query:string) {
        const searchedJobs = await this._jobRepository.fetchSearchedJobs(query)
        
        return {
            status:200,
            jobs:searchedJobs
        }
    }
}

export default JobsUseCase