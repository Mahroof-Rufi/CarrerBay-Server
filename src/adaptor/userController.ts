import { Request, Response, json } from "express";
import userUseCase from "../use-case/userUseCase";

class userController {

    constructor(private userUseCase: userUseCase) { }

    async signUp(req: Request, res: Response) {
        try {
            const userData = req.body
            const user = await this.userUseCase.signUp(userData)
            res.status(user.status).json(user.data)
        } catch (error) {
            console.error(error);

        }
    }

    async sendOTP(req:Request, res:Response) {
        try {
            const email = req.body.email
            const response = await this.userUseCase.sendOTP(email)
            res.status(response.status).json(response.data)                    
        } catch (error) {
            console.error(error); 
        }
    }

    async logIn(req: Request, res: Response) {
        
        try {
            const { email, password } = req.body
            const user = await this.userUseCase.logIn(email,password)
            if (user && user.token) {
                return res
                    .status(200)
                    .json({
                        user,
                });
            } else {
                return res
                    .status(400)
                    .json({
                        user,
                });
            }
        } catch (error) {
            console.error();
        }
    }

    async gAuth(req:Request, res:Response) {
        try {
            const { fullName, email, password, google_id } = req.body
            const user = await this.userUseCase.gAuth(fullName,email,password,google_id)
            if (user && user.token) {
                return res
                    .status(200)
                    .json({
                        user,
                });
            } else {
                return res
                    .status(400)
                    .json({
                        user,
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    async forgotPasswordSendOTP(req:Request, res:Response) {
        try {
            const email = req.body.email
            const user = await this.userUseCase.forgotpasswordSendOTP(email)
            res.status(user.status).json(user.message)
        } catch (error) {
            console.error(error);
        }
    }

    async resetPassword(req:Request, res:Response) {
        try {
            const { email, OTP, password } = req.body
            const data = await this.userUseCase.resetPassword(email, OTP, password)
            res.status(data.status).json(data.message)
        } catch (error) {
            console.error(error);            
        }
    }

    async fetchJobs(req:Request, res:Response) {
        try {
            const data = await this.userUseCase.fetchJobs()
            res.status(data.status).json({data:data.jobs})
        } catch (error) {
            console.error(error);            
        }
    }

}

export default userController