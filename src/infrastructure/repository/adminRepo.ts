import admin from "../../domain/admin";
import adminRepo from "../../use-case/interface/adminController";
import adminModel from "../data-base/admin";

class adminRepository implements adminRepo {

    async findByEmail(email: string): Promise<admin | null> {
        const admin = await adminModel.findOne({ email: email })
        if (admin) {
            return admin
        } else {
            return null
        }
    }

}

export default adminRepository