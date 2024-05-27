import mongoose from "mongoose";
import savedJobsAndPostsModel from "../../entities_models/savedJobsAndPostsModel";
import ISavedJobsAndPostsRepository from "../../interfaces/iRepositories/iSavedJobsAndPosts";
import { SavedJobsAndPosts } from "../../interfaces/models/subModels/savedJobsAndPosts";

class SavedJobsAndPostsRepository  implements ISavedJobsAndPostsRepository{

    async insertJob(userId: string, jobId: string): Promise<SavedJobsAndPosts | any> {
        try {
            const result = await savedJobsAndPostsModel.findOneAndUpdate(
                { user_id: userId}, 
                { $push: { savedJobs: { job_id: jobId } } }, 
                { new: true, upsert: true } 
            );
            if (result) {
                return result
            } else {
                return null
            }
        } catch (error) {
            throw error
        }
    }

    async isJobSaved(user_id: string, job_id: string): Promise<SavedJobsAndPosts | any> {
        try {
            const result = await savedJobsAndPostsModel.findOne({
                user_id: user_id,
                savedJobs: { $elemMatch: { job_id: job_id } }
            })            

            if (result) {
                return result
            } else {
                return null
            }
        } catch (error) {
            throw error
        }
    }

    async removeJob(userId: string, jobId: string): Promise<SavedJobsAndPosts | any> {
        try {
            const result = await savedJobsAndPostsModel.findOneAndUpdate(
                { user_id: userId }, 
                { $pull: { savedJobs: { job_id: jobId } } },
                { new: true } 
            );

            console.log('res here',result);
            

            if (result) {
                return result
            } else {
                return null
            }
        } catch (error) {
            throw error
        }
    }

}

export default SavedJobsAndPostsRepository