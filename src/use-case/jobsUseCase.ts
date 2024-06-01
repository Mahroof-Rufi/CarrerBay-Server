import JobsRepository from "../infrastructure/repositories/jobsRepository"
import Jwt from "../providers/jwt"
import Job from "../interfaces/models/job"
import SavedJobsAndPostsRepository from "../infrastructure/repositories/savedJobsAndPostsRepository"
import IJobsUseCase from "../interfaces/iUseCases/iJobsUseCase"
import { JobsOutput } from "../interfaces/models/jobsOutput"

class JobsUseCase implements IJobsUseCase {

    constructor(
        private readonly _jwt: Jwt,
        private readonly _jobRepository: JobsRepository,
        private readonly _savedJobsAndPostsRepository: SavedJobsAndPostsRepository
    ) { }

    async fetchJobs(page: string) {
        const limit = 12
        const skip = (parseInt(page) - 1) * limit

        const jobs = await this._jobRepository.fetchJobsByUser(skip, limit)
        const noOfJobs = await this._jobRepository.fetchUserJobsCount()
        return {
            status: 200,
            message: 'Jobs found successfully',
            jobs: jobs,
            totalNoOfJobs: noOfJobs
        }
    }

    async fetchJobsByEmployerId(token: string, pageNo: string, sort?: string, filterQuery?: any) {
        const decode = this._jwt.verifyToken(token, "Employer");
        const limit = 10;
        const skip = (parseInt(pageNo) - 1) * limit;
        const jobs = await this._jobRepository.fetch8Jobs(decode?.id, skip, limit, sort, filterQuery);
        const noOfJobs = await this._jobRepository.fetchEmployerJobsCount(decode?.id, filterQuery);
        return {
            status: 200,
            message: 'Jobs found successfully',
            jobs: jobs,
            noOfJobs: noOfJobs
        };
    }

    async fetchSearchedJobs(token: string, pageNo: string, searchQuery: string, sort?:string, filter?:any) {
        const decode = this._jwt.verifyToken(token, "Employer")
        const limit = 10;
        const skip = (parseInt(pageNo) - 1) * limit;
        const searchedJobs = await this._jobRepository.fetchSearchedJobsByCompanyId(decode?.id, skip, limit,searchQuery, sort, filter)
        const noOfJobs = await this._jobRepository.fetchEmployerJobsCount(decode?.id, filter, searchQuery);
        return {
            status: 200,
            message: 'Searched jobs found successfully',
            jobs: searchedJobs,
            noOfJobs: noOfJobs,
        }
    }

    async addNewJobPost(jobData: Job, token: string) {
        const decode = this._jwt.verifyToken(token, "Employer")
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

    async editJobPost(jobId: string, jobData: Job) {
        const updatedJob = await this._jobRepository.updateJobByID(jobId, jobData)
        if (updatedJob) {
            return {
                status: 200,
                message: 'Job Post updated successfully',
                job: updatedJob
            }
        } else {
            return {
                status: 400,
                message: 'Something went wrong update job'
            }
        }
    }

    async deleteJob(jobId: string) {
        const res = await this._jobRepository.deleteJobById(jobId)
        if (res) {
            return {
                status: 200,
                message: 'Job deleted successfully'
            }
        } else {
            return {
                status: 401,
                message: 'Something went wrong'
            }
        }
    }

    async searchJobs(query: string) {
        const searchedJobs = await this._jobRepository.fetchSearchedJobs(query)

        return {
            status: 200,
            message: 'Searched Jobs found successfully',
            jobs: searchedJobs
        }
    }

    async saveJobPost(token: string, jobId: string) {
        const decodedToken = this._jwt.verifyToken(token, "User")
        const res = await this._savedJobsAndPostsRepository.insertJob(decodedToken?.id, jobId)
        console.log('res', res);

        if (res) {
            return {
                status: 200,
                message: 'Job saved successfully',
                savedJobsAndPosts: res
            }
        } else {
            return {
                status: 400,
                message: 'save job failed, try again'
            }
        }
    }

    async isJobSaved(token: string, jobId: string) {
        const decodedToken = this._jwt.verifyToken(token, "User")
        const res = await this._savedJobsAndPostsRepository.isJobSaved(decodedToken?.id, jobId)
        if (res) {
            return {
                status: 200,
                message: 'Job is saved',
                isSaved: true
            }
        } else {
            return {
                status: 200,
                message: 'Job is not saved yet',
                isSaved: false
            }
        }
    }

    async unSaveJobPost(token: string, jobId: string) {
        const decodedToken = this._jwt.verifyToken(token, "User")
        const res = await this._savedJobsAndPostsRepository.removeJob(decodedToken?.id, jobId)
        if (res) {
            return {
                status: 200,
                message: 'Job unsaved successfully',
                updatedSavedJobsAndPosts: res
            }
        } else {
            return {
                status: 400,
                message: 'unsave job failed, try again'
            }
        }
    }

    async loadUserSavedJobs(token: string): Promise<JobsOutput> {
        const decodedToken = this._jwt.verifyToken(token, "User")
        const res = await this._savedJobsAndPostsRepository.findSavedJobs(decodedToken?.id);
        return {
            status: 200,
            message: 'Jobs found successfully',
            savedJobsAndPosts: res
        }
    }

    async closeHiring(token: string, job_id: string) {
        const decodedToken = this._jwt.verifyToken(token, "Employer")
        const res = await this._jobRepository.closeHiring(job_id)
        if (res) {
            return {
                status: 200,
                message: 'Hiring closed successfully'
            }
        } else {
            return {
                status: 400,
                message: 'Something went wrong on the close hiring'
            }
        }
    }
}

export default JobsUseCase