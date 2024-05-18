interface appliedJobsInterface {

    addAppliedJob(user_id:string, job_id:string): Promise<any | null>,
    findOneById(user_id:string): Promise<any>,

}

export default appliedJobsInterface