import { Chat } from "../models/chat";

interface IChatRepository {

    getConnectedUsers(user_id:string): Promise<Chat[] | null>
    getMessagesByUserIdAndReceiverId(user_id:string, receiver_id:string): Promise<Chat[] | null>
    saveMessage(user_id:string, receiver_id:string, content:string): Promise<Chat>

}

export default IChatRepository