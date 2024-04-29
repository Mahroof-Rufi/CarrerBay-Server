import employer from "../../domain/employer";
import employerRepo from "../../use-case/interface/employerController";
import employerModel from "../data-base/employerModel";

class employerRepository implements employerRepo{

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
    
}

export default employerRepository