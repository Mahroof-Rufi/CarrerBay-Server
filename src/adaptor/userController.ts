import { Request, Response } from "express";
import userUseCase from "../use-case/userUseCase";

class userController {

    constructor(private userCase: userUseCase) { }

    async signUp(req: Request, res: Response) {
        try {
            const userData = req.body
            
            const user = await this.userCase.signUp(userData)
            res.status(user.status).json(user.data)
        } catch (error) {
            console.error(error);

        }
    }

    async sendOTP(req:Request, res:Response) {
        try {
            const email = req.body.email
            const response = await this.userCase.sendOTP(email)
            res.status(response.status).json(response.data)                    
        } catch (error) {
            console.error(error); 
        }
    }

    async logIn(req: Request, res: Response) {
        
        try {
            const { email, password } = req.body
            const user = await this.userCase.logIn(email,password)
            if (user && user.token) {
                return res
                    .cookie("userToken", user.token, {
                        httpOnly: true,
                        maxAge: 24 * 60 * 60 * 1000,
                    })
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

}

export default userController