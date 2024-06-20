import mongoose, { Schema, model } from "mongoose";
import { Chat } from "../interfaces/models/chat";

const chatSchema: Schema<Chat> = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        required: true
    },
    content: {
        type: String,
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
    type: { type: String, enum: ['text', 'interview', 'URL'], default: 'text' },
    interviewDetails: {
        employer: { type:mongoose.Types.ObjectId, ref:'employer' },
        interviewDate: { type: Date },
        interviewTime: String,
        status: { type: String, enum: ['scheduled', 'completed', 'canceled'] }
    }
})

const chatModel = model<Chat>('chat', chatSchema);

export default chatModel