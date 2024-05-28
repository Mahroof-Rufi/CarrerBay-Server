import Job from "./job";
import { SavedJobsAndPosts } from "./subModels/savedJobsAndPosts";

export interface JobsOutput {
    status:number,
    message:string,
    job?:Job | null,
    jobs?:Job[] | null,
    savedJobsAndPosts?:SavedJobsAndPosts,
    isSaved?:boolean,
    noOfJobs?:number
}