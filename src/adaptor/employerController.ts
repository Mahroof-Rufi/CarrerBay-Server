import { Request, Response } from "express";
import employerUseCase from "../use-case/employerUseCase";
import cloudinary from "../infrastructure/utils/cloudinary";

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
            console.log('data in ctrl');
            console.log(employerData);
            
            
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

    async fetchEmployerData(req:Request, res:Response) {
        try {
            const token = req.header('Employer-Token');
            if (token) {
                const result = await this.employerUseCase.fetchEmployerData(token)
                res.status(result?.status).json({data:result?.employerData, message:result.message})
            }
        } catch (error) {
            console.error(error);            
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
                    
                    
                    const result = await this.employerUseCase.updateProfile(newData)
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
                const data = await this.employerUseCase.updateProfile(newData)
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
            const result = await this.employerUseCase.updateEmailWithOTP(email, OTP, newEmail)
            res.status(result.status).json({message:result.message, data:result?.updatedData})
        } catch (error) {
            console.error(error); 
        }
    }

    async fetchJobs(req:Request, res:Response) {
        try {
            const token = req.header('Employer-Token');
            if(token) {
                const query = req.query.title
                const result = await this.employerUseCase.fetchJobs(token, query as string)
                res.status(result.status).json({jobs:result.jobs})
            }
        } catch (error) {
            console.error(error);            
        }
    }

    async postNewJob(req:Request, res:Response) {
        try {
            const jobData = {...req.body}
            const token = req.header('Employer-Token');
            if (token) {
                const response = await this.employerUseCase.addNewJobPost(jobData, token)
                res.status(response.status).json({message:response.message, data:response.job})
            }
        } catch (error) {
            console.error(error);            
        }
    }

    async editJob(req:Request, res:Response) {
        try {
            const jobData = { ...req.body };
            const jobId = req.params.id
            const response = await this.employerUseCase.editJobPost(jobId,jobData);
            res.status(response.status).json({message:response.message,updateJob:response.updatedJob})                  
        } catch (error) {
            console.error(error);            
        }
    }

    async deleteJob(req:Request, res:Response) {
        try {
            const jobId:string = req.params.id
            const response = await this.employerUseCase.deleteJob(jobId)
            res.status(response.status).json({message:response.message})
        } catch (error) {
            console.error(error);            
        }
    }

}

export default employerController