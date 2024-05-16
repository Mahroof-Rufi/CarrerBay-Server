import user from "../../domain/user";

interface UserInterface {

    insertOne(user:user): Promise<user>,
    findByEmail(email:string): Promise<user | null>,
    updatePassword(email:string, password:string): Promise<user | null>
    findById(id:string): Promise<user | null>
}

export default UserInterface