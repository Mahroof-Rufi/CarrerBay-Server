import Job from "../../interfaces/models/job";
import IJobsRepository from "../../interfaces/iRepositories/iJobRepository";
import jobModel from "../../entities_models/jobModel";

class JobsRepository implements IJobsRepository {

    async insertOneJob(jobData: Job): Promise<Job> {
        const job = new jobModel(jobData)
        await job.save()
        return job
    }

    async fetch8Jobs(company_id: string, skip:number, limit:number, title:string | undefined): Promise<Job[]> {
        const jobs = title ? await jobModel.find({company_id:company_id, title:title}).skip(skip).limit(limit) : await jobModel.find({company_id:company_id}).skip(skip).limit(limit)
        if (jobs) {
            return jobs
        } else {
            return []
        }
    }

    async fetchEmployerJobsCount(employer_id: string): Promise<number> {
        const noOfDoc = await jobModel.find({ company_id:employer_id }).countDocuments()
        return noOfDoc
    }

    async fetchJobsByUser(): Promise<Job[] | null> {
        const jobs = await jobModel.find(
            { active:true }
        ).populate('company_id')        
        
        if (jobs) {
            return jobs
        } else {
            return null
        }
    }

    async fetchSearchedJobs(query: string): Promise<Job[] | null> {
        const searchedJobs = jobModel.find(
            { jobTitle: { $regex: query, $options: 'i' } }
        ).populate('company_id');
        if (searchedJobs) {
            return searchedJobs
        } else {
            return null
        }
    }

    async fetchSearchedJobsByCompanyId(company_id: string, query: string): Promise<Job[] | null> {
        const searchedJobs = jobModel.find(
            { company_id:company_id, jobTitle: { $regex: query, $options: 'i' } }
        )
        if (searchedJobs) {
            return searchedJobs
        } else {
            return null
        }
    }

    async updateJobByID(job_id: string, jobData:Job): Promise<Job | null> {
        const updatedJob = await jobModel.findByIdAndUpdate(
            { _id:job_id },
            { $set:jobData },
            { new:true }
        )
        return updatedJob ? updatedJob : null 
    }

    async deleteJobById(jobId: string): Promise<Job | null> {
        const deletedJob = await jobModel.findByIdAndDelete(jobId)
        if (deletedJob) {
            return deletedJob
        } else {
            return null
        }
    }

    async addApplicantId(job_id: string, user_id: string): Promise<Job | null> {
        const updatedJob = await jobModel.findByIdAndUpdate(
            job_id,
            { $addToSet: { applicants:user_id } }
        )
        return updatedJob ? updatedJob : null
    }

    async closeHiring(job_id: string): Promise<Job | null> {
        const updatedJob = await jobModel.findOneAndUpdate(
            { _id:job_id },
            {  active: false },
            { new:true }
        )

        if (updatedJob) {
            return updatedJob
        } else {
            return updatedJob
        }
    }

}

export default JobsRepository