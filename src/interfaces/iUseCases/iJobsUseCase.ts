import Job from "../models/job"
import { JobsOutput } from "../models/jobsOutput"

interface IJobsUseCase {

    fetchJobs(): Promise<JobsOutput>
    fetchJobsByEmployerId(token:string, title?:string | undefined): Promise<JobsOutput>
    fetchSearchedJobs(token:string, searchQuery:string): Promise<JobsOutput>
    addNewJobPost(jobData:Job, token:string): Promise<JobsOutput>
    editJobPost(job_id:string, jobData:Job): Promise<JobsOutput>
    deleteJob(job_id:string): Promise<JobsOutput>
    searchJobs(query:string): Promise<JobsOutput>
    saveJobPost(token:string, job_id:string): Promise<JobsOutput>
    isJobSaved(token:string, job_id:string): Promise<JobsOutput>
    unSaveJobPost(token:string, job_id:string): Promise<JobsOutput>
    loadUserSavedJobs(token:string): Promise<JobsOutput>

}

export default IJobsUseCase