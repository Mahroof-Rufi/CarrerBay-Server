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
            // const result = await this.adminUseCase.login(email,password)
        } catch (error) {
            console.error(error);
        }
    }

}

export default adminController