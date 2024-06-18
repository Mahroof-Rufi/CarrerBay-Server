import { Chat } from "../models/chat";
import { ChatOutput } from "../models/chatOutput";

interface IChatUseCase {

    addConnections(token:string, connection_id: string, isUser?:boolean): Promise<ChatOutput>
    getConnectedUsers(token:string): Promise<ChatOutput>
    getUserMessagesByReceiverId(token:string, receiver_id:string): Promise<ChatOutput>
    saveMessage(token:string, receiver_id:string, content:string): Promise<ChatOutput>

    getEmployerConnections(token:string): Promise<ChatOutput>
    fetchUserById(user_id:string): Promise<ChatOutput>
    getEmployerMessagesByReceiverId(token:string, receiver_id:string): Promise<ChatOutput>

}

export default IChatUseCase