import mongoose, { connection } from "mongoose";
import chatModel from "../../entities_models/chatModel";
import IChatRepository from "../../interfaces/iRepositories/iChatRepository";
import { Chat } from "../../interfaces/models/chat";
import connectionsModel from "../../entities_models/connectionModel";

class ChatRepository implements IChatRepository {

    async addConnection(user_id: string, connection_id: string, isUser: boolean): Promise<any> {      
      const update = isUser
            ? { $addToSet: { 'connections.users': connection_id } }
            : { $addToSet: { 'connections.employers': connection_id } };

        const connections = await connectionsModel.findOneAndUpdate(
            { user_id: user_id },
            update,
            { upsert: true, new: true }
        );

        return connections || null
    }

    async getConnectedUsers(user_id: string): Promise<any> {
      const connections = await connectionsModel.findOne({ user_id: user_id },{ _id:0,user_id:0 })
      .populate('connections.users')
      .populate('connections.employers');

      return connections || null
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

    async saveMessage(user_id: string, receiver_id: string, content: string, profileType:string): Promise<Chat> {
      const message = new chatModel({ sender:user_id, receiver:receiver_id, content:content, profileType:profileType })
      await message.save()
      return message
    }

}

export default ChatRepository