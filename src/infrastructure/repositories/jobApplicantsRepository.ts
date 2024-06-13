import IJobApplicantsRepository from "../../interfaces/iRepositories/iJobApplicantsRepository"
import jobApplicantsModel from "../../entities_models/jobApplicantsModel"

class JobApplicantsRepository implements IJobApplicantsRepository {
    
    async addAppliedUser(job_id: string, user_id: string, resume_url:string): Promise<any> {
        try {
            const appliedUsers = await jobApplicantsModel.findOneAndUpdate(
                { job_id:job_id },
                { $addToSet: { appliedUsers: { user_id: user_id, resume:resume_url, status: "under-review" } } },
                { upsert: true, new: true }
            )
            if (appliedUsers) {
                return appliedUsers
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async findOne(job_id: string): Promise<any> {
        try {
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
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async updateCandidateStatus(job_id: string, user_id: string, newStatus: string): Promise<any> {
        try {
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
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async rejectCandidateStatus(job_id: string, user_id: string): Promise<any> {
        try {
            const updatedJobApplicant = await jobApplicantsModel.findOneAndUpdate(
                { job_id: job_id, 'appliedUsers.user_id': user_id },
                { $set: { 'appliedUsers.$.rejected': true } },
                {  new: true }
            ).populate('appliedUsers.user_id');
    
            if (updatedJobApplicant) {
                return updatedJobApplicant
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async findOneCandidate(job_id: string, user_id: string): Promise<any> {
        try {
            const jobApplication = await jobApplicantsModel.findOne(
                { job_id: job_id, 'appliedUsers.user_id': user_id }
            )
    
            if (jobApplication) {
                return jobApplication
            } else {
                null
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

}

export default JobApplicantsRepository