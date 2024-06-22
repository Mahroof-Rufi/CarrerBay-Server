import Job from "../models/job"
import { JobsOutput } from "../models/jobsOutput"

interface IJobsUseCase {

    fetchJobs(pageNo:string): Promise<JobsOutput>
    fetchJobById(job_id:string): Promise<JobsOutput>
    fetchJobsByEmployerID(employer_id:string, pageNo:string): Promise<JobsOutput>
    fetchJobsByEmployerId(token:string, pageNo:string, sort?:string, filterQuery?:any ,title?:string | undefined): Promise<JobsOutput>
    fetchSearchedJobs(token:string, pageNo:string,searchQuery:string, sort?:string, filter?:any): Promise<JobsOutput>
    addNewJobPost(jobData:Job, token:string): Promise<JobsOutput>
    editJobPost(job_id:string, jobData:Job): Promise<JobsOutput>
    deleteJob(job_id:string): Promise<JobsOutput>
    searchJobs(query:string, page:string, sort:string, filterQuery:any): Promise<JobsOutput>
    saveJobPost(token:string, job_id:string): Promise<JobsOutput>
    isJobSaved(token:string, job_id:string): Promise<JobsOutput>
    unSaveJobPost(token:string, job_id:string): Promise<JobsOutput>
    loadUserSavedJobs(token:string): Promise<JobsOutput>
    closeHiring(token:string, job_id:string): Promise<JobsOutput>

}

export default IJobsUseCase