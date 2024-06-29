import { Education } from "./subModels/education";
import { Experience } from "./subModels/experience";

export interface User {
    password: string;
    _id: string,
    firstName: string,
    lastName?: string,
    profile_url?: string,
    email: string,
    jobTitle: string,
    industry: string,
    DOB?: Date,
    gender: string,
    city?: string,
    state?: string,
    resume_url?: string,
    phone?: number,
    portfolio_url?: string,
    gitHub_url?: string,
    about?: string,
    experiences?: Experience[],
    educations?: Education[],
    skills?: string[],
    OTP?: number,
    appliedJobs?: string[],
    isActive:boolean,
    joinedAt:Date
}

export interface G_AuthUser {
    g_id:string,
    firstName: string,
    email:string,
}

export interface EditUser {
    firstName?: string,
    lastName?: string,
    profile_url?: string,
    jobTitle?: string,
    industry?: string,
    DOB?: Date,
    gender?: string,
    city?: string,
    state?: string,
    remort?: boolean,
    resume_url?: string,
    portfolio_url?: string,
    gitHub_url?: string,
    about?: string,
    experiences?: Experience[],
    educations?: Education[],
    skills?: string[],
}