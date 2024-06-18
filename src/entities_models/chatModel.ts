import { Schema, model } from "mongoose";
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
        required: true
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
    type: { type: String, enum: ['text', 'interview'], default: 'text' },
    interviewDetails: {
        interviewDate: { type: Date },
        interviewTime: String,
        status: { type: String, enum: ['scheduled', 'completed', 'canceled'] }
    }
})

const chatModel = model<Chat>('chat', chatSchema);

export default chatModel