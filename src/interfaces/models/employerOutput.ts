import Employer from "./employer";

export interface EmployerOutput {
    status:number,
    message:string,
    accessToken?:string ,
    refreshToken?:string,
    refreshTokenExpired?:boolean,
    employerData?:Employer | null,
    employers?:Employer[],
    oldProfileUrl?:string,
}