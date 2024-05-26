import admin from "../../interfaces/models/admin";
import IAdminRepository from "../../interfaces/iRepositories/iAdminRepository";
import adminModel from "../../entities_models/adminModel";

class AdminRepository implements IAdminRepository {

    async findByEmail(email: string): Promise<admin | null> {
        const admin = await adminModel.findOne({ email: email })
        if (admin) {
            return admin
        } else {
            return null
        }
    }

    async findById(id: string): Promise<admin | null> {
        const admin = await adminModel.findById(id)
        if (admin) {
            return admin
        } else {
            return null
        }
    }

}

export default AdminRepository