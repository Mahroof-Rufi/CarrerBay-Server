import adminRepository from "../infrastructure/repository/adminRepository";
import employerRepository from "../infrastructure/repository/employerRepository";
import userRepository from "../infrastructure/repository/userRepository";
import Jwt from "../infrastructure/utils/jwt";

class adminUseCase {

    constructor(
        private adminRepo:adminRepository,
        private userRepo:userRepository,
        private employerRepo:employerRepository,
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

    async loadUsers() {
        const users = await this.userRepo.fetchAllUsers()
        return {
            status:200,
            message:'Users found successfully',
            users:users
        }
    }

    async userAction(user_id:string) {
        const updatedUser = await this.userRepo.changeStatusById(user_id)
        if (!updatedUser) {
            return {
                status:400,
                message:'User not found'
            }
        }
        return {
            status:200,
            message:'User action succesfull',
            updatedUser:updatedUser
        }
    }

    async loadCompanies() {
        const employers = await this.employerRepo.fetchAllEmployers()
        if (!employers) {
            return {
                status:400,
                message:'Employers not found'
            }
        }
        return {
            status:200,
            message:'Employers found successfully',
            employers:employers
        }
    }

    async employerAction(employer_id:string) {
        const updatedEmployer = await this.employerRepo.changeStatusById(employer_id)
        if (!updatedEmployer) {
            return {
                status:400,
                message:'Employer not found'
            }
        }
        return {
            status:200,
            message:'Employer action succesfull',
            updatedEmployer:updatedEmployer
        }
    }

}

export default adminUseCase