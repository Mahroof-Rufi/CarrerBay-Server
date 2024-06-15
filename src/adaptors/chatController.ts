import ChatUseCase from "../use-case/chatUseCase";
import { Request, Response } from "express";

class ChatController {

    constructor(
        private readonly _chatUseCase:ChatUseCase
    ) {}

    async getConnectedUsers(req:Request, res:Response) {
        const token = req.header('User-Token');
        if (token) {
            const result = await this._chatUseCase.getConnectedUsers(token)
            res.status(result.status).json({ message:result.message, connection:result.connection })
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
        const { receiver_id, content } = req.body
        if (token) {
            const result = await this._chatUseCase.saveMessage(token, receiver_id, content)
            res.status(result.status).json({ message:result.message })
        }
    }
}

export default ChatController