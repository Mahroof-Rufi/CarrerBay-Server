import { Schema, model } from "mongoose";
import { Chat } from "../interfaces/models/chat";

const chatSchema: Schema<Chat> = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt : {
        type: Date,
        default: Date.now
    }
})

const chatModel = model<Chat>('chat', chatSchema);

export default chatModel