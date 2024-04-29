interface employer {
    id: string,
    companyName: string,
    email: string,
    password: string,
    industry: string,
    city: string,
    state: string,
    OTP?: number,
    is_Verfied: boolean
}

export default employer