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
        const chats = await chatModel.find({
          $or: [
            { sender: user_id, receiver: receiver_id },
            { sender: receiver_id, receiver: user_id }
          ]
        }).sort({ timestamp: 1 });

        return chats || null
    }

    async saveMessage(user_id: string, receiver_id: string, content: string): Promise<Chat> {
      const message = new chatModel({ sender:user_id, receiver:receiver_id, content:content })
      await message.save()
      return message
    }

}

export default ChatRepository