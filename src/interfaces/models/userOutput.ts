import { Chat } from "./chat";
import Employer from "./employer";
import { User } from "./user";

export interface UserOutput {
    status:number,
    message:string,
    token?:string,
    userData?:User,
    users?:User[],
    employers?:Employer[],
    accessToken?:string,
    refreshToken?:string,
    refreshTokenExpired?:boolean,
    totalEmployersCount?:number,
    scheduledInterviews?:Chat[]
}