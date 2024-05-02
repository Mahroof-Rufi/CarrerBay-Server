import user from "../../domain/user";

interface UserInterface {

    insertOne(user:user): Promise<user>,
    findByEmail(email:string): Promise<user | null>,

}

export default UserInterface