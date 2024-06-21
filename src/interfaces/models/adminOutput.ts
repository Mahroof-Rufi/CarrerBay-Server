import Employer from "./employer";
import Job from "./job";
import { User } from "./user";

export interface AdminOutput {
    status: number;
    message: string;
    accessToken?: string;
    refreshToken?: string;
    refreshTokenExpired?:boolean;
    users?: User[];
    updatedUser?: User;
    employers?: Employer[];
    updatedEmployer?: Employer;
    updatedJob?: Job;
}