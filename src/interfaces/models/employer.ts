interface Employer {
    _id: string,
    companyName: string,
    profile_url: string,
    email: string,
    phone: string
    password: string,
    industry: string,
    city: string,
    state: string,
    noOfWorkersRange?: string,
    OTP?: number,
    web_url?: string,
    instagram_url?: string,
    X_url?: string,
    about?: string,
    verificationDocument?: string,
    isVerified: boolean,
    isActive: boolean,
    joinedAt?: Date 
}

export default Employer