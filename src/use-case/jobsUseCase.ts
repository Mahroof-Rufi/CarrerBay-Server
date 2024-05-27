import JobsRepository from "../infrastructure/repositories/jobsRepository"
import Jwt from "../providers/jwt"
import Job from "../interfaces/models/job"
import SavedJobsAndPostsRepository from "../infrastructure/repositories/savedJobsAndPostsRepository"

class JobsUseCase {

    constructor(
        private readonly _jwt:Jwt,
        private readonly _jobRepository:JobsRepository,
        private readonly _savedJobsAndPostsRepository:SavedJobsAndPostsRepository
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
                message: 'Job Post added successful',
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
                message: 'Job Post updated successfully',
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

    async saveJobPost(token:string, jobId:string) {
        const decodedToken = this._jwt.verifyToken(token)
        const res = await this._savedJobsAndPostsRepository.insertJob(decodedToken?.id, jobId)
        console.log('res',res);
        
        if (res) {
            return {
                status:200,
                message:'Job saved successfully',
                savedJobsAndPosts: res
            }
        } else {
            return {
                status:400,
                message:'save job failed, try again'
            }
        }
    }

    async isJobSaved(token:string, jobId:string) {
        const decodedToken = this._jwt.verifyToken(token)
        const res = await this._savedJobsAndPostsRepository.isJobSaved(decodedToken?.id, jobId)
        if (res) {
            return {
                status:200,
                message:'Job is saved',
                isSaved: true
            }
        } else {            
            return {
                status:200,
                message:'Job is not saved yet',
                isSaved: false
            }
        }
    }

    async unSaveJobPost(token:string, jobId:string) {
        const decodedToken = this._jwt.verifyToken(token)
        const res = await this._savedJobsAndPostsRepository.removeJob(decodedToken?.id, jobId)
        if (res) {
            return {
                status:200,
                message:'Job unsaved successfully',
                updatedSavedJobsAndPosts: res
            }
        } else {
            return {
                status:400,
                message:'unsave job failed, try again'
            }
        }
    }
}

export default JobsUseCase