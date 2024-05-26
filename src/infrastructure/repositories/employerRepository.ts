import employer from "../../interfaces/models/employer";
import IEmployerRepository from "../../interfaces/iRepositories/iEmployerRepository";
import employerModel from "../../entities_models/employerModel";

class EmployerRepository implements IEmployerRepository{

    async insertOne(employer: employer): Promise<employer> { 
        const newEmployer = new employerModel(employer)
        await newEmployer.save()
        return newEmployer
    }

    async findByEmail(email: string): Promise<employer | null> {
        const employer = await employerModel.findOne({ email:email }).lean()
        if (employer) {
            return employer
        } else {
            return null
        }
    }

    async findById(id:string): Promise<employer | null> {
        const employerData = await employerModel.findById(id)
        if (employerData) {
            return employerData
        } else {
            return null
        }
    }

    async updatePassword(email: string, newPassword: string): Promise<employer | null> {
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
    }

    async updateProfile(email:string, newData:employer): Promise<employer | null> {
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
    }

    async updateEmail(email:string, newEmail:string): Promise<employer | null> {
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
    }

    async fetchAllEmployers(): Promise<any> {
        const employers = await employerModel.find()
        if (employers) {
            return employers
        } else {
            return null
        }
    }

    async changeStatusById(employer_id: string): Promise<employer | null> {
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
    }
    
}

export default EmployerRepository