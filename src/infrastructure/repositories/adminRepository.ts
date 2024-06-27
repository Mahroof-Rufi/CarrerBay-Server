import admin from "../../interfaces/models/admin";
import IAdminRepository from "../../interfaces/iRepositories/iAdminRepository";
import adminModel from "../../entities_models/adminModel";

class AdminRepository implements IAdminRepository {

    async findByEmail(email: string): Promise<admin | null> {
        try {
            const admin = await adminModel.findOne({ email: email })
            if (admin) {
                return admin
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            throw error            
        }
    }

    async findById(id: string): Promise<admin | null> {
        try {
            const admin = await adminModel.findById(id)
            if (admin) {
                return admin
            } else {
                return null
            }
        } catch (error) {
            console.log(error);      
            throw error      
        }
    }

}

export default AdminRepository 