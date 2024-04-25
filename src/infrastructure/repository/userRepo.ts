import user from "../../domain/user";
import UserRepo from "../../use-case/interface/userController";
import userModel from "../data-base/userModel";

class userRepository implements UserRepo {

    async save(user: user): Promise<user> {
        const newUser = new userModel(user)
        await newUser.save()
        return newUser
    }

    async findByEmail(email: string): Promise<user | null> {
        const userData = await userModel.findOne({ email })
        if (userData) {
            return userData
        } else {
            return null
        }
    }

}

export default userRepository