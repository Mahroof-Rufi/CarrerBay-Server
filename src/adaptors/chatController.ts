import cloudinary from "../providers/cloudinary";
import ChatUseCase from "../use-case/chatUseCase";
import { Request, Response } from "express";

class ChatController {

    constructor(
        private readonly _chatUseCase:ChatUseCase
    ) {}

    async addUserConnection(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const connection_id = req.body.connection_id
            const isUser = req.body.isUser
            if (token) {
                const result = await this._chatUseCase.addConnections(token, connection_id, isUser)
                res.status(result.status).json({ message:result.message, connections:result.connection })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' }) 
        }
    }

    async getConnectedUsers(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            if (token) {
                const result = await this._chatUseCase.getConnectedUsers(token)
                res.status(result.status).json({ message:result.message, connections:result.connection })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' }) 
        }
    }

    async getUserMessagesByReceiverId(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const receiver_id = req.params.receiver_id        
            if (token) {
                const result = await this._chatUseCase.getUserMessagesByReceiverId(token,receiver_id)
                res.status(result.status).json({ message:result.message, chats:result.chats })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' }) 
        }
    }

    async saveMessageByUser(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const messageData = req.body
            if (typeof messageData.type == 'undefined') messageData.type = 'text'
            if (token) {
                const result = await this._chatUseCase.saveMessageByUser(token, messageData)
                res.status(result.status).json({ message:result.message, messageId:result.chat?._id })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' }) 
        }
    }

    async saveMediaFileByUser(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            
            const messageData = req.body

            if (req.file) {
                const mediaFileUpload = await cloudinary.uploader.upload(req.file.path, { resource_type:'auto' });
                messageData.isMediaFile = true

                const { resource_type, format, mime_type, url } = mediaFileUpload;
                if (resource_type === 'raw' || format == 'pdf') {
                    messageData.type = 'raw';
                } else {
                    messageData.type = mediaFileUpload.resource_type;
                }

                messageData.content = mediaFileUpload.url
            }
            
            if (token) {
                const result = await this._chatUseCase.saveMessageByUser(token, messageData)
                res.status(result.status).json({ message:result.message, mediaFileMessage:result.chat })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' }) 
        }
    }

    async getEmployerConnections(req:Request, res:Response) {
        try {
            const token = req.header('Employer-Token');
            if (token) {
                const result = await this._chatUseCase.getConnectedUsers(token)
                res.status(result.status).json({ message:result.message, connections:result.connection })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async getUserById(req:Request, res:Response) {
        try {
            const user_id = req.query.user_id
            const result = await this._chatUseCase.fetchUserById(user_id as string)
            res.status(result.status).json({ message:result.message, userData:result.user })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async getEmployerMessagesByReceiverId(req:Request, res:Response) {
        try {
            const token = req.header('Employer-Token');
            const receiver_id = req.params.receiver_id        
            if (token && receiver_id) {
                const result = await this._chatUseCase.getEmployerMessagesByReceiverId(token,receiver_id)
                res.status(result.status).json({ message:result.message, chats:result.chats })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async saveMessageByEmployer(req:Request, res:Response) {
        try {
            const token = req.header('Employer-Token');
            const messageData = req.body
            if (typeof messageData.type == 'undefined') messageData.type = 'text'
            
            if (token) {
                const result = await this._chatUseCase.saveMessageByEmployer(token, messageData)
                res.status(result.status).json({ message:result.message, messageId:result.chat?._id })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async saveMediaFileByEmployer(req:Request, res:Response) {
        try {
            const token = req.header('Employer-Token');
            const messageData = req.body

            if (req.file) {
                const mediaFileUpload = await cloudinary.uploader.upload(req.file.path, { resource_type:'auto' });
                messageData.isMediaFile = true

                const { resource_type, format, mime_type, url } = mediaFileUpload;
                if (resource_type === 'raw' || format == 'pdf') {
                    messageData.type = 'raw';
                } else {
                    messageData.type = mediaFileUpload.resource_type;
                }

                messageData.content = mediaFileUpload.url
            }
            
            if (token) {
                const result = await this._chatUseCase.saveMessageByEmployer(token, messageData)
                res.status(result.status).json({ message:result.message, mediaFileMessage:result.chat })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async addEmployerConnection(req:Request, res:Response) {
        try {
            const token = req.header('Employer-Token');
            const connection_id = req.body.connection_id
            if (token) {
                const result = await this._chatUseCase.addConnections(token, connection_id)
                res.status(result.status).json({ message:result.message, connections:result.connection })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async scheduleInterview(req:Request, res:Response) {
        try {
            const token = req.header('Employer-Token');
            const { receiver, date, time, message_id } = req.body
            if (token) {
                const result = await this._chatUseCase.scheduleInterview(token, receiver, date, time, message_id)
                res.status(result.status).json({ message:result.message })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async cancelScheduleInterview(req:Request, res:Response) {
        try {
            const message_id = req.body.message_id
            const result = await this._chatUseCase.cancelScheduledInterview(message_id)
            res.status(result.status).json({ message:result.message, chat:result.chat })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

    async deleteMessageById(req:Request, res:Response) {
        try {
            const message_id = req.params.messageId
            const result = await this._chatUseCase.deleteMessageById(message_id)
            res.status(result.status).json({ message:result.message, deletedMessage:result.chat })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })
        }
    }

}

export default ChatController