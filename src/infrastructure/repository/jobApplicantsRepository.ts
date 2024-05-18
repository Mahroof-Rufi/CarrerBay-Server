import jobApplicantsInterface from "../../use-case/interface/jobApplicantsInterface"
import jobApplicantsModel from "../data-base/jobApplicantsModel"

class jobApplicantsRepository implements jobApplicantsInterface {
    
    async addAppliedUser(job_id: string, user_id: string): Promise<any> {
        const appliedUsers = await jobApplicantsModel.findOneAndUpdate(
            { job_id:job_id },
            { $addToSet: { appliedUsers: { user_id: user_id, status: "under-review" } } },
            { upsert: true, new: true }
        )
        if (appliedUsers) {
            return appliedUsers
        } else {
            return null
        }
    }

    async findOne(job_id: string): Promise<any> {
        const appliedUsers = await jobApplicantsModel.findOne(
            { job_id:job_id }
        ).populate({
            path: 'appliedUsers.user_id',
            model: 'user'        
          });

        if (appliedUsers) {
            return appliedUsers
        } else {
            return null
        }
    }

    async updateCandidateStatus(job_id: string, user_id: string, newStatus: string): Promise<any> {
        const updatedJobApplicant = await jobApplicantsModel.findOneAndUpdate(
            {  job_id: job_id, 'appliedUsers.user_id': user_id  },
            {  $set: { 'appliedUsers.$.status': newStatus } },
            {  new: true }
        ).populate('appliedUsers.user_id');

        if (updatedJobApplicant) {
            return updatedJobApplicant
        } else {
            return null
        }
    }

    async findOneCandidate(job_id: string, user_id: string): Promise<any> {
        const jobApplication = await jobApplicantsModel.findOne(
            { job_id: job_id, 'appliedUsers.user_id': user_id }
        )

        if (jobApplication) {
            return jobApplication
        } else {
            null
        }
    }

}

export default jobApplicantsRepository