import { Experience } from "../../interfaces/models/subModels/experience";
import { Education } from "../../interfaces/models/subModels/education";
import { EditUser, G_AuthUser, User } from "../../interfaces/models/user";
import IUserRepository from "../../interfaces/iRepositories/iUserRepository";
import userModel from "../../entities_models/userModel";
import { SortOrder } from "mongoose";
import bcrypt from "bcrypt";

class UserRepository implements IUserRepository {

    async insertOne(user: User ): Promise<User> {
        try {
            const salt = await bcrypt.genSalt(10);                                       
            user.password = await bcrypt.hash(user.password, salt);
            const newUser = new userModel(user);
            await newUser.save();
            return newUser;
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
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            const newData = await userModel.findOneAndUpdate(
                { email: email },
                { password: hashedPassword },
                { new: true }
            );

            if (newData) {
                return newData;
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getUsersStatistics(startDate: string, endDate: string): Promise<number[]> {
        try {
            const pipeline = [
                {
                  $match: {
                    joinedAt: {
                      $gte: new Date(startDate),
                      $lte: new Date(endDate)
                    }
                  }
                },
                {
                  $group: {
                    _id: { $month: "$joinedAt" },
                    count: { $sum: 1 }
                  }
                },
                {
                  $sort: { _id: 1 as 1 | -1 }
                }
              ];
            
              const result = await userModel.aggregate(pipeline).exec();

              const monthlyCountsArray = Array(6).fill(0);
          
              result.forEach(item => {
                const monthIndex = item._id - 1; 
                monthlyCountsArray[monthIndex] = item.count;
              });
              console.log(monthlyCountsArray);
              
              return monthlyCountsArray;
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async findById(id: string): Promise<User | null> {
        try {
            const userData = await userModel.findById(id)
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

    async findByIdAndUpdate(id:string, newData:EditUser): Promise <User | null> {
        try {
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
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async updateUserAbout(user_id: string, about: string): Promise<User | null> {
        try {
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
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async addUserExperience(user_id: string, experience: Experience): Promise<User | null> {
        try {
            const updatedData = await userModel.findByIdAndUpdate(
                user_id,
                { $push: { experiences: experience } },
                { upsert:true, new:true }
            )
    
            return updatedData ? updatedData : null
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async updateUserExperience(user_id: string, exp_id: string, experience: Experience): Promise<User | null> {
        try {
            const updatedData = await userModel.findOneAndUpdate(
                { _id: user_id, 'experiences._id': exp_id },
                { $set: { 'experiences.$': experience } },
                { new:true }
            );        
        
            return updatedData ? updatedData : null;
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async deleteUserExperience(user_id: string, exp_id: string): Promise<User | null> {
        try {
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
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async addUserEducation(user_id: string, education: Education): Promise<User | null> {
        try {
            const updatedData = await userModel.findByIdAndUpdate(
                user_id,
                { $push: { educations: education } },
                { upsert:true, new:true }
            )
            return updatedData ? updatedData : null
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async updateUserEducation(user_id: string, education: Education, edct_id: string): Promise<User | null> {
        try {
            const updatedData = await userModel.findOneAndUpdate(
                { _id: user_id, 'educations._id': edct_id },
                { $set: { 'educations.$': education } },
                { new:true }
            );        
        
            return updatedData ? updatedData : null;
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    
    async deleteUserEducation(user_id: string, edu_id: string): Promise<User | null> {
        try {
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
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async updateUserSkills(user_id: string, skills: string[]): Promise<User | null> {
        try {
            const updatdData = await userModel.findOneAndUpdate(
                { _id:user_id },
                { $set: { 'skills':skills } },
                { new:true }
            );
    
            return updatdData ? updatdData : null
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async changeEmailByEmail(currentEmail: string, newEmail: string): Promise<User | null> {
        try {
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
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async fetchAllUsers(skip: number, limit: number, user_id?: string, sort?: string, filter?: any, search?:string): Promise<any> {      
        try {
            if (!filter) {
                filter = {};
            }
            
            if (user_id) {
                filter._id = { $ne: user_id };
            }
            
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
                const users = await userModel.find(filter,{ password: 0 }).sort(sortQuery).skip(skip).limit(limit);            
                return users || null;
            }
        } catch (error) {
            console.log(error);
            throw error
        }        
    }

    async fetchUsersCount(user_id?: string, filter?: any): Promise<number> {
        try {
            if (user_id) {
                filter._id = { $ne: user_id };
            }
            const users = await userModel.find(filter)
            return users.length || 0;
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async changeStatusById(user_id: string): Promise<User | null> {
        try {
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
        } catch (error) {
            console.log(error);
            throw error
        }
    }

}

export default UserRepository