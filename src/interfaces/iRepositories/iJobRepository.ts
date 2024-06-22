import Job from "../models/job";

interface IJobsRepository {

    insertOneJob(jobData:Job): Promise<Job | null>
    fetchEmployerJobsById(employer_id:string, skip:number, limit:number): Promise<Job>
    fetchNoOfJobsByEmployerId(employer_id:string): Promise<number>
    fetch8Jobs(skip:number, limit:number, sort?:string, searchValue?:string, filterQuery?:any, company_id?:string): Promise<Job[]>
    fetchJobById(job_id:string): Promise<Job | null>
    FetchJobsCount(filter?:any): Promise<number>
    fetchEmployerJobsCount(employer_id:string, filter?:any): Promise<number>
    fetchJobsByUser(skip:number, limit:number): Promise<Job[] | null>
    fetchUserJobsCount(filterQuery:any): Promise<number>
    fetchSearchedJobs(skip:number, limit:number, sort:string, filterQuery:any): Promise<Job[] | null>
    fetchSearchedJobsByCompanyId(company_id:string, skip:number, limit:number, searchQuery:string, sort?:string, filterQuery?:any): Promise<Job[] | null>
    updateJobByID(job_id:string, jobData:Job): Promise<Job | null>
    deleteJobById(jobId:string): Promise<Job | null>
    addApplicantId(job_id:string, user_id:string): Promise<Job | null>
    closeHiring(job_id:string): Promise<Job | null>
    changeStatusById(job_id:string): Promise<Job | null>
    getJobsStatistics(startDate:string, endDate:string): Promise<number[]>

}

export default IJobsRepository