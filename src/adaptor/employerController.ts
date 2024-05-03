import { Request, Response } from "express";
import employerUseCase from "../use-case/employerUseCase";

class employerController {

    constructor(private employerUseCase: employerUseCase) { }

    async sendOTP(req: Request, res: Response) {
        try {
            const response = await this.employerUseCase.sendOTP(req.body.email)
            res.status(response.status).json(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    async register(req: Request, res: Response) {
        try {
            const employerData = req.body
            const emplyer = await this.employerUseCase.register(employerData)
            res.status(emplyer.status).json(emplyer.data)
        } catch (error) {
            console.error(error);
        }
    }

    async logIn(req: Request, res: Response) {

        try {
            const { email, password } = req.body
            const employer = await this.employerUseCase.login(email, password)
            if (employer && employer.token) {
                return res
                    .status(200)
                    .json({
                        employer,
                    });
            } else {
                return res
                    .status(400)
                    .json({
                        employer,
                    });
            }
        } catch (error) {
            console.error();
        }
    }

    async forgotPasswordSendOTP(req:Request, res:Response) {
        try {
            const email = req.body.email
            const reslt = await this.employerUseCase.forgotpasswordSendOTP(email)
            res.status(reslt.status).json(reslt.message)
        } catch (error) {
            console.error(error);
        }
    }

    async resetPassword(req:Request, res:Response) {
        try {
            const { email, OTP, password } = req.body
            const data = await this.employerUseCase.resetPassword(email, OTP, password)
            res.status(data.status).json(data.message)
        } catch (error) {
            console.error(error);            
        }
    }

}

export default employerController