import { User } from "./user";

export interface UserOutput {
    status:number,
    message:string,
    token?:string,
    userData?:User,
    users?:User[]
}