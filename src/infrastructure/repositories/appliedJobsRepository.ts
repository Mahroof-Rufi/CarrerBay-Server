import IAppliedJobsRepository from "../../interfaces/iRepositories/iAppliedJobsRepository";
import appliedJobsModel from "../../entities_models/appliedJobsModel";
import mongoose from "mongoose";

class AppliedJobsRepository implements IAppliedJobsRepository {
    
    async addAppliedJob(user_id: string, job_id: string): Promise<any> {            
        try {
            const appliedJob = await appliedJobsModel.findOneAndUpdate(
                { user_id: new mongoose.Types.ObjectId(user_id) },
                { $addToSet: { appliedJobs: { job_id: job_id, status: "under-review", } } },
                { upsert: true, new: true }
            );
            return appliedJob ? appliedJob : null
        } catch (error) {
            console.log(error);
            throw error            
        }
    }

    async findOneById(user_id: string): Promise<any> {
        try {
            const appliedJobs = await appliedJobsModel.findOne(
                { user_id:user_id }
            ).populate({
                path: 'appliedJobs.job_id',
                populate: {
                    path: 'company_id',
                    model: 'employer'
                }
            });
            if (appliedJobs) {
                return appliedJobs
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async updateJobStatusById(user_id: string, job_id: string, newStatus: string): Promise<any> {
        try {
            const updatedUserAppliedJob = await appliedJobsModel.findOneAndUpdate(
                {   user_id: user_id, 'appliedJobs.job_id': job_id  },
                {   $set: { 'appliedJobs.$.status': newStatus } },
                {   new: true }
            )
    
            if (updatedUserAppliedJob) {
                return updatedUserAppliedJob
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async rejectApplication(user_id: string, job_id: string): Promise<any> {
        try {
            const updatedUserAppliedJob = await appliedJobsModel.findOneAndUpdate(
                { user_id: user_id, 'appliedJobs.job_id': job_id },
                { $set: { 'appliedJobs.$.rejected': true } },
                { new: true }
            )
    
            if (updatedUserAppliedJob) {
                return updatedUserAppliedJob
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

}

export default AppliedJobsRepository