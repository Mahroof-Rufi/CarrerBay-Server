import Employer from "./employer";

export interface EmployerOutput {
    status:number,
    message:string,
    token?:string ,
    employerData?:Employer | null,
    employers?:Employer[],
    oldProfileUrl?:string,
}