import adminRepository from "../infrastructure/repositories/adminRepository";
import employerRepository from "../infrastructure/repositories/employerRepository";
import userRepository from "../infrastructure/repositories/userRepository";
import IAdminUseCase from "../interfaces/iUseCases/iAdminUseCase";
import { AdminOutput } from "../interfaces/models/adminOutput";
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
            const accessToken = this._jwt.createAccessToken(admin.id, 'admin')
            const refreshToken = this._jwt.createRefreshToken(admin.id, 'admin')
            return {
                status: 200,
                accessToken: accessToken,
                refreshToken: refreshToken,
                message: 'Login successfully'
            }
        } else {
            return {
                status: 400,
                message: 'Data not found'
            }
        }
    }

    async refreshToken(refreshToken: string): Promise<AdminOutput> {
        const decodedToken = await this._jwt.verifyRefreshToken(refreshToken)
        if (decodedToken?.id && decodedToken?.role) {
            const newAccessToken = await this._jwt.createAccessToken(decodedToken?.id,decodedToken?.role)
            const newRefreshToken = await this._jwt.createRefreshToken(decodedToken?.id, decodedToken?.role)
            return {
                status:200,
                message:'Token updated successfully',
                accessToken:newAccessToken,
                refreshToken:newRefreshToken,
            }
        } else {
            return {
                status:401,
                message:'Refresh token expired',
                refreshTokenExpired: true,
            }
        }
    }

    async fetchAllUsers(pageNo:number, sort:string, search:string, filter:any) {
        const limit = 10
        const skip = (pageNo - 1) * limit;
        const users = await this._userRepo.fetchAllUsers(skip, limit, '' ,sort, filter, search)
        const totalUsersCount = await this._userRepo.fetchUsersCount('',filter)
        
        return {
            status:200,
            message:'Users found successfully',
            users:users,
            totalUsersCount:totalUsersCount
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

    async fetchAllEmployers(pageNo:number, sort:string, search:string, filter?:any) {
        const limit = 10
        const skip = (pageNo - 1) * limit;
        const employers = await this._employerRepo.fetchAllEmployers(skip, limit, '',sort, search,filter)
        const totalEmployersCount = await this._employerRepo.FetchEmployersCount(filter)
        return {
            status:200,
            message:'Employers found successfully',
            employers:employers,
            totalEmployersCount:totalEmployersCount
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