import { EditUser, education, experience, g_Auth_User, user } from "../../domain/user";
import UserInterface from "../../use-case/interface/userInterface";
import userModel from "../data-base/userModel";

class userRepository implements UserInterface {

    async insertOne(user: user | g_Auth_User): Promise<user> {
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

    async findById(id: string): Promise<user | null> {
        const userData = await userModel.findById(id)
        if (userData) {
            return userData
        } else {
            return null
        }
    }

    async findByIdAndUpdate(id:string, newData:EditUser): Promise <user | null> {
        const userData = await userModel.findByIdAndUpdate(
            id,
            { $set:newData },
            { new:true }
        )
        return userData ? userData : null
    }

    async addUserExperience(user_id: string, experience: experience): Promise<user | null> {
        const updatedData = await userModel.findByIdAndUpdate(
            user_id,
            { $push: { experiences: experience } },
            { upsert:true, new:true }
        )

        return updatedData ? updatedData : null
    }

    async updateUserExperience(user_id: string, exp_id: string, experience: experience): Promise<user | null> {
        const updatedData = await userModel.findOneAndUpdate(
            { _id: user_id, 'experiences._id': exp_id },
            { $set: { 'experiences.$': experience } },
            { new:true }
        );        
    
        return updatedData ? updatedData : null;
    }

    async addUserEducation(user_id: string, education: education): Promise<user | null> {
        const updatedData = await userModel.findByIdAndUpdate(
            user_id,
            { $push: { educations: education } },
            { upsert:true, new:true }
        )
        return updatedData ? updatedData : null
    }

    async updateUserEducation(user_id: string, education: education, edct_id: string): Promise<user | null> {
        const updatedData = await userModel.findOneAndUpdate(
            { _id: user_id, 'educations._id': edct_id },
            { $set: { 'educations.$': education } },
            { new:true }
        );        
    
        return updatedData ? updatedData : null;
    }

    async updateUserSkills(user_id: string, skills: string[]): Promise<user | null> {
        const updatdData = await userModel.findOneAndUpdate(
            { _id:user_id },
            { $set: { 'skills':skills } },
            { new:true }
        );

        return updatdData ? updatdData : null
    }

}

export default userRepository