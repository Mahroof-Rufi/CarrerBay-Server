interface appliedJobsInterface {

    addAppliedJob(user_id:string, job_id:string): Promise<any | null>,
    findOneById(user_id:string): Promise<any>,
    updateJobStatusById(user_id:string, job_id:string, newStatus:string): Promise<any>

}

export default appliedJobsInterface