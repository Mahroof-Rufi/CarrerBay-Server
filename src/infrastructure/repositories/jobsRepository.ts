import Job from "../../interfaces/models/job";
import IJobsRepository from "../../interfaces/iRepositories/iJobRepository";
import jobModel from "../../entities_models/jobModel";

class JobsRepository implements IJobsRepository {

    async insertOneJob(jobData: Job): Promise<Job> {
        const job = new jobModel(jobData)
        await job.save()
        return job
    }

    async fetch8Jobs(company_id: string, skip: number, limit: number, sort?: string, filterQuery?: any): Promise<Job[]> {

        let sortQuery: { [key: string]: any } | undefined;

        if (sort === 'newest') {
            sortQuery = { _id: -1 };
        } else if (sort === 'oldest') {
            sortQuery = { _id: 1 };
        }

        filterQuery.company_id = company_id;
        
    
        let jobs;
        if (sortQuery) {
            jobs = await jobModel.find(filterQuery).skip(skip).limit(limit).sort(sortQuery);
        } else {
            jobs = await jobModel.find(filterQuery).skip(skip).limit(limit);
        }
    
        if (jobs) {
            return jobs;
        } else {
            return [];
        }
    }
    

    async fetchEmployerJobsCount(employer_id: string, filterQuery?:any): Promise<number> {
        console.log('filtere', filterQuery);
        
        if (filterQuery) {
            filterQuery.company_id = employer_id;
            const noOfDoc = await jobModel.find(filterQuery).countDocuments()
            return noOfDoc
        } else {
            const noOfDoc = await jobModel.find({ company_id:employer_id }).countDocuments()
            return noOfDoc
        }
    }

    async fetchJobsByUser(skip:number, limit:number): Promise<Job[] | null> {      
        
        const jobs = await jobModel.find(
            { active:true }
        ).skip(skip).limit(limit).populate('company_id') 
        
        if (jobs) {
            return jobs
        } else {
            return null
        }
    }

    async fetchUserJobsCount(): Promise<number> {
        const totalNoOfJobs = await jobModel.find(
            { active:true }
        ).countDocuments()

        return totalNoOfJobs
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

    async fetchSearchedJobsByCompanyId(company_id: string, skip: number, limit: number, searchQuery: string, sort?: string, filterQuery?: any): Promise<Job[] | null> {
        let sortQuery: { [key: string]: any } | undefined;
    
        if (sort === 'newest') {
            sortQuery = { _id: -1 };
        } else if (sort === 'oldest') {
            sortQuery = { _id: 1 };
        }
    
        const combinedQuery: any = { company_id: company_id };
    
        // Add the search query if provided
        if (searchQuery) {
            combinedQuery.jobTitle = { $regex: searchQuery, $options: 'i' };
        }
    
        // Add other filter queries if provided
        if (filterQuery) {
            // Remove 'search' field from the filterQuery
            delete filterQuery.search;
            Object.assign(combinedQuery, filterQuery);
        }
    
        console.log('Combined Query:', combinedQuery);
    
        let searchedJobs;
        if (sortQuery) {
            searchedJobs = jobModel.find(combinedQuery).skip(skip).limit(limit).sort(sortQuery);
        } else {
            searchedJobs = jobModel.find(combinedQuery).skip(skip).limit(limit);
        }
    
        if (searchedJobs) {
            return searchedJobs;
        } else {
            return null;
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