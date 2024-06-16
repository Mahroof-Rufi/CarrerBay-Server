import { Chat } from "../models/chat";
import { ChatOutput } from "../models/chatOutput";

interface IChatUseCase {

    addConnections(token:string, connection_id: string, isUser:boolean): Promise<ChatOutput>
    getConnectedUsers(token:string): Promise<ChatOutput>
    getMessagesByReceiverId(token:string, receiver_id:string): Promise<ChatOutput>
    saveMessage(token:string, receiver_id:string, content:string): Promise<ChatOutput>

}

export default IChatUseCase