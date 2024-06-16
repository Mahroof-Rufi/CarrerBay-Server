import ChatUseCase from "../use-case/chatUseCase";
import { Request, Response } from "express";

class ChatController {

    constructor(
        private readonly _chatUseCase:ChatUseCase
    ) {}

    async addConnection(req:Request, res:Response) {
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

    async getMessagesByReceiverId(req:Request, res:Response) {
        const token = req.header('User-Token');
        const receiver_id = req.params.receiver_id        
        if (token) {
            const result = await this._chatUseCase.getMessagesByReceiverId(token,receiver_id)
            res.status(result.status).json({ message:result.message, chats:result.chats })
        }
    }

    async saveMessage(req:Request, res:Response) {
        const token = req.header('User-Token');
        const { receiver_id, content, profileType } = req.body
        if (token) {
            const result = await this._chatUseCase.saveMessage(token, receiver_id, content, profileType)
            res.status(result.status).json({ message:result.message })
        }
    }
}

export default ChatController