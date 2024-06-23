import { AdminOutput } from "../models/adminOutput"

interface IAdminUseCase {

    login(email:string, password:string): Promise<AdminOutput>
    refreshToken(refreshToken:string): Promise<AdminOutput>
    getDashboardStatistics(startDate:string, endDate:string): Promise<AdminOutput>
    fetchAllUsers(pageNo:number, sort:string, search:string,filter:any): Promise<AdminOutput>
    userAction(user_id:string): Promise<AdminOutput>
    fetchUserByUserId(user_id:string): Promise<AdminOutput>
    fetchAllEmployers(pageNo:number, sort:string, filter?:any): Promise<AdminOutput>
    employerAction(employer_id:string): Promise<AdminOutput>
    verifyEmployer(employer_id:string): Promise<AdminOutput>
    fetchAllJobs(pageNo:number, sort:string, search:string, filter?:any): Promise<AdminOutput>
    jobAction(job_id:string): Promise<AdminOutput>
}

export default IAdminUseCase