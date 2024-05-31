import Employer from "./employer";
import { User } from "./user";

export interface AdminOutput {
    status: number;
    message: string;
    accessToken?: string;
    refreshToken?: string;
    refreshTokenExpired?:boolean;
    users?: User[];
    updatedUser?: User;
    employers?: Employer[];
    updatedEmployer?: Employer;
}