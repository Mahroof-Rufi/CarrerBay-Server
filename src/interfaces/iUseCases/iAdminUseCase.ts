import { AdminOutput } from "../models/adminOutput"

interface IAdminUseCase {

    login(email:string, password:string): Promise<AdminOutput>
    fetchAllUsers(): Promise<AdminOutput>
    userAction(user_id:string): Promise<AdminOutput>
    fetchAllEmployers(): Promise<AdminOutput>
    employerAction(employer_id:string): Promise<AdminOutput>

}

export default IAdminUseCase