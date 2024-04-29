import { Request, Response } from "express";
import adminUseCase from "../use-case/adminUseCase";

class adminController {

    constructor(private adminUseCase:adminUseCase) {}

    async login(req:Request, res:Response) {
        try {
            const { email, password } = req.body
            const admin = await this.adminUseCase.login(email,password)
            if (admin && admin.token) {
                return res
                    .cookie("admiToken", admin.token, {
                        httpOnly: true,
                        maxAge: 24 * 60 * 60 * 1000,
                    })
                    .status(200)
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

}

export default adminController