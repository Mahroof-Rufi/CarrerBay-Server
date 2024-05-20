export interface user {
    password: string;
    _id: string,
    google_id: string,
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
    experiences?: experience[],
    educations?: education[],
    skills?: string[],
    OTP?: number,
    appliedJobs?: string[],
    isActive:boolean
}

export interface g_Auth_User {
    g_id:string,
    firstName: string,
    email:string,
}

export interface experience {
    _id?: string,
    jobTitle: string,
    companyName: string,
    jobType: string,
    startDate: Date,
    endDate?: Date,
    present: boolean,
    city?: string,
    state?: string,
    remort: boolean,
    overView: string,
    technologies: string[],
}

export interface education {
    universityName: string,
    city?: string,
    state?: string,
    distance: boolean,
    subject: string,
    startDate: Date,
    endDate?: Date,
    present: boolean
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
    experiences?: experience[],
    educations?: education[],
    skills?: string[],
}