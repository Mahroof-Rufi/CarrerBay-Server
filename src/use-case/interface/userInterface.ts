import { experience,user } from "../../domain/user";

interface UserInterface {

    insertOne(user:user): Promise<user>,
    findByEmail(email:string): Promise<user | null>,
    updatePassword(email:string, password:string): Promise<user | null>
    findById(id:string): Promise<user | null>
    addUserExperience(user_id:string, experience:experience): Promise<user | null>
    updateUserExperience(user_id:string, exp_id:string, experience:experience): any
}

export default UserInterface