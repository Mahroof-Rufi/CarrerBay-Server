import Employer from "./employer";
import { User } from "./user";

export interface AdminOutput {
    status: number;
    message: string;
    adminToken?: string;
    users?: User[];
    updatedUser?: User;
    employers?: Employer[];
    updatedEmployer?: Employer;
}