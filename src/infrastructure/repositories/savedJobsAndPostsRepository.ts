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

    async triggerInsertPost(user_Id: string, post_Id: string): Promise<SavedJobsAndPosts | any> {
        try {
            const existingDoc = await savedJobsAndPostsModel.findOne({
                user_id: user_Id,
                'savedPosts.post_id': post_Id
            });
    
            let result;
    
            if (existingDoc) {
                result = await savedJobsAndPostsModel.findOneAndUpdate(
                    { user_id: user_Id },
                    { $pull: { savedPosts: { post_id: post_Id } } },
                    { new: true }
                );
            } else {
                result = await savedJobsAndPostsModel.findOneAndUpdate(
                    { user_id: user_Id },
                    { $addToSet: { savedPosts: { post_id: post_Id } } },
                    { new: true, upsert: true }
                );
            }
    
            if (!result) throw new Error('Something went wrong');
            
            return result;
        } catch (error) {
            throw error;
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

    async findSavedJobs(user_id: string): Promise<SavedJobsAndPosts | any> {
        try {
            const savedJobs = await savedJobsAndPostsModel.findOne(
                { user_id:user_id }
            ).populate({
                path: 'savedJobs.job_id',
                populate: {
                  path: 'company_id'
                }
              });
            
            if (savedJobs) {
                return savedJobs
            } else {
                return null
            }
        } catch (error) {
            throw error
        }
    }

    async findSavedPosts(user_Id: string): Promise<SavedJobsAndPosts | any> {
        try {
            const savedPosts = await savedJobsAndPostsModel.aggregate([
                { $match: { user_id: new mongoose.Types.ObjectId(user_Id) } },
                { $unwind: "$savedPosts" },
                {
                    $lookup: {
                        from: "posts",
                        let: { postId: "$savedPosts.post_id" },
                        pipeline: [
                            { $match: { $expr: { $in: ["$$postId", "$posts._id"] } } },
                            { $unwind: "$posts" },
                            { $match: { $expr: { $eq: ["$$postId", "$posts._id"] } } },
                            {
                                $lookup: {
                                    from: "users",
                                    localField: "posts.comments.user_id",
                                    foreignField: "_id",
                                    as: "commentUsers"
                                }
                            },
                            {
                                $addFields: {
                                    "posts.comments": {
                                        $map: {
                                            input: "$posts.comments",
                                            as: "comment",
                                            in: {
                                                $mergeObjects: [
                                                    "$$comment",
                                                    {
                                                        user: {
                                                            $arrayElemAt: [
                                                                {
                                                                    $filter: {
                                                                        input: "$commentUsers",
                                                                        as: "user",
                                                                        cond: { $eq: ["$$user._id", "$$comment.user_id"] }
                                                                    }
                                                                },
                                                                0
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                $project: {
                                    _id: "$posts._id",
                                    employer_id: 1,  
                                    image_urls: "$posts.image_urls",
                                    likes: "$posts.likes",
                                    saved: "$posts.saved",
                                    description: "$posts.description",
                                    comments: "$posts.comments",
                                }
                            }
                        ],
                        as: "savedPostDetails"
                    }
                },
                { $unwind: "$savedPostDetails" },
                {
                    $group: {
                        _id: "$_id",
                        user_id: { $first: "$user_id" },
                        savedJobs: { $first: "$savedJobs" },
                        savedPosts: { $push: "$savedPostDetails" }
                    }
                }
            ]);
    
            if (!savedPosts) throw new Error('Posts not found');
    
            return savedPosts[0] || [];
        } catch (error) {
            throw error;
        }
    }
    
    
    

}

export default SavedJobsAndPostsRepository