interface IAppliedJobsRepository {

    addAppliedJob(user_id:string, job_id:string): Promise<any | null>,
    findOneById(user_id:string): Promise<any>,
    updateJobStatusById(user_id:string, job_id:string, newStatus:string): Promise<any>
    rejectApplication(user_id:string, job_id:string): Promise<any>
    getAppliedJobsStatistics(startDate:string, endDate:string): Promise<number[]>
    getTotalAppliedJobsCount(): Promise<number> 

}

export default IAppliedJobsRepository