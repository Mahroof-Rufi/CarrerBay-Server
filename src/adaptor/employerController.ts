import { Request, Response } from "express";
import employerUseCase from "../use-case/employerUseCase";

class employerController {

    constructor(private useCase: employerUseCase) { }

    async sendOTP(req: Request, res: Response) {
        try {
            const response = await this.useCase.sendOTP(req.body.email)
            res.status(response.status).json(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    async register(req: Request, res: Response) {
        try {
            const employerData = req.body
            const emplyer = await this.useCase.register(employerData)
            res.status(emplyer.status).json(emplyer.data)
        } catch (error) {
            console.error(error);
        }
    }

    async logIn(req: Request, res: Response) {

        try {
            const { email, password } = req.body
            const employer = await this.useCase.login(email, password)
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

}

export default employerController