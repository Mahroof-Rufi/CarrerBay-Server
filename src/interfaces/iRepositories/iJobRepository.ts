import Job from "../models/job";

interface IJobsRepository {

    insertOneJob(jobData:Job): Promise<Job>
    fetch8Jobs(company_id:string, skip:number, limit:number, sort?:string, filterQuery?:any,title?:string | undefined): Promise<Job[]>
    fetchEmployerJobsCount(employer_id:string, filter?:any): Promise<number>
    fetchJobsByUser(skip:number, limit:number): Promise<Job[] | null>
    fetchUserJobsCount(): Promise<number>
    fetchSearchedJobs(query:string): Promise<Job[] | null>
    fetchSearchedJobsByCompanyId(company_id:string, skip:number, limit:number, searchQuery:string, sort?:string, filterQuery?:any): Promise<Job[] | null>
    updateJobByID(job_id:string, jobData:Job): Promise<Job | null>
    deleteJobById(jobId:string): Promise<Job | null>
    addApplicantId(job_id:string, user_id:string): Promise<Job | null>
    closeHiring(job_id:string): Promise<Job | null>

}

export default IJobsRepository