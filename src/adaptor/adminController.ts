import { Request, Response } from "express";
import adminUseCase from "../use-case/adminUseCase";

class adminController {

    constructor(
        private adminUseCase:adminUseCase
    ) {}

    async login(req:Request, res:Response) {
        try {
            const { email, password } = req.body
            const admin = await this.adminUseCase.login(email,password)
            if (admin && admin.adminToken) {
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

    async loadUsers(req:Request, res:Response) {
        try {
            const result = await this.adminUseCase.loadUsers()
            res.status(result.status).json({ message:result.message, data:result.users })
        } catch (error) {
            console.error(error);
        }
    }

    async userAction(req:Request, res:Response) {
        try {
            const userId = req.body.user_id
            
            const result = await this.adminUseCase.userAction(userId)
            res.status(result.status).json({ message:result.message, updatedUser:result.updatedUser })
        } catch (error) {
            console.error(error);            
        }
    }

    async loadCompanies(req:Request, res:Response) {
        try {
            const result = await this.adminUseCase.loadCompanies()
            res.status(result.status).json({ message:result.message, data:result.employers })
        } catch (error) {
            console.error(error);
        }
    }

    async employerAction(req:Request, res:Response) {
        try {
            const employer_id = req.body.employer_id
            
            const result = await this.adminUseCase.employerAction(employer_id)
            res.status(result.status).json({ message:result.message, updatedEmployer:result.updatedEmployer })
        } catch (error) {
            console.error(error);            
        }
    }

}

export default adminController