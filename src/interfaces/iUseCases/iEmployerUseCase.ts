import Employer from "../models/employer"
import { EmployerOutput } from "../models/employerOutput"

interface IEmployerUseCase {

    sendOTP(email:string): Promise<EmployerOutput>
    register(employerData:Employer): Promise<EmployerOutput>
    login(email:string, employerPassword:string): Promise<EmployerOutput>
    fetchEmployerData(token:string): Promise<EmployerOutput>
    forgotPasswordSendOTP(email:string): Promise<EmployerOutput>
    resetPassword(email:string, OTP:number, password:string): Promise<EmployerOutput>
    loadCompanies(): Promise<EmployerOutput>
    updateProfile(newData:Employer): Promise<EmployerOutput>
    updateEmailWithOTP(email:string, OTP:number, newEmail:string): Promise<EmployerOutput>

}

export default IEmployerUseCase