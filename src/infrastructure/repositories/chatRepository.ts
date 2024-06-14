import chatModel from "../../entities_models/chatModel";
import IChatRepository from "../../interfaces/iRepositories/iChatRepository";
import { Chat } from "../../interfaces/models/chat";

class ChatRepository implements IChatRepository {

    async getConnectedUsers(user_id: string): Promise<Chat[] | null> {
        const connectedUsers = await chatModel.aggregate([
            { $match: { receiver: { $ne: user_id } } },
            { $group: {
                _id: '$receiver', 
                receiver: { $first: '$receiver' }
              }
            },
            {
              $lookup: {
                from: 'users', 
                localField: 'receiver',
                foreignField: '_id',
                as: 'receiverData'
              }
            }
        ]);

        return connectedUsers || null
    }

    async getMessagesByUserIdAndReceiverId(user_id: string, receiver_id: string): Promise<Chat[] | null> {
        const chats = await chatModel.find(
            { sender: user_id, receiver: receiver_id }
        )

        return chats || null
    }

}

export default ChatRepository