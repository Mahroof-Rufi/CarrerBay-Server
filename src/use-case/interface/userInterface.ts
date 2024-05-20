import { education, experience,user } from "../../domain/user";

interface UserInterface {

    insertOne(user:user): Promise<user>,
    findByEmail(email:string): Promise<user | null>,
    updatePassword(email:string, password:string): Promise<user | null>
    findById(id:string): Promise<user | null>
    addUserExperience(user_id:string, experience:experience): Promise<user | null>
    updateUserExperience(user_id:string, exp_id:string, experience:experience): Promise<user | null>
    addUserEducation(user_id:string, education:education): Promise<user | null>
    updateUserEducation(user_id:string, education:education, edct_id:string): Promise<user | null>
    updateUserSkills(user_id:string, skills:string[]): Promise<user | null>
    changeEmailByEmail(currentEmail:string,newEmail:string):Promise<user | null>
    fetchAllUsers():Promise<user | null>
    changeStatusById(user_id:string):Promise<user | null>
}

export default UserInterface