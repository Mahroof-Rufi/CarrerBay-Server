interface IJobApplicantsRepository {

    addAppliedUser(job_id:string, user_id:string, resume_url:string): Promise<any | null>,
    findOne(job_id:string): Promise<any | null>
    findOneCandidate(job_id:string, user_id:string): Promise<any>
    updateCandidateStatus(job_id:string, user_id:string, newStatus:string): Promise<any>
    rejectCandidateStatus(job_id:string, user_id:string): Promise<any>
    getHiringStatistics(startDate:string, endDate:string): Promise<number[]>
}

export default IJobApplicantsRepository