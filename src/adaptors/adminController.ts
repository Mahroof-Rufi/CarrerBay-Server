import { Request, Response } from "express";
import adminUseCase from "../use-case/adminUseCase";

class AdminController {

    constructor(
        private readonly _adminUseCase:adminUseCase
    ) {}

    async login(req:Request, res:Response) {
        try {
            const { email, password } = req.body
            const admin = await this._adminUseCase.login(email,password)
            if (admin && admin.accessToken && admin.refreshToken) {
                return res.status(200)
                    .json({
                        admin,
                });
            } else {
                return res
                    .status(400)
                    .json({
                        admin,
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    async refreshToken(req:Request, res:Response) {
        try {            
            const token = req.body.refreshToken
            
            if (token) {
                const result = await this._adminUseCase.refreshToken(token)
                res.status(result.status).json({ message:result.message, accessToken:result.accessToken, refreshToken:result.refreshToken, refreshTokenExpired:result.refreshTokenExpired })
            }
        } catch (error) {
            console.error(error);            
        }
    }

    async fetchAllUsers(req:Request, res:Response) {
        try {
            const result = await this._adminUseCase.fetchAllUsers()
            res.status(result.status).json({ message:result.message, users:result.users })
        } catch (error) {
            console.error(error);            
        }
    }

    async userAction(req:Request, res:Response) {
        try {
            const userId = req.body.user_id
            const result = await this._adminUseCase.userAction(userId)
            res.status(result.status).json({ message:result.message, updatedUser:result.updatedUser })
        } catch (error) {
            console.error(error);            
        }
    }

    async fetchAllEmployers(req:Request, res:Response) {
        try {
            const result = await this._adminUseCase.fetchAllEmployers()
            res.status(result.status).json({ message:result.message, employers:result.employers })
        } catch (error) {
            console.error(error);            
        }
    }

    async employerAction(req:Request, res:Response) {
        try {
            const employer_id = req.body.employer_id
            
            const result = await this._adminUseCase.employerAction(employer_id)
            res.status(result.status).json({ message:result.message, updatedEmployer:result.updatedEmployer })
        } catch (error) {
            console.error(error);            
        }
    }

}

export default AdminController