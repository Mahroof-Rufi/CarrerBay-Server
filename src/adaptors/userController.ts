import { Education } from '../interfaces/models/subModels/education';
import { User } from '../interfaces/models/user';
import { Request, Response } from "express";
import userUseCase from "../use-case/userUseCase";
import { EditUser } from "../interfaces/models/user";
import cloudinary from "../providers/cloudinary";

class UserController {

    constructor(
        private readonly _userUseCase: userUseCase) { }

    async signUp(req: Request, res: Response) {
        try {
            const userData = req.body
            console.log(userData);
            
            const user = await this._userUseCase.signUp(userData)
            res.status(user.status).json(user.message)
        } catch (error) {
            console.error(error);

        }
    }

    async sendOTP(req:Request, res:Response) {
        try {
            const email = req.body.email
            const response = await this._userUseCase.sendOTP(email)
            res.status(response.status).json(response.message)                    
        } catch (error) {
            console.error(error); 
        }
    }

    async logIn(req: Request, res: Response) {
        
        try {
            const { email, password } = req.body
            const user = await this._userUseCase.logIn(email,password)
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
            const user = await this._userUseCase.gAuth(fullName,email,password,google_id)
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
            const user = await this._userUseCase.forgotPasswordSendOTP(email)
            res.status(user.status).json(user.message)
        } catch (error) {
            console.error(error);
        }
    }

    async resetPassword(req:Request, res:Response) {
        try {
            const { email, OTP, password } = req.body
            const data = await this._userUseCase.resetPassword(email, OTP, password)
            res.status(data.status).json(data.message)
        } catch (error) {
            console.error(error);            
        }
    }

    async loadUsers(req:Request, res:Response) {
        try {
            const result = await this._userUseCase.loadUsers()
            res.status(result.status).json({ message:result.message, data:result.users })
        } catch (error) {
            console.error(error);
        }
    }

    async fetchUserData(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            if (token) {
                const result = await this._userUseCase.fetchUserDataWithToken(token)
                res.status(result.status).json({message:result?.message, userData:result?.userData})
            }
        } catch (error) {
            console.error(error);            
        }
    }

    async updateUserProfile(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const newData:EditUser = req.body as Partial<EditUser>
            if (typeof newData.DOB == "string") {
                newData.DOB = this.convertTuiDayToDate(newData.DOB)
            }

            if (req.files) {
                const profile_pic = (req.files as { [fieldname: string]: Express.Multer.File[] })['profile-file']?.[0]
                const resume = (req.files as { [fieldname: string]: Express.Multer.File[] })['resume-file']?.[0]

                if (profile_pic) {
                    console.log('before profile upload')
                    const profileUpload = await cloudinary.uploader.upload(profile_pic.path);
                    newData.profile_url = profileUpload.secure_url;
                    console.log('after profile upload')
                }

                if (resume) {
                    console.log('before resume upload')
                    const resumeUpload = await cloudinary.uploader.upload(resume.path);
                    newData.resume_url = resumeUpload.secure_url;
                    console.log('after resume upload')
                }

            } 

            if (token) {
                const result = await this._userUseCase.updateUserProfile(newData, token)
                res.status(result.status).json({ updatedData:result.updatedData, message:result.message })
            }
        } catch (error) {
            console.error(error);            
        }
    }

    convertTuiDayToDate(dateString:string):Date {
        const [day, month, year] = dateString.split('.').map(Number);
        return new Date(year, month - 1, day);
    }

    async updateUserAbout(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const about = req.body.about;
            if (token) {
                const result = await this._userUseCase.updateUserAbout(token, about);
                res.status(result.status).json({ message:result.message, updatedData:result.updatedData });
            }
        } catch (error) {
            console.error(error);            
        }
    }

    async updateUserExperience(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const exp_id = req.body.exp_id
            const experience = req.body.exp
            if (token) {
                const result = await this._userUseCase.updateUserExperience(token, experience, exp_id)
                res.status(result.status).json({ message: result.message, updatedData:result.updatedData })
            }           
        } catch (error) {
            console.error(error);            
        }
    }

    async deleteUserExperience(req:Request, res:Response) {
        try {
            const exp_id = req.params.exp_id
            const token = req.header('User-Token');
            if (token) {
                const result = await this._userUseCase.deleteUserExperience(token, exp_id)
                res.status(result.status).json({ message:result.message, updatedData:result.newData })
            } else {
                res.status(400).json({ message:'Unauthorized user' })
            }
        } catch (error) {
            console.error(error);            
        }
    }

    async updateUserEducation(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const education_id = req.body.education_id
            const education = req.body.education
            
            if (token) {
                const result = await this._userUseCase.updateUserEducation(token, education, education_id)
                res.status(result.status).json({ updatedData:result.updatedData, message: result.message })
            }           
        } catch (error) {
            console.error(error);            
        }
    }

    async deleteUserEducation(req:Request, res:Response) {
        try {
            const edu_id = req.params.edu_id
            const token = req.header('User-Token');
            if (token) {
                const result = await this._userUseCase.deleteUserEducation(token, edu_id)
                res.status(result.status).json({ message:result.message, updatedData:result.newData })
            }
        } catch (error) {
            console.error(error);            
        }
    }

    async updateUserSkills(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const skills = req.body.skills
            
            if (token) {
                const result = await this._userUseCase.updateUserSkills(token, skills)
                res.status(result.status).json({ updatedData:result.updatedData, message: result.message }) 
            }          
        } catch (error) {
            console.error(error);            
        }
    }

    async changeEmailSendOTP(req:Request, res:Response) {
        try {
            const currentEmail = req.body.currentEmail
            const result = await this._userUseCase.sendOTPToCurrentEmail(currentEmail)
            res.status(result.status).json({ message:result.message })
        } catch (error) {
            console.error(error);            
        }
    }

    async updateEmail(req:Request, res:Response) {
        try {
            const currentEmail = req.body.currentEmail
            const currentEmailOTP = req.body.currentEmailOTP
            const newEmail = req.body.newEmail
            const newEmailOTP = req.body.newEmailOTP            
            
            const result = await this._userUseCase.updateCurrentEmail(currentEmail, currentEmailOTP, newEmail, newEmailOTP)
            res.status(result.status).json({ message:result.message })
        } catch (error) {
            console.error(error);            
        }
    }

}

export default UserController