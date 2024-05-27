import { AppliedUsers } from "./appliedUsers";
import { UserAppliedJobs } from "./userAppliedJobs";

export interface JobApplicantsOutput {
    status:number,
    message:string,
    appliedUsers?:AppliedUsers,
    appliedJobs?:UserAppliedJobs,
    isApplied?:boolean,

}