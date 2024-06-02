import { Education } from "../models/subModels/education"
import { Experience } from "../models/subModels/experience"
import { EditUser, User } from "../models/user"
import { UserOutput } from "../models/userOutput"

interface IUserUseCase {

    sendOTP(email:string): Promise<UserOutput>
    signUp(userData:User): Promise<UserOutput>
    logIn(email:string, password:string): Promise<UserOutput>
    refreshToken(token:string): Promise<UserOutput>
    gAuth(fullName:string, email:string, password:string, google_id:string): Promise<UserOutput>
    forgotPasswordSendOTP(email:string): Promise<UserOutput>
    resetPassword(email:string, OTP:number, password:string): Promise<UserOutput>
    fetchUserDataWithToken(token:string): Promise<UserOutput>
    fetchUsersData(token:string, pageNo:string, sort:string, search:string,filter:any): Promise<UserOutput>
    fetchEmployersData(pageNo:string, sort:string, search:string, filter:any): Promise<UserOutput>
    isUserBlockedOrNot(token:string): Promise<UserOutput>
    loadUsers(pageNo:string): Promise<UserOutput>
    updateUserProfile(newData:EditUser, token:string): Promise<UserOutput>
    updateUserAbout(token:string, about:string): Promise<UserOutput>
    updateUserExperience(token:string, experience:Experience, experience_id?:string): Promise<UserOutput>
    deleteUserExperience(token:string, experience_id:string): Promise<UserOutput>
    updateUserEducation(token:string, education:Education, education_id?:string): Promise<UserOutput>
    deleteUserEducation(token:string, education_id:string): Promise<UserOutput>
    updateUserSkills(token:string, skills:string[]): Promise<UserOutput>
    sendOTPToCurrentEmail(currentEmail:string): Promise<UserOutput>
    updateCurrentEmail(currentEmail:string, currentEmailOTP:string, newEmail:string, newEmailOTP:string): Promise<UserOutput>

}

export default IUserUseCase