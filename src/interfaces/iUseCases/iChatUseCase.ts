import { Chat } from "../models/chat";
import { ChatOutput } from "../models/chatOutput";

interface IChatUseCase {

    getConnectedUsers(token:string): Promise<ChatOutput>
    getMessagesByReceiverId(token:string, receiver_id:string): Promise<ChatOutput>

}

export default IChatUseCase