import adminRepository from "../infrastructure/repository/adminRepository";
import Jwt from "../infrastructure/utils/jwt";

class adminUseCase {

    constructor(
        private adminRepo:adminRepository,
        private jwt:Jwt
        ) {}

    async login(email:string, password:string) {
        const admin = await this.adminRepo.findByEmail(email)
        if (admin) {
            if (password !== admin.password) {
                return {
                    status: 400,
                    message: 'Invalid credentials'
                }
            }
            const token = this.jwt.createToken(admin.id, 'admin')
            return {
                status: 200,
                adminToken: token,
                userDate: admin,
                message: 'Login successfully'
            }
        } else {
            return {
                status: 400,
                message: 'Data not found'
            }
        }
    }

}

export default adminUseCase