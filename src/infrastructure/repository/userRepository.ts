import user from "../../domain/user";
import UserInterface from "../../use-case/interface/userInterface";
import userModel from "../data-base/userModel";

class userRepository implements UserInterface {

    async insertOne(user: user): Promise<user> {
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

    async updatePassword(email: string, newPassword:string): Promise<user | null> {
        const newData = await userModel.findOneAndUpdate(
            { email:email },
            { password: newPassword },
            { new: true }
        )
        if (newData) {
            return newData
        } else {
            return null
        }
    }

}

export default userRepository