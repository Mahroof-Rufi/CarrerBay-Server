import Job from "../../domain/job";

interface jobsInterface {

    insertOneJob(jobData:Job): Promise<Job>
    fetch8Jobs(company_id:string, title:string | undefined): Promise<Job[]>
    fetchAll6Jobs(): Promise<Job[] | null>
    updateJobByID(job_id:string, jobData:Job): Promise<Job | null>
    deleteJobById(jobId:string): Promise<Job | null>

}

export default jobsInterface