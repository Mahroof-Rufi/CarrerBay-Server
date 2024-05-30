import { Experience } from "../models/subModels/experience";
import { Education } from "../models/subModels/education";
import { User } from "../models/user";

interface IUserRepository {

    insertOne(user:User): Promise<User>,
    findByEmail(email:string): Promise<User | null>,
    updatePassword(email:string, password:string): Promise<User | null>
    findById(id:string): Promise<User | null>
    updateUserAbout(user_id:string, about:string): Promise<User | null>
    addUserExperience(user_id:string, experience:Experience): Promise<User | null>
    updateUserExperience(user_id:string, exp_id:string, experience:Experience): Promise<User | null>
    deleteUserExperience(user_id:string, exp_id:string): Promise<User | null>
    addUserEducation(user_id:string, education:Education): Promise<User | null>
    updateUserEducation(user_id:string, education:Education, edct_id:string): Promise<User | null>
    deleteUserEducation(user_id:string, edu_id:string): Promise<User | null>
    updateUserSkills(user_id:string, skills:string[]): Promise<User | null>
    changeEmailByEmail(currentEmail:string,newEmail:string):Promise<User | null>
    fetchAllUsers(limit:number,user_id?:string):Promise<User | null>
    changeStatusById(user_id:string):Promise<User | null>
}

export default IUserRepository