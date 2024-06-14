import { Chat } from "../models/chat";

interface IChatRepository {

    getConnectedUsers(user_id:string): Promise<Chat[] | null>
    getMessagesByUserIdAndReceiverId(user_id:string, receiver_id:string): Promise<Chat[] | null>

}

export default IChatRepository