import { Date, Schema } from "mongoose";

export interface Chat {
    sender: string | Schema.Types.ObjectId,
    receiver: string | Schema.Types.ObjectId,
    content: string,
    createdAt: Date
}