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
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async sendOTP(req:Request, res:Response) {
        try {
            const email = req.body.email
            const response = await this._userUseCase.sendOTP(email)
            res.status(response.status).json(response.message)                    
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' }) 
        }
    }

    async logIn(req: Request, res: Response) {
        
        try {
            const { email, password } = req.body
            const user = await this._userUseCase.logIn(email,password)
            if (user && user.accessToken && user.refreshToken) {
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

    async refreshToken(req:Request, res:Response) {
        try {            
            console.log('hwrw thw refre route');
            
            const token = req.body.refreshToken
            console.log('token here',token);
            
            if (token) {
                const result = await this._userUseCase.refreshToken(token)
                res.status(result.status).json({ message:result.message, accessToken:result.accessToken, refreshToken:result.refreshToken, refreshTokenExpired:result.refreshTokenExpired })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async googleRegister(req:Request, res:Response) {
        try {
            const { fistName, lastName, email, password, profile_url } = req.body
            const user = await this._userUseCase.googleRegister(fistName, lastName, email, password, profile_url)
            res.status(user.status as number).json({ user })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async forgotPasswordSendOTP(req:Request, res:Response) {
        try {
            const email = req.body.email
            const user = await this._userUseCase.forgotPasswordSendOTP(email)
            res.status(user.status).json(user.message)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async resetPassword(req:Request, res:Response) {
        try {
            const { email, OTP, password } = req.body
            const data = await this._userUseCase.resetPassword(email, OTP, password)
            res.status(data.status).json(data.message)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async loadUsers(req:Request, res:Response) {
        try {
            const pageNo = req.query.page || '1'
            const result = await this._userUseCase.loadUsers(pageNo as string)
            res.status(result.status).json({ message:result.message, data:result.users })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
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
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async fetchUserProfileById(req:Request, res:Response) {
        try {
            const user_id = req.body.user_id
            const result = await this._userUseCase.fetchUseProfileWithUserId(user_id)
            res.status(result.status).json({message:result?.message, userData:result?.userData})
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async fetchAllUsers(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const page = req.query.page || '1'
            const sort = req.query.sort
            const search = req.query.search
            
            const query: { [key: string]: any } = req.query;
            
            const filter: any = {};

            for (const key in query) {
                if (query.hasOwnProperty(key) && key !== 'page' && key !== 'sort' && key !== 'search') {
                    const value = query[key];
            
                    if (value.includes(',')) {
                        const valuesArray = value.split(',');
            
                        if (key === 'jobTitle') {
                            filter[key] = { $in: valuesArray.map((val:string) => new RegExp(val, 'i')) };
                        } else {
                            filter[key] = { $in: valuesArray };
                        }
                    } else {
                        if (key === 'jobTitle') {
                            filter[key] = new RegExp(value, 'i');
                        } else {
                            filter[key] = value;
                        }
                    }
                }
            }        

            if (token) {
                const result = await this._userUseCase.fetchUsersData(token, page as string, sort as string, search as string,filter)
                res.status(result.status).json({ message:result?.message, users:result?.users, totalNoOfUsers:result.totalNoOfUsers })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async fetchAllEmployers(req:Request, res:Response) {
        try {
            const page = req.query.page || '1'
            const sort = req.query.sort
            const search = req.query.search
            
            const query: { [key: string]: any } = req.query;
            console.log('empQ',query);
            
            const filter: any = {};

            for (const key in query) {
                if (query.hasOwnProperty(key) && key !== 'page' && key !== 'sort' && key !== 'search') {
                    const value = query[key];
            
                    if (value.includes(',')) {
                        const valuesArray = value.split(',');
            
                        if (key === 'industry') {
                            filter[key] = { $in: valuesArray.map((val:string) => new RegExp(val, 'i')) };
                        } else {
                            filter[key] = { $in: valuesArray };
                        }
                    } else {
                        if (key === 'industry') {
                            filter[key] = new RegExp(value, 'i');
                        } else {
                            filter[key] = value;
                        }
                    }
                }
            }    

            const result = await this._userUseCase.fetchEmployersData(page as string, sort as string, search as string, filter)
            res.status(result.status).json({message:result?.message, employers:result?.employers, totalEmployersCount:result.totalEmployersCount})
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async getScheduledInterviews(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            if (token) {
                const result = await this._userUseCase.getScheduledInterviews(token)
                res.status(result.status).json({ message:result.message, scheduledInterviews:result.scheduledInterviews })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async fetchEmployerProfileById(req:Request, res:Response) {
        try {
            const employer_id = req.body.employer_id
            const result = await this._userUseCase.fetchEmployerProfileById(employer_id)
            res.status(result?.status).json({ message:result.message, employerData:result?.employerData })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async isUserBlocked(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            if (token) {
                const result = await this._userUseCase.isUserBlockedOrNot(token)
                res.status(result.status).json({message:result?.message,})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
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
                    const resumeUpload = await cloudinary.uploader.upload(resume.path, { resource_type:'raw' });
                    newData.resume_url = resumeUpload.url;
                    console.log('after resume upload')
                }

            } 

            if (token) {
                const result = await this._userUseCase.updateUserProfile(newData, token)
                res.status(result.status).json({ updatedData:result.userData, message:result.message })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
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
                res.status(result.status).json({ message:result.message, updatedData:result.userData });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async updateUserExperience(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const exp_id = req.body.exp_id
            const experience = req.body.exp
            if (token) {
                const result = await this._userUseCase.updateUserExperience(token, experience, exp_id)
                res.status(result.status).json({ message: result.message, updatedData:result.userData })
            }           
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async deleteUserExperience(req:Request, res:Response) {
        try {
            const exp_id = req.params.exp_id
            const token = req.header('User-Token');
            if (token) {
                const result = await this._userUseCase.deleteUserExperience(token, exp_id)
                res.status(result.status).json({ message:result.message, updatedData:result.userData })
            } else {
                res.status(400).json({ message:'Unauthorized user' })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async updateUserEducation(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const education_id = req.body.education_id
            const education = req.body.education
            
            if (token) {
                const result = await this._userUseCase.updateUserEducation(token, education, education_id)
                res.status(result.status).json({ updatedData:result.userData, message: result.message })
            }           
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async deleteUserEducation(req:Request, res:Response) {
        try {
            const edu_id = req.params.edu_id
            const token = req.header('User-Token');
            if (token) {
                const result = await this._userUseCase.deleteUserEducation(token, edu_id)
                res.status(result.status).json({ message:result.message, updatedData:result.userData })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async updateUserSkills(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const skills = req.body.skills
            
            if (token) {
                const result = await this._userUseCase.updateUserSkills(token, skills)
                res.status(result.status).json({ updatedData:result.userData, message: result.message }) 
            }          
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async changeEmailSendOTP(req:Request, res:Response) {
        try {
            const currentEmail = req.body.currentEmail
            const result = await this._userUseCase.sendOTPToCurrentEmail(currentEmail)
            res.status(result.status).json({ message:result.message })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
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
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

}

export default UserController