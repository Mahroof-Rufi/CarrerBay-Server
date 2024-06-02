import { Experience } from "../../interfaces/models/subModels/experience";
import { Education } from "../../interfaces/models/subModels/education";
import { EditUser, G_AuthUser, User } from "../../interfaces/models/user";
import IUserRepository from "../../interfaces/iRepositories/iUserRepository";
import userModel from "../../entities_models/userModel";
import { SortOrder } from "mongoose";

class UserRepository implements IUserRepository {

    async insertOne(user: User | G_AuthUser): Promise<User> {
        try {
            const newUser = new userModel(user)
            await newUser.save()
            return newUser
        } catch (error) {
            console.log(error);            
            throw error
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const userData = await userModel.findOne({ email })
            if (userData) {
                return userData
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            
            throw error
        }
    }

    async updatePassword(email: string, newPassword:string): Promise<User | null> {
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

    async findById(id: string): Promise<User | null> {
        const userData = await userModel.findById(id)
        if (userData) {
            return userData
        } else {
            return null
        }
    }

    async findByIdAndUpdate(id:string, newData:EditUser): Promise <User | null> {
        const userData = await userModel.findByIdAndUpdate(
            id,
            { $set:newData },
            { new:true }
        )
        if (userData) {
            return userData
        } else {
            return null
        }
    }

    async updateUserAbout(user_id: string, about: string): Promise<User | null> {
        const userData = await userModel.findByIdAndUpdate(
            user_id,
            { about:about },
            { new:true }
        )
        if (userData) {
            return userData
        } else {
            return null
        }
    }

    async addUserExperience(user_id: string, experience: Experience): Promise<User | null> {
        const updatedData = await userModel.findByIdAndUpdate(
            user_id,
            { $push: { experiences: experience } },
            { upsert:true, new:true }
        )

        return updatedData ? updatedData : null
    }

    async updateUserExperience(user_id: string, exp_id: string, experience: Experience): Promise<User | null> {
        const updatedData = await userModel.findOneAndUpdate(
            { _id: user_id, 'experiences._id': exp_id },
            { $set: { 'experiences.$': experience } },
            { new:true }
        );        
    
        return updatedData ? updatedData : null;
    }

    async deleteUserExperience(user_id: string, exp_id: string): Promise<User | null> {
        const updatedUserData = await userModel.findOneAndUpdate(
            { _id: user_id },
            { $pull: { experiences: { _id: exp_id } } },
            { new: true }
        );

        if (updatedUserData) {
            return updatedUserData
        } else {
            return null
        }
    }

    async addUserEducation(user_id: string, education: Education): Promise<User | null> {
        const updatedData = await userModel.findByIdAndUpdate(
            user_id,
            { $push: { educations: education } },
            { upsert:true, new:true }
        )
        return updatedData ? updatedData : null
    }

    async updateUserEducation(user_id: string, education: Education, edct_id: string): Promise<User | null> {
        const updatedData = await userModel.findOneAndUpdate(
            { _id: user_id, 'educations._id': edct_id },
            { $set: { 'educations.$': education } },
            { new:true }
        );        
    
        return updatedData ? updatedData : null;
    }
    
    async deleteUserEducation(user_id: string, edu_id: string): Promise<User | null> {
        const updatedUserData = await userModel.findOneAndUpdate(
            { _id: user_id },
            { $pull: { educations: { _id: edu_id } } },
            { new: true }
        );

        if (updatedUserData) {
            return updatedUserData
        } else {
            return null
        }
    }

    async updateUserSkills(user_id: string, skills: string[]): Promise<User | null> {
        const updatdData = await userModel.findOneAndUpdate(
            { _id:user_id },
            { $set: { 'skills':skills } },
            { new:true }
        );

        return updatdData ? updatdData : null
    }

    async changeEmailByEmail(currentEmail: string, newEmail: string): Promise<User | null> {
        const updatedData = await userModel.findOneAndUpdate(
            { email:currentEmail },
            { $set: { email:newEmail } },
            { new:true }
        )

        if (updatedData) {
            return updatedData
        } else {
            return null
        }
    }

    async fetchAllUsers(skip: number, limit: number, user_id?: string, sort?: string, search?:string, filter?: any): Promise<any> {
        filter._id = { $ne: user_id };
        
        let sortQuery: { [key: string]: SortOrder } = { firstName: 1 };
        if (sort === 'a-z') {
            sortQuery = { firstName: 1 };
        } else if (sort === 'z-a') {
            sortQuery = { firstName: -1 };
        }      
        
        if (search) {
            const regex = new RegExp(search, 'i'); 
            filter.$or = [
                { firstName: regex },
                { lastName: regex },
                { jobTitle: regex }
            ];
        }
        
        if (user_id) {
            const users = await userModel.find(filter, { password: 0 }).sort(sortQuery).skip(skip).limit(limit);
            return users || null;
        } else {
            const users = await userModel.find({ password: 0 }).sort(sortQuery).skip(skip).limit(limit);
            return users || null;
        }
        
    }

    async fetchUsersCount(user_id: string, filter?: any): Promise<number> {
        if (user_id) {
            filter._id = { $ne: user_id };
        }
        const users = await userModel.find(filter)
        return users.length || 0;
    }

    async changeStatusById(user_id: string): Promise<User | null> {
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: user_id },
            [ { $set: { isActive: { $not: "$isActive" } } } ],
            { new:true }
        )
        if (updatedUser) {
            return updatedUser
        } else {
            return null
        }
    }

}

export default UserRepository