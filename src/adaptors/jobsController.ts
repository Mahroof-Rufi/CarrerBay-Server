import JobsUseCase from "../use-case/jobsUseCase";
import { Request, Response } from "express";

class JobsController {

    constructor(
        private readonly _jobsUseCase: JobsUseCase
    ) { }

    async fetchJobsByUSer(req: Request, res: Response) {
        try {
            const searchQuery = req.query.search
            const pageNo = req.query.page || '1'

            if (searchQuery && searchQuery != ' ' && typeof searchQuery == 'string') {
                const searchedJobs = await this._jobsUseCase.searchJobs(searchQuery)
                res.status(searchedJobs.status).json({ data: searchedJobs.jobs })
            } else {
                const data = await this._jobsUseCase.fetchJobs(pageNo as string)
                res.status(data.status).json({ data: data.jobs, totalNoOfJob: data.totalNoOfJobs })
            }
        } catch (error) {
            console.error(error);
        }
    }

    async fetchJobsByEmployer(req: Request, res: Response) {
        try {
            const token = req.header('Employer-Token');

            const searchQuery = req.query.search;
            const pageNo = req.query.page || '1';
            const sort = req.query.sort;            

            const query: { [key: string]: any } = req.query;
            const filter: any = {};

            for (const key in query) {
                
                if (query.hasOwnProperty(key) && key !== 'page' && key !== 'sort' && key !== 'search') {
                    const value = query[key];

                    if (value.includes(',')) {
                        const valuesArray = value.split(',');

                        if (valuesArray.every((v: any) => v === 'true' || v === 'false')) {
                            filter[key] = { $in: valuesArray.map((v: any) => v === 'true') };
                        } else {
                            filter[key] = { $in: valuesArray };
                        }

                    } else if (value === 'true' || value === 'false') {
                        filter[key] = value === 'true';
                    } else {
                        filter[key] = value;
                    }
                }
            }

            if (filter.active === undefined) {
                filter.active = true;
            }

            if (token) {
                if (searchQuery && searchQuery != '' && typeof searchQuery == "string") {                    
                    const searchedJobs = await this._jobsUseCase.fetchSearchedJobs(token, pageNo as string, searchQuery, sort as string, filter)
                    res.status(searchedJobs.status).json({ jobs: searchedJobs.jobs, noOfJobs: searchedJobs.noOfJobs })
                } else {
                    const result = await this._jobsUseCase.fetchJobsByEmployerId(token, pageNo as string, sort as string, filter)
                    res.status(result.status).json({ jobs: result.jobs, noOfJobs: result.noOfJobs })
                }
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    async postNewJob(req: Request, res: Response) {
        try {
            const jobData = { ...req.body }
            const token = req.header('Employer-Token');
            if (token) {
                const response = await this._jobsUseCase.addNewJobPost(jobData, token)
                res.status(response.status).json({ message: response.message, job: response.job })
            }
        } catch (error) {
            console.error(error);
        }
    }

    async editJob(req: Request, res: Response) {
        try {
            const jobData = req.body.newJobData
            const jobId = req.body.jobId
            const response = await this._jobsUseCase.editJobPost(jobId, jobData);
            res.status(response.status).json({ message: response.message, updatedJob: response.job })
        } catch (error) {
            console.error(error);
        }
    }

    async deleteJob(req: Request, res: Response) {
        try {
            const jobId: string = req.params.id
            const response = await this._jobsUseCase.deleteJob(jobId)
            res.status(response.status).json({ message: response.message })
        } catch (error) {
            console.error(error);
        }
    }

    async saveJob(req: Request, res: Response) {
        try {
            const token = req.header('User-Token');
            const jobId = req.body.job_id

            if (token) {
                const result = await this._jobsUseCase.saveJobPost(token, jobId);
                res.status(result.status).json({ message: result.message, saved: result.savedJobsAndPosts })
            }
        } catch (error) {
            console.error(error);
        }
    }

    async isJobSaved(req: Request, res: Response) {
        try {
            const token = req.header('User-Token');
            const jobId = req.body.job_id

            if (token) {
                const result = await this._jobsUseCase.isJobSaved(token, jobId);
                res.status(result.status).json({ message: result.message, isSaved: result.isSaved })
            }
        } catch (error) {
            console.error(error);
        }
    }

    async unSaveJob(req: Request, res: Response) {
        try {
            const token = req.header('User-Token');
            const jobId = req.body.job_id

            if (token) {
                const result = await this._jobsUseCase.unSaveJobPost(token, jobId);
                res.status(result.status).json({ message: result.message, updatedSavedJobAndPosts: result.updatedSavedJobsAndPosts })
            }
        } catch (error) {
            console.error(error);
        }
    }

    async loadSavedJobs(req: Request, res: Response) {
        const token = req.header('User-Token');
        if (token) {
            const result = await this._jobsUseCase.loadUserSavedJobs(token);
            res.status(result.status).json({ message: result.message, jobs: result.savedJobsAndPosts?.savedJobs })
        }
    }

    async closeHiring(req: Request, res: Response) {
        const token = req.header('Employer-Token');
        const jobId = req.body.job_id
        if (token) {
            const result = await this._jobsUseCase.closeHiring(token, jobId)
            res.status(result.status).json({ message: result.message })
        }
    }
}

export default JobsController