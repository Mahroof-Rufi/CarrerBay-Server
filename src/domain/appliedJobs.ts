export interface AppliedJob {
    job_id: string,
    status: string
}

export interface AppliedJobs{
    user_id: string,
    appliedJobs: [AppliedJob]
}