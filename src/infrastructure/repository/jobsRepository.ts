import Job from "../../domain/job";
import jobsInterface from "../../use-case/interface/jobsInterface";
import jobModel from "../data-base/jobModel";

class jobsRepository implements jobsInterface {

    async insertOneJob(jobData: Job): Promise<Job> {
        const job = new jobModel(jobData)
        await job.save()
        return job
    }

    async fetch8Jobs(company_id: string, title:string | undefined): Promise<Job[]> {
        const jobs = title ? await jobModel.find({company_id:company_id, title:title}) : await jobModel.find({company_id:company_id})
        if (jobs) {
            return jobs
        } else {
            return []
        }
    }

    async fetchAll6Jobs(): Promise<Job[] | null> {
        const jobs = await jobModel.find().populate('company_id')
        console.log('here the hot data');
        console.log(jobs);
        
        
        if (jobs) {
            return jobs
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

    async addApplicantid(job_id: string, user_id: string): Promise<Job | null> {
        const updatdJob = await jobModel.findByIdAndUpdate(
            job_id,
            { $addToSet: { applicants:user_id } }
        )
        return updatdJob ? updatdJob : null
    }

}

export default jobsRepository