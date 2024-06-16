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

    async addConnections(token: string, connection_id: string, isUser: boolean): Promise<ChatOutput> {
        const decodedToken = await this._jwt.verifyToken(token, "User")
        const connections = await this._chatRepo.addConnection(decodedToken?.id, connection_id, isUser)
        return {
            status:200,
            message:'Connections added successfully',
            connection: connections
        }
    }

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

    async saveMessage(token: string, receiver_id:string, content:string, profileType:string): Promise<ChatOutput> {
        const decodedToken = await this._jwt.verifyToken(token, "User")
        const message = await this._chatRepo.saveMessage(decodedToken?.id, receiver_id, content,profileType)
        if (message) {
            return {
                status: 200,
                message: 'message saved successfully',
            }
        } else {
            return {
                status: 400,
                message: 'something went wrong',
            }
        }
    }

}

export default ChatUseCase