import Job from "../../interfaces/models/job";
import IJobsRepository from "../../interfaces/iRepositories/iJobRepository";
import jobModel from "../../entities_models/jobModel";

class JobsRepository implements IJobsRepository {

    async insertOneJob(jobData: Job): Promise<Job> {
        try {
            const job = new jobModel(jobData)
            await job.save()
            return job
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async fetch8Jobs(company_id: string, skip: number, limit: number, sort?: string, filterQuery?: any): Promise<Job[]> {
        try {
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
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    

    async fetchEmployerJobsCount(employer_id: string, filterQuery?:any, searchQuery?:string): Promise<number> {
        try {
            if (filterQuery) {
                filterQuery.company_id = employer_id;
                if (searchQuery) {
                    filterQuery.jobTitle =  new RegExp(searchQuery, 'i');
                }
                console.log('filterereeee',filterQuery);
                
                const noOfDoc = await jobModel.find(filterQuery).countDocuments()
                return noOfDoc
            } else {
                const noOfDoc = await jobModel.find({ company_id:employer_id }).countDocuments()
                return noOfDoc
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async fetchEmployerJobsById(employer_id: string, skip:number, limit:number): Promise<Job | any> {
        try {
            const employerJobs = await jobModel.find({ company_id:employer_id, active:true }).populate('company_id').skip(skip).limit(limit)
            return employerJobs || null
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async fetchNoOfJobsByEmployerId(employer_id: string): Promise<number> {
        try {
            const noOfJobs = await jobModel.find({ company_id:employer_id }).countDocuments()
            return noOfJobs || 0
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async fetchJobsByUser(skip:number, limit:number, sort?:string, filterQuery?:any): Promise<Job[] | null> {     
        try {
            filterQuery.active = true
            let sortQuery: { [key: string]: any } | undefined;
        
            if (sort === 'newest') {
                sortQuery = { _id: -1 };
            } else if (sort === 'oldest') {
                sortQuery = { _id: 1 };
            } 
            
            const jobs = await jobModel.find(filterQuery).skip(skip).limit(limit).sort(sortQuery).populate('company_id') 
            
            if (jobs) {
                return jobs
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async fetchUserJobsCount(filterQuery:any): Promise<number> {        
        try {
            filterQuery.active = true
            const totalNoOfJobs = await jobModel.find(filterQuery).countDocuments()
            return totalNoOfJobs
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async fetchSearchedJobs(skip:number, limit:number, sort:string, filterQuery:any): Promise<Job[] | null> {
        try {
            filterQuery.active = true
            const searchedJobs = jobModel.find(filterQuery).skip(skip).limit(limit).populate('company_id');
            if (searchedJobs) {
                return searchedJobs
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async fetchSearchedJobsByCompanyId(company_id: string, skip: number, limit: number, searchQuery: string, sort?: string, filterQuery?: any): Promise<Job[] | null> {
        try {
            let sortQuery: { [key: string]: any } | undefined;
    
            if (sort === 'newest') {
                sortQuery = { _id: -1 };
            } else if (sort === 'oldest') {
                sortQuery = { _id: 1 };
            }
        
            const combinedQuery: any = { company_id: company_id };
        
            if (searchQuery) {
                combinedQuery.jobTitle = { $regex: searchQuery, $options: 'i' };
            }
        
            if (filterQuery) {
                delete filterQuery.search;
                Object.assign(combinedQuery, filterQuery);
            }
        
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
        } catch (error) {
            console.log(error);
            throw error
        }
    }
     
    

    async updateJobByID(job_id: string, jobData:Job): Promise<Job | null> {
        try {
            const updatedJob = await jobModel.findByIdAndUpdate(
                { _id:job_id },
                { $set:jobData },
                { new:true }
            )
            return updatedJob || null
        } catch (error) {
            console.log(error);
            throw error
        } 
    }

    async deleteJobById(jobId: string): Promise<Job | null> {
        try {
            const deletedJob = await jobModel.findByIdAndDelete(jobId)
            if (deletedJob) {
                return deletedJob
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async addApplicantId(job_id: string, user_id: string): Promise<Job | null> {
        try {
            const updatedJob = await jobModel.findByIdAndUpdate(
                job_id,
                { $addToSet: { applicants:user_id } }
            )
            return updatedJob || null
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async closeHiring(job_id: string): Promise<Job | null> {
        try {
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
        } catch (error) {
            console.log(error);
            throw error
        }
    }

}

export default JobsRepository