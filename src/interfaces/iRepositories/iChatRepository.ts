import { Chat } from "../models/chat";

interface IChatRepository {

    addConnection(user_id:string, connection_id:string, isUser:boolean): Promise<any>
    getConnectedUsers(user_id:string): Promise<Chat[] | null>
    getMessagesByUserIdAndReceiverId(user_id:string, receiver_id:string): Promise<Chat[] | null>
    saveMessage(user_id:string, receiver_id:string, content:string, profileType:string): Promise<Chat>

}

export default IChatRepository