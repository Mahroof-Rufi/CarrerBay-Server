import appliedJobsInterface from "../../use-case/interface/appliedJobsInterface";
import appliedJobsModel from "../data-base/appliedJobsModel";

class appliedJobsRepository implements appliedJobsInterface {
    
    async addAppliedJob(user_id: string, job_id: string): Promise<any> {
        const appliedJob = await appliedJobsModel.findOneAndUpdate(
            { user_id: user_id },
            { $addToSet: { appliedJobs: { job_id: job_id, status: "under-review" } } },
            { upsert: true, new: true }
        );
        return appliedJob ? appliedJob : null
    }

    async findOneById(user_id: string): Promise<any> {
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
    }

}

export default appliedJobsRepository