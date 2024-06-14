import ChatRepository from "../infrastructure/repositories/chatRepository";
import IChatUseCase from "../interfaces/iUseCases/iChatUseCase";
import { Chat } from "../interfaces/models/chat";
import { ChatOutput } from "../interfaces/models/chatOutput";
import Jwt from "../providers/jwt";

class ChatUseCase implements IChatUseCase {

    constructor(
        private readonly _chatRepo:ChatRepository,
        private readonly _jwt:Jwt
    ) {}

    async getConnectedUsers(token: string): Promise<ChatOutput> {
        const decodedToken = await this._jwt.verifyToken(token, "User")
        const connectedUsers = await this._chatRepo.getConnectedUsers(decodedToken?.id)
        return {
            status:200,
            message:'Connections found successfully',
            connection: connectedUsers
        }
    }

    async getMessagesByReceiverId(token: string, receiver_id:string): Promise<ChatOutput> {
        const decodedToken = await this._jwt.verifyToken(token, "User")
        const chats = await this._chatRepo.getMessagesByUserIdAndReceiverId(decodedToken?.id, receiver_id)
        return {
            status: 200,
            message: 'chats found successfully',
            chats: chats
        }
    }

}

export default ChatUseCase