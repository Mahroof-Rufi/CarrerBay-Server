import jobApplicantsInterface from "../../use-case/interface/jobApplicantsInterface"
import jobApplicantsModel from "../data-base/jobApplicantsModel"

class jobApplicantsRepository implements jobApplicantsInterface {
    
    async addAppliedUser(job_id: string, user_id: string): Promise<any> {
        const appliedUsers = await jobApplicantsModel.findOneAndUpdate(
            { job_id:job_id },
            { $addToSet: { appliedUsers: { user_id: user_id, status: "Review" } } },
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
        )

        if (appliedUsers) {
            return appliedUsers
        } else {
            return null
        }
    }

}

export default jobApplicantsRepository