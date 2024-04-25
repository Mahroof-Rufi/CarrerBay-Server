import user from "../../domain/user";

interface UserRepo {

    save(user:user): Promise<user>,
    findByEmail(email:string): Promise<user | null>,

}

export default UserRepo