import JobsUseCase from "../use-case/jobsUseCase";
import { Request,Response } from "express";

class JobsController {

    constructor(
        private readonly _jobsUseCase:JobsUseCase
    ) {}

    async fetchJobsByUSer(req:Request, res:Response) {
        try {
            const searchQuery = req.query.search
            if (searchQuery && searchQuery != ' ' && typeof searchQuery == 'string') {                
                const searchedJobs = await this._jobsUseCase.searchJobs(searchQuery)
                res.status(searchedJobs.status).json({ data:searchedJobs.jobs })
            } else {
                const data = await this._jobsUseCase.fetchJobs()
                res.status(data.status).json({data:data.jobs})
            }
        } catch (error) {
            console.error(error);            
        }
    }

    async fetchJobsByEmployer(req:Request, res:Response) {
        try {            
            const token = req.header('Employer-Token');
            const searchQuery = req.query.search
            if (searchQuery && token && searchQuery != ' ' && typeof searchQuery == 'string') {
                const searchedJobs = await this._jobsUseCase.fetchSearchedJobs(token, searchQuery)
                res.status(searchedJobs.status).json({ jobs:searchedJobs.jobs })
            } else {
                if(token) {
                    const query = req.query.title
                    const result = await this._jobsUseCase.fetchJobsByEmployerId(token, query as string)
                    res.status(result.status).json({jobs:result.jobs})
                }
            }            
        } catch (error) {
            console.error(error);            
        }
    }

    async postNewJob(req:Request, res:Response) {
        try {
            const jobData = {...req.body}
            const token = req.header('Employer-Token');
            if (token) {
                const response = await this._jobsUseCase.addNewJobPost(jobData, token)
                res.status(response.status).json({ message:response.message, job:response.job })
            }
        } catch (error) {
            console.error(error);            
        }
    }

    async editJob(req:Request, res:Response) {
        try {
            const jobData = req.body.newJobData
            const jobId = req.body.jobId
            const response = await this._jobsUseCase.editJobPost(jobId,jobData);
            res.status(response.status).json({ message:response.message, updatedJob:response.updatedJob })                  
        } catch (error) {
            console.error(error);            
        }
    }

    async deleteJob(req:Request, res:Response) {
        try {
            const jobId:string = req.params.id
            const response = await this._jobsUseCase.deleteJob(jobId)
            res.status(response.status).json({message:response.message})
        } catch (error) {
            console.error(error);            
        }
    }
}

export default JobsController