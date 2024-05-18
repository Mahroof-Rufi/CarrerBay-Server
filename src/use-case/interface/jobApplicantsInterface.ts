interface jobApplicantsInterface {

    addAppliedUser(job_id:string, user_id:string,): Promise<any | null>,
    findOne(job_id:string): Promise<any | null>

}

export default jobApplicantsInterface