import ChatRepository from "../infrastructure/repositories/chatRepository";
import UserRepository from "../infrastructure/repositories/userRepository";
import IChatUseCase from "../interfaces/iUseCases/iChatUseCase";
import { Chat } from "../interfaces/models/chat";
import { ChatOutput } from "../interfaces/models/chatOutput";
import Jwt from "../providers/jwt";

class ChatUseCase implements IChatUseCase {

    constructor(
        private readonly _chatRepo:ChatRepository,
        private readonly _userRepo:UserRepository,
        private readonly _jwt:Jwt
    ) {}

    async addConnections(token: string, connection_id: string, isUser?: boolean): Promise<ChatOutput> {
        let decodedToken
        if (typeof isUser != undefined) {
            decodedToken = await this._jwt.verifyToken(token, "User")
        } else {
            decodedToken = await this._jwt.verifyToken(token, "Employer")
        }
        const connections = await this._chatRepo.addConnection(decodedToken?.id, connection_id, isUser)
        return {
            status:200,
            message:'Connections added successfully',
            connection: connections
        }
    }

    async getConnectedUsers(token: string): Promise<ChatOutput> {
        const decodedToken = await this._jwt.verifyToken(token, "User")
        const connectedUsers = await this._chatRepo.getConnectedUsers(decodedToken?.id, "User")
        return {
            status:200,
            message:'Connections found successfully',
            connection: connectedUsers
        }
    }

    async getUserMessagesByReceiverId(token: string, receiver_id:string): Promise<ChatOutput> {
        const decodedToken = await this._jwt.verifyToken(token, "User")
        const chats = await this._chatRepo.getMessagesByUserIdAndReceiverId(decodedToken?.id, receiver_id)
        return {
            status: 200,
            message: 'chats found successfully',
            chats: chats
        }
    }

    async saveMessage(token: string, receiver_id:string, content:string): Promise<ChatOutput> {
        const decodedToken = await this._jwt.verifyToken(token, "User")
        const message = await this._chatRepo.saveMessage(decodedToken?.id, receiver_id, content)
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

    async getEmployerConnections(token: string): Promise<ChatOutput> {
        const decodedToken = await this._jwt.verifyToken(token, "Employer")
        const connections = await this._chatRepo.getConnectedUsers(decodedToken?.id, "Employer")
        return {
            status:200,
            message:'Connections found successfully',
            connection: connections
        }
    }

    async fetchUserById(user_id: string): Promise<ChatOutput> {
        const userData = await this._userRepo.findById(user_id)
        if (userData) {
            return {
                status: 200,
                message: 'User found successfully',
                user: userData
            }
        } else {
            return {
                status: 400,
                message: 'User not found',
            }
        }
    }

    async getEmployerMessagesByReceiverId(token: string, receiver_id: string): Promise<ChatOutput> {
        const decodedToken = await this._jwt.verifyToken(token, "Employer")
        const chats = await this._chatRepo.getMessagesByUserIdAndReceiverId(decodedToken?.id, receiver_id)
        return {
            status: 200,
            message: 'chats found successfully',
            chats: chats
        }
    }

    async scheduleInterview(token: string, receiver_id: string, date: Date, time: string): Promise<ChatOutput> {
        const decodedToken = await this._jwt.verifyToken(token, "Employer")
        const scheduledInterview = await this._chatRepo.saveInterviewSchedule(decodedToken?.id, receiver_id, date, time)
        if (scheduledInterview) {
            return {
                status:200,
                message:'Interview scheduled successfully'
            } 
        } else {
            return {
                status:400,
                message:'Interview schedule failed'
            }
        }
    }

}

export default ChatUseCase