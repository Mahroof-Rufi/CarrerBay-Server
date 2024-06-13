import cloudinary from "../providers/cloudinary";
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
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async applyJob(req:Request, res:Response) {
        try {
            const job_id = req.body.job_id;
            let resume_url;
            const resume = (req.files as { [fieldname: string]: Express.Multer.File[] })["resume"]?.[0];

            if (resume) {
                console.log('before resume upload')
                const resumeUpload = await cloudinary.uploader.upload(resume.path, { resource_type:'raw' });
                resume_url = resumeUpload.url;
                console.log('after resume upload')
            }
            
            const token = req.header('User-Token');
            if (token) {
                const result = await this._jobApplicantsUseCase.applyJobs(token, job_id, resume_url as string)
                res.status(result.status).json({ message:result.message, updatedAppliedJobs:result.updatedAppliedJobs })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
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
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async rejectCandidate(req:Request, res:Response) {
        try {
            const job_id = req.body.job_id;
            const user_id = req.body.user_id;
            const result = await this._jobApplicantsUseCase.rejectCandidate(job_id,user_id)
            res.status(result.status).json({ message:result.message, updatedData:result.appliedUsers })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
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
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
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
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }
}

export default JobApplicantsController