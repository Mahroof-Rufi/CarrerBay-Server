import { AppliedJob } from "./subModels/appliedJob"

export interface UserAppliedJobs{
    user_id: string,
    appliedJobs: [AppliedJob]
}