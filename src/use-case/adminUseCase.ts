import adminRepository from "../infrastructure/repositories/adminRepository";
import employerRepository from "../infrastructure/repositories/employerRepository";
import userRepository from "../infrastructure/repositories/userRepository";
import IAdminUseCase from "../interfaces/iUseCases/iAdminUseCase";
import Jwt from "../providers/jwt";

class AdminUseCase implements IAdminUseCase {

    constructor(
        private readonly _adminRepo:adminRepository,
        private readonly _userRepo:userRepository,
        private readonly _employerRepo:employerRepository,
        private readonly _jwt:Jwt
        ) {}

    async login(email:string, password:string) {
        const admin = await this._adminRepo.findByEmail(email)
        if (admin) {
            if (password !== admin.password) {
                return {
                    status: 400,
                    message: 'Invalid credentials'
                }
            }
            const token = this._jwt.createToken(admin.id, 'admin')
            return {
                status: 200,
                adminToken: token,
                message: 'Login successfully'
            }
        } else {
            return {
                status: 400,
                message: 'Data not found'
            }
        }
    }

    async fetchAllUsers() {
        const limit = 10
        const users = await this._userRepo.fetchAllUsers(limit)
        return {
            status:200,
            message:'Users found successfully',
            users:users
        }
    }

    async userAction(user_id:string) {
        const updatedUser = await this._userRepo.changeStatusById(user_id)
        if (!updatedUser) {
            return {
                status:400,
                message:'User not found'
            }
        }
        return {
            status:200,
            message:'User action successful',
            updatedUser:updatedUser
        }
    }

    async fetchAllEmployers() {
        const limit = 10
        const employers = await this._employerRepo.fetchAllEmployers(limit)
        return {
            status:200,
            message:'Employers found successfully',
            employers:employers
        }
    }

    async employerAction(employer_id:string) {
        const updatedEmployer = await this._employerRepo.changeStatusById(employer_id)
        if (!updatedEmployer) {
            return {
                status:400,
                message:'Employer not found'
            }
        }
        return {
            status:200,
            message:'Employer action successful',
            updatedEmployer:updatedEmployer
        }
    }

}

export default AdminUseCase