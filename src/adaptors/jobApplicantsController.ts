import JobApplicantsUseCase from "../use-case/jobApplicantsUseCase";
import { Request, Response } from "express";

class JobApplicantsController {

    constructor(
        private readonly _jobApplicantsUseCase:JobApplicantsUseCase
    ) {}

    async fetchJobApplicants(req:Request, res:Response) {
        try {
            const job_id:string = req.body.job_id
            const result = await this._jobApplicantsUseCase.fetchJobApplicants(job_id)
            res.status(result.status).json({ message:result.message,appliedUsers:result.appliedUsers })
        } catch (error) {
            console.error(error);            
        }
    }

    async applyJob(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const job_id:string = req.body.jobId
            if (token) {
                const result = await this._jobApplicantsUseCase.applyJobs(token,job_id)
                res.status(result.status).json({ message:result.message, updatedAppliedJobs:result.updatedAppliedJobs })
            }
        } catch (error) {
            console.error(error);            
        }
    }

    async updateCandidateStatus(req:Request, res:Response) {
        try {
            const job_id = req.body.job_id;
            const user_id = req.body.user_id;
            const newStatus = req.body.newStatus;
            const result = await this._jobApplicantsUseCase.updateCandidateStatus(job_id,user_id,newStatus)
            res.status(result.status).json({ message:result.message, updatedData:result.appliedUsers })
        } catch (error) {
            console.error(error);            
        }
    }

    async rejectCandidate(req:Request, res:Response) {
        try {
            const job_id = req.body.job_id;
            const user_id = req.body.user_id;
            const result = await this._jobApplicantsUseCase.rejectCandidate(job_id,user_id)
            res.status(result.status).json({ message:result.message, updatedData:result.appliedUsers })
        } catch (error) {
            console.error(error);            
        }
    }

    async verifyUserApplication(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const job_id:string = req.body.job_id
            
            if (token) {
                const result = await this._jobApplicantsUseCase.verifyUserApplication(token, job_id)
                res.status(result.status).json({ message:result.message,isApplied:result.isApplied })
            }
        } catch (error) {
            console.error(error);            
        }
    }

    async fetchAppliedJobs(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            
            if (token) {
                const result = await this._jobApplicantsUseCase.fetchAppliedJobs(token)
                res.status(result.status).json({ message:result.message,appliedJobs:result.appliedJobs })
            }
        } catch (error) {
            console.error(error);            
        }
    }
}

export default JobApplicantsController