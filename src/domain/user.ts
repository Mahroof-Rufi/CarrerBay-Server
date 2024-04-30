interface user {
    id: string,
    firstName: string,
    lastName?: string,
    email: string,
    password: string,
    jobTitle?: string,
    industry?: string,
    DOB?: Date,
    gender?: string,
    OTP?: number,
    google_id?: string
}

export default user