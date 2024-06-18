import ChatUseCase from "../use-case/chatUseCase";
import { Request, Response } from "express";

class ChatController {

    constructor(
        private readonly _chatUseCase:ChatUseCase
    ) {}

    async addUserConnection(req:Request, res:Response) {
        const token = req.header('User-Token');
        const connection_id = req.body.connection_id
        const isUser = req.body.isUser
        if (token) {
            const result = await this._chatUseCase.addConnections(token, connection_id, isUser)
            res.status(result.status).json({ message:result.message, connections:result.connection })
        }
    }

    async getConnectedUsers(req:Request, res:Response) {
        const token = req.header('User-Token');
        if (token) {
            const result = await this._chatUseCase.getConnectedUsers(token)
            res.status(result.status).json({ message:result.message, connections:result.connection })
        }
    }

    async getUserMessagesByReceiverId(req:Request, res:Response) {
        const token = req.header('User-Token');
        const receiver_id = req.params.receiver_id        
        if (token) {
            const result = await this._chatUseCase.getUserMessagesByReceiverId(token,receiver_id)
            res.status(result.status).json({ message:result.message, chats:result.chats })
        }
    }

    async saveMessageByUser(req:Request, res:Response) {
        const token = req.header('User-Token');
        const { receiver_id, content } = req.body
        if (token) {
            const result = await this._chatUseCase.saveMessage(token, receiver_id, content)
            res.status(result.status).json({ message:result.message })
        }
    }

    async getEmployerConnections(req:Request, res:Response) {
        const token = req.header('Employer-Token');
        if (token) {
            const result = await this._chatUseCase.getConnectedUsers(token)
            res.status(result.status).json({ message:result.message, connections:result.connection })
        }
    }

    async getUserById(req:Request, res:Response) {
        const user_id = req.query.user_id
        const result = await this._chatUseCase.fetchUserById(user_id as string)
        res.status(result.status).json({ message:result.message, userData:result.user })
    }

    async getEmployerMessagesByReceiverId(req:Request, res:Response) {
        const token = req.header('Employer-Token');
        const receiver_id = req.params.receiver_id        
        if (token && receiver_id) {
            const result = await this._chatUseCase.getEmployerMessagesByReceiverId(token,receiver_id)
            res.status(result.status).json({ message:result.message, chats:result.chats })
        }
    }

    async saveMessageByEmployer(req:Request, res:Response) {
        const token = req.header('Employer-Token');
        const { receiver_id, content } = req.body
        if (token) {
            const result = await this._chatUseCase.saveMessage(token, receiver_id, content)
            res.status(result.status).json({ message:result.message })
        }
    }

    async addEmployerConnection(req:Request, res:Response) {
        const token = req.header('Employer-Token');
        const connection_id = req.body.connection_id
        if (token) {
            const result = await this._chatUseCase.addConnections(token, connection_id)
            res.status(result.status).json({ message:result.message, connections:result.connection })
        }
    }

}

export default ChatController