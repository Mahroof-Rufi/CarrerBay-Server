import employer from "../../interfaces/models/employer";
import IEmployerRepository from "../../interfaces/iRepositories/iEmployerRepository";
import employerModel from "../../entities_models/employerModel";
import { SortOrder } from "mongoose";

class EmployerRepository implements IEmployerRepository{

    async insertOne(employer: employer): Promise<employer> { 
        try {
            const newEmployer = new employerModel(employer)
            await newEmployer.save()
            return newEmployer
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async findByEmail(email: string): Promise<employer | null> {
        try {
            const employer = await employerModel.findOne({ email:email }).lean()
            if (employer) {
                return employer
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async findById(id:string): Promise<employer | null> {
        try {
            const employerData = await employerModel.findById(id)
            return employerData || null
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async updatePassword(email: string, newPassword: string): Promise<employer | null> {
        try {
            const newData = await employerModel.findOneAndUpdate(
                { email:email },
                { password: newPassword },
                { new: true }
            )
            if (newData) {
                return newData
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async updateProfile(email:string, newData:employer): Promise<employer | null> {
        try {
            const updatedData = await employerModel.findOneAndUpdate(
                { email:email },
                { $set:newData },
                { new:false }
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

    async updateEmail(email:string, newEmail:string): Promise<employer | null> {
        try {
            const updatedData = await employerModel.findOneAndUpdate(
                { email:email },
                { $set: {
                    email:newEmail
                } },
                { new:true }
            )
            if(updatedData) {
                return updatedData
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async fetchAllEmployers(skip:number, limit:number, employer_id?:string, sort?:string, search?:string, filterQuery?:any): Promise<any> {
        try {
            let sortQuery: { [key: string]: SortOrder } = { companyName: 1 }
            if (sort == 'a-z') {
                sortQuery = { companyName: 1 }
            } else {
                sortQuery = { companyName: -1 }
            }

            if (search) {
                const regex = new RegExp(search, 'i'); 
                filterQuery.$or = [
                    { companyName: regex },
                    { industry: regex },
                ];
            }

            if (employer_id) {
                const employers = await employerModel.find({ _id:{ $ne:employer_id } }).sort(sortQuery).skip(skip).limit(limit)
                return employers || null
            } else {
                const employers = await employerModel.find(filterQuery).skip(skip).sort(sortQuery).limit(limit)            
                return employers || null
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async FetchEmployersCount(filterQuery?: any): Promise<number> {
        try {
            const employers = await employerModel.find(filterQuery)
            return employers.length || 0
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async changeStatusById(employer_id: string): Promise<employer | null> {
        try {
            const updatedEmployer = await employerModel.findOneAndUpdate(
                { _id: employer_id },
                [ { $set: { isActive: { $not: "$isActive" } } } ],
                { new:true }
            )
            if (updatedEmployer) {
                return updatedEmployer
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    
}

export default EmployerRepository