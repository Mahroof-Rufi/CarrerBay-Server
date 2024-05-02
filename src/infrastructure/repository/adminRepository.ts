import admin from "../../domain/admin";
import adminInterface from "../../use-case/interface/adminInterface";
import adminModel from "../data-base/adminModel";

class adminRepository implements adminInterface {

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