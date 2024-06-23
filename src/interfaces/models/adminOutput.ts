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
    employer?: Employer;
    employers?: Employer[];
    updatedEmployer?: Employer;
    updatedJob?: Job;
    userStats?: number[];
    employerStats?: number[];
    jobsStats?: number[];
    appliedJobsStats?: number[];
    hiringStats?: number[];
    totalNoOfUsers?: number;
    totalNoOfEmployers?: number;
    totalNoOfJobs?: number;
    totalNoOfAppliedJobs?: number;
}