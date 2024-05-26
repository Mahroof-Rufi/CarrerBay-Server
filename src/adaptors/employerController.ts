import { Request, Response } from "express";
import employerUseCase from "../use-case/employerUseCase";
import cloudinary from "../providers/cloudinary";

class EmployerController {

    constructor(
        private readonly _employerUseCase: employerUseCase
    ) { }

    async sendOTP(req: Request, res: Response) {
        try {
            const email = req.body.email
            const response = await this._employerUseCase.sendOTP(email)
            res.status(response.status).json(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    async register(req: Request, res: Response) {
        try {
            const employerData = req.body            
            
            const result = await this._employerUseCase.register(employerData)
            res.status(result.status).json(result.data)
        } catch (error) {
            console.error(error);
        }
    }

    async logIn(req: Request, res: Response) {
        try {
            console.log('emp login');
            
            const { email, password } = req.body
            const employer = await this._employerUseCase.login(email, password)
            console.log(employer);
            
            if (employer && employer.token) {
                console.log('if');
                
                return res
                    .status(200)
                    .json({
                        employer,
                    });
            } else {
                console.log('else');
                
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

    async loadCompanies(req:Request, res:Response) {
        try {
            const result = await this._employerUseCase.loadCompanies()
            res.status(result.status).json({ message:result.message, data:result.employers })
        } catch (error) {
            console.error(error);
        }
    }

    async fetchEmployerData(req:Request, res:Response) {
        try {
            const token = req.header('Employer-Token');
            if (token) {
                const result = await this._employerUseCase.fetchEmployerData(token)
                res.status(result?.status).json({ message:result.message, employerData:result?.employerData })
            }
        } catch (error) {
            console.error(error);            
        }
    }

    async forgotPasswordSendOTP(req:Request, res:Response) {
        try {
            const email = req.body.email
            const reslt = await this._employerUseCase.forgotpasswordSendOTP(email)
            res.status(reslt.status).json(reslt.message)
        } catch (error) {
            console.error(error);
        }
    }

    async resetPassword(req:Request, res:Response) {
        try {
            const { email, OTP, password } = req.body
            const data = await this._employerUseCase.resetPassword(email, OTP, password)
            res.status(data.status).json(data.message)
        } catch (error) {
            console.error(error);            
        }
    }

    async updateProfile(req:Request, res:Response) {
        try {
            if (req.file) {        
                console.log('brfore cloud');
                const data = await cloudinary.uploader.upload(req.file?.path)
                console.log('after cloud');
                
                if (data.url) {
                    const newData = { ...req.body, profile_url: data.url };
                    console.log('data');
                    console.log(newData);
                    
                    
                    const result = await this._employerUseCase.updateProfile(newData)
                    console.log('result');
                    console.log(result);
                    
                    
                    
                    if (result.oldProfileUrl) {
                        console.log('before distroy');
                        
                        await cloudinary.uploader.destroy(result.oldProfileUrl)
                        console.log('after destroy');
                        
                    }
                    res.status(result.status).json({ updatedData: result.updatedData, message: result.message });           
                } else {                    
                    throw new Error('Unable to get Cloudinary URL');
                }
            } else {
                const newData = {...req.body}                
                const data = await this._employerUseCase.updateProfile(newData)
                console.log(data.updatedData);
                
                res.status(data.status).json({ updatedData: data.updatedData, message: data.message });
            }
        } catch (error) {
            console.error(error);
        }
    }

    async updateEmailWithOTP(req:Request, res:Response) {
        try {
            const { email, OTP, newEmail } = req.body
            const result = await this._employerUseCase.updateEmailWithOTP(email, OTP, newEmail)
            res.status(result.status).json({message:result.message, data:result?.updatedData})
        } catch (error) {
            console.error(error); 
        }
    }

}

export default EmployerController