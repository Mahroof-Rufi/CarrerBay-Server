import { Date, Schema } from "mongoose";
import { interviewDetails } from "./subModels/interviewDetails";

export interface Chat {
    _id?:string,
    sender: string | Schema.Types.ObjectId,
    receiver: string | Schema.Types.ObjectId,
    content: string,
    profileType: 'Users' | 'Employers',
    createdAt: Date,
    type: 'text' | 'interview',
    interviewDetails: interviewDetails
}