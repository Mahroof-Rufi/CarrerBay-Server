import { Request, Response } from "express";
import userUseCase from "../use-case/userUseCase";

class userController {

    constructor(private userCase: userUseCase) {}

    async signIn(req:Request, res:Response) {
        try {
            const user = await this.userCase.logIn(req.body)
            res.status(user.status).json(user.data)
        } catch (error) {
            console.error();
        }
    }

}

export default userController