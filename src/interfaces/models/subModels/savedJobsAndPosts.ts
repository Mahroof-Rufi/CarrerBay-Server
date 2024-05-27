export interface SavedJobsAndPosts {
    _id?: string,
    user_id: string,
    savedJobs: string[],
    savedPosts: string[],
}