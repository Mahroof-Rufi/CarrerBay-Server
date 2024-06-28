import { SavedJobsAndPosts } from "../models/subModels/savedJobsAndPosts"

interface ISavedJobsAndPostsRepository {

    insertJob(userId:string, jobId:string): Promise<SavedJobsAndPosts | null>
    triggerInsertPost(user_Id:string, post_Id:string): Promise<SavedJobsAndPosts | null>
    isJobSaved(user_id:string, job_id:string): Promise<SavedJobsAndPosts | null>
    removeJob(userId:string, jobId:string): Promise<SavedJobsAndPosts | null>
    findSavedJobs(user_id:string): Promise<SavedJobsAndPosts| null>
    findSavedPosts(user_Id:string): Promise<SavedJobsAndPosts>

}

export default ISavedJobsAndPostsRepository