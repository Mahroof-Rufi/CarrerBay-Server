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
            res.status(response.status).json(response.message)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async register(req: Request, res: Response) {
        try {
            const employerData = req.body            
            
            const result = await this._employerUseCase.register(employerData)
            res.status(result.status).json(result.message)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async logIn(req: Request, res: Response) {
        try {
            console.log('emp login');
            
            const { email, password } = req.body
            const employer = await this._employerUseCase.login(email, password)
            console.log(employer);
            
            if (employer && employer.accessToken && employer.refreshToken) {
                
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
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async refreshToken(req:Request, res:Response) {
        try {            
            const token = req.body.refreshToken
            
            if (token) {
                const result = await this._employerUseCase.refreshToken(token)
                res.status(result.status).json({ message:result.message, accessToken:result.accessToken, refreshToken:result.refreshToken, refreshTokenExpired:result.refreshTokenExpired })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })        
        }
    }

    async loadCompanies(req:Request, res:Response) {
        try {
            const result = await this._employerUseCase.loadCompanies()
            res.status(result.status).json({ message:result.message, data:result.employers })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
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
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async forgotPasswordSendOTP(req:Request, res:Response) {
        try {
            const email = req.body.email
            const result = await this._employerUseCase.forgotPasswordSendOTP(email)
            res.status(result.status).json(result.message)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async resetPassword(req:Request, res:Response) {
        try {
            const { email, OTP, password } = req.body
            const data = await this._employerUseCase.resetPassword(email, OTP, password)
            res.status(data.status).json(data.message)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async updateProfile(req:Request, res:Response) {
        try {
            if (req.file) {        
                console.log('before upload');
                const data = await cloudinary.uploader.upload(req.file?.path)
                console.log('after upload');
                
                if (data.url) {
                    const newData = { ...req.body, profile_url: data.url };                    
                    
                    const result = await this._employerUseCase.updateProfile(newData)                   
                    
                    if (result.oldProfileUrl) {
                        console.log('before destroy');
                        await cloudinary.uploader.destroy(result.oldProfileUrl)
                        console.log('after destroy');
                    }
                    res.status(result.status).json({ message: result.message, updatedData: result.employerData });           
                } else {                    
                    throw new Error('Unable to get Cloudinary URL');
                }
            } else {
                const newData = {...req.body}                
                const data = await this._employerUseCase.updateProfile(newData)
                
                res.status(data.status).json({ updatedData: data.employerData, message: data.message });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async updateEmailWithOTP(req:Request, res:Response) {
        try {
            const { email, OTP, newEmail } = req.body
            const result = await this._employerUseCase.updateEmailWithOTP(email, OTP, newEmail)
            res.status(result.status).json({message:result.message, data:result?.EmployerData})
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' }) 
        }
    }

}

export default EmployerController