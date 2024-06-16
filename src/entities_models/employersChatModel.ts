import { Schema, model } from "mongoose";
import { Chat } from "../interfaces/models/chat";

const employersChatSchema: Schema<Chat> = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'employer',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'employer',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    profileType: {
        type: String,
        required: true
    },
    createdAt : {
        type: Date,
        default: Date.now
    }
})

const chatModel = model<Chat>('users_chats', usersChatSchema);

export default chatModel