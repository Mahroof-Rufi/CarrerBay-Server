import { JobApplicantsOutput } from "../models/jobApplicantsOutput"

interface IJobApplicantsUseCase {

    fetchJobApplicants(job_id:string): Promise<JobApplicantsOutput>
    updateCandidateStatus(job_id:string, user_id:string, newStatus:string): Promise<JobApplicantsOutput>
    rejectCandidate(job_id:string, user_id:string): Promise<JobApplicantsOutput>
    applyJobs(token:string, job_id:string): Promise<JobApplicantsOutput>
    verifyUserApplication(token:string, job_id:string): Promise<JobApplicantsOutput>
    fetchAppliedJobs(token:string): Promise<JobApplicantsOutput>

}

export default IJobApplicantsUseCase