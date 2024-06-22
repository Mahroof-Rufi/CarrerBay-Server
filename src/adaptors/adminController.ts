import { Request, Response } from "express";
import adminUseCase from "../use-case/adminUseCase";

class AdminController {

    constructor(
        private readonly _adminUseCase:adminUseCase
    ) {}

    async login(req:Request, res:Response) {
        try {
            const { email, password } = req.body
            const admin = await this._adminUseCase.login(email,password)
            if (admin && admin.accessToken && admin.refreshToken) {
                return res.status(200)
                    .json({
                        admin,
                });
            } else {
                return res
                    .status(400)
                    .json({
                        admin,
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
                const result = await this._adminUseCase.refreshToken(token)
                res.status(result.status).json({ message:result.message, accessToken:result.accessToken, refreshToken:result.refreshToken, refreshTokenExpired:result.refreshTokenExpired })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async fetchDashBoardStatistics(req:Request, res:Response) {
        try {
            const startDate = req.query.startDate
            const endDate = req.query.endDate

            const result = await this._adminUseCase.getDashboardStatistics(startDate as string ,endDate as string)
            res.status(result.status).json({
                message:result.message, 
                userStats:result.userStats, 
                employerStats:result.employerStats, 
                jobStats:result.jobsStats, 
                jobApplicationStats:result.appliedJobsStats, 
                hiringStats:result.hiringStats,
                totalNoOfUsers:result.totalNoOfUsers,
                totalNoOfEmployers:result.totalNoOfEmployers,
                totalNoOfJobs:result.totalNoOfJobs,
                totalNoOfAppliedJobs:result.totalNoOfAppliedJobs
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async fetchAllUsers(req:Request, res:Response) {
        try {
            const page = req.query.page || 1
            const sort = req.query.sort
            const search = req.query.search

            const queries: { [key: string]: any } = req.query;

            const filter: any = {};

            for (const key in queries) {
                if (queries.hasOwnProperty(key) && key !== 'page' && key !== 'sort' && key !== 'search') {
                    const value = queries[key];
            
                    if (value.includes(',')) {
                        const valuesArray = value.split(',');
            
                        if (valuesArray.every((v: any) => v === 'true' || v === 'false')) {
                            filter[key] = { $in: valuesArray.map((v: any) => v === 'true') };
                        } else {
                            if (key === 'jobTitle') {
                                const regexArray = valuesArray.map((v: any) => new RegExp(v, 'i'));
                                filter.$or = regexArray.map((regex: RegExp) => ({ jobTitle: regex }));
                            } else {
                                filter[key] = { $in: valuesArray };
                            }
                        }
                    } else if (value === 'true' || value === 'false') {
                        filter[key] = value === 'true';
                    } else if (key === 'jobTitle') {
                        const regex = new RegExp(value, 'i');
                        filter[key] = regex;
                    } else {
                        filter[key] = value;
                    }
                }
            }           

            const result = await this._adminUseCase.fetchAllUsers(page as number, sort as string, search as string, filter)
            res.status(result.status).json({ message:result.message, users:result.users, totalUsersCount:result.totalUsersCount })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async userAction(req:Request, res:Response) {
        try {
            const userId = req.body.user_id
            const result = await this._adminUseCase.userAction(userId)
            res.status(result.status).json({ message:result.message, updatedUser:result.updatedUser })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async fetchUserById(req:Request, res:Response) {
        try {
            const user_id = req.query.user_id
            const result = await this._adminUseCase.fetchUserByUserId(user_id as string)
            res.status(result.status).json({ message:result.message, userData:result.userData })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async fetchAllEmployers(req:Request, res:Response) {
        try {
            const page = req.query.page || 1
            const sort = req.query.sort
            const search = req.query.search
            const queries: { [key: string]: any } = req.query;

            const filter: any = {};

            for (const key in queries) {
                if (queries.hasOwnProperty(key) && key !== 'page' && key !== 'sort' && key !== 'search') {
                    const value = queries[key];
            
                    if (value.includes(',')) {
                        const valuesArray = value.split(',');
            
                        if (valuesArray.every((v: any) => v === 'true' || v === 'false')) {
                            filter[key] = { $in: valuesArray.map((v: any) => v === 'true') };
                        } else {
                            if (key === 'industry') {
                                const regexArray = valuesArray.map((v: any) => new RegExp(v, 'i'));
                                filter.$or = regexArray.map((regex: RegExp) => ({ industry: regex }));
                            } else {
                                filter[key] = { $in: valuesArray };
                            }
                        }
                    } else if (value === 'true' || value === 'false') {
                        filter[key] = value === 'true';
                    } else if (key === 'industry') {
                        const regex = new RegExp(value, 'i');
                        filter[key] = regex;
                    } else {
                        filter[key] = value;
                    }
                }
            }                      
            

            const result = await this._adminUseCase.fetchAllEmployers(page as number, sort as string, search as string,filter)
            res.status(result.status).json({ message:result.message, employers:result.employers, totalUsersCount:result.totalEmployersCount })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })           
        }
    }

    async fetchEmployerById(req:Request, res:Response) {
        try {
            const employer_id = req.query.employer_id
            const result = await this._adminUseCase.fetchEmployerById(employer_id as string)
            res.status(result.status).json({ message:result.message, employerData:result.employerData })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async employerAction(req:Request, res:Response) {
        try {
            const employer_id = req.body.employer_id
            
            const result = await this._adminUseCase.employerAction(employer_id)
            res.status(result.status).json({ message:result.message, updatedEmployer:result.updatedEmployer })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async fetchAllJobs(req:Request, res:Response) {
        try {
            const page = req.query.page || 1
            const sort = req.query.sort
            const search = req.query.search
            const queries: { [key: string]: any } = req.query;

            const filter: any = {};

            for (const key in queries) {
                if (queries.hasOwnProperty(key) && key !== 'page' && key !== 'sort' && key !== 'search') {
                    const value = queries[key];
            
                    if (value.includes(',')) {
                        const valuesArray = value.split(',');
            
                        if (valuesArray.every((v: any) => v === 'true' || v === 'false')) {
                            filter[key] = { $in: valuesArray.map((v: any) => v === 'true') };
                        } else {
                            if (key === 'industry') {
                                const regexArray = valuesArray.map((v: any) => new RegExp(v, 'i'));
                                filter.$or = regexArray.map((regex: RegExp) => ({ industry: regex }));
                            } else {
                                filter[key] = { $in: valuesArray };
                            }
                        }
                    } else if (value === 'true' || value === 'false') {
                        filter[key] = value === 'true';
                    } else if (key === 'industry') {
                        const regex = new RegExp(value, 'i');
                        filter[key] = regex;
                    } else {
                        filter[key] = value;
                    }
                }
            }                      
            

            const result = await this._adminUseCase.fetchAllJobs(page as number, sort as string, search as string,filter)
            res.status(result.status).json({ message:result.message, jobs:result.jobs, totalJobsCount:result.totalJobsCount })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })           
        }
    }

    async jobAction(req:Request, res:Response) {
        try {
            const job_id = req.body.job_id
            
            const result = await this._adminUseCase.jobAction(job_id)
            res.status(result.status).json({ message:result.message, updatedJob:result.updatedJob })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

}

export default AdminController