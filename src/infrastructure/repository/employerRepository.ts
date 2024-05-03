import employer from "../../domain/employer";
import employerInterface from "../../use-case/interface/employerInterface";
import employerModel from "../data-base/employerModel";

class employerRepository implements employerInterface{

    async insertOne(employer: employer): Promise<employer> {
        const newEmployer = new employerModel(employer)
        await newEmployer.save()
        return newEmployer
    }

    async findByEmail(email: string): Promise<employer | null> {
        const employer = await employerModel.findOne({ email:email })
        if (employer) {
            return employer
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
    
}

export default employerRepository