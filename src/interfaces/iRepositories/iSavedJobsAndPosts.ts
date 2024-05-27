import { SavedJobsAndPosts } from "../models/subModels/savedJobsAndPosts"

interface ISavedJobsAndPostsRepository {

    insertJob(userId:string, jobId:string): Promise<SavedJobsAndPosts | null>
    isJobSaved(user_id:string, job_id:string): Promise<SavedJobsAndPosts | null>
    removeJob(userId:string, jobId:string): Promise<SavedJobsAndPosts | null>

}

export default ISavedJobsAndPostsRepository