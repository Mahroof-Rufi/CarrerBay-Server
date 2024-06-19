import mongoose, { connection } from "mongoose";
import chatModel from "../../entities_models/chatModel";
import IChatRepository from "../../interfaces/iRepositories/iChatRepository";
import { Chat } from "../../interfaces/models/chat";
import connectionsModel from "../../entities_models/connectionModel";

class ChatRepository implements IChatRepository {

    async addConnection(user_id: string, connection_id: string, isUser?: boolean): Promise<any> {      
      
      let update;

      if (typeof isUser != 'undefined') {        
        update = isUser
          ? { $addToSet: { 'connections.users': connection_id } }
          : { $addToSet: { 'connections.employers': connection_id } };
      } else {
        update = { $addToSet: { 'connections.users': connection_id } }
      }

      const connections = await connectionsModel.findOneAndUpdate(
          { user_id: user_id },
          update,
          { upsert: true, new: true }
      )
      .populate('connections.users')
      .populate('connections.employers');

      if (typeof isUser != 'undefined') {
        await connectionsModel.findOneAndUpdate(
          { user_id: connection_id },
          { $addToSet: { 'connections.users': user_id } },
          { upsert: true, new: true }
        )
      } else {
        await connectionsModel.findOneAndUpdate(
          { user_id: connection_id },
          { $addToSet: { 'connections.employers': user_id } },
          { upsert: true, new: true }
        )
      }

      return connections || null
    }

    async getConnectedUsers(user_id: string, context:'User' | 'Employer'): Promise<any> {
      if (context == 'User') {
        const connections = await connectionsModel.findOne({ user_id: user_id },{ _id:0,user_id:0 })
        .populate('connections.users')
        .populate('connections.employers');

        return connections || null
      } else if (context == 'Employer') {
        const connections = await connectionsModel.findOne({ user_id: user_id },{ _id:0,user_id:0 })
        .populate('connections.users')

        return connections || null
      }
    }

    async getMessagesByUserIdAndReceiverId(user_id: string, receiver_id: string): Promise<Chat[] | null> {
        const chats = await chatModel.find({
          $or: [
            { sender: user_id, receiver: receiver_id },
            { sender: receiver_id, receiver: user_id }
          ]
        }).sort({ timestamp: 1 }).populate('interviewDetails.employer');

        return chats || null
    }

    async saveMessage(user_id: string, receiver_id: string, content: string): Promise<Chat> {
      const message = new chatModel({ sender:user_id, receiver:receiver_id, content:content })
      await message.save()
      return message
    }

    async saveInterviewSchedule(employer_id: string, receiver_id: string, date: Date, time: string): Promise<Chat> {
      const scheduleData = {
        employer: employer_id,
        interviewDate:date,
        interviewTime:time,
        status:'scheduled'
      }
      const interviewSchedule = new chatModel({ sender:employer_id, receiver:receiver_id, type:'interview', interviewDetails:scheduleData })
      await interviewSchedule.save()
      return interviewSchedule
    }
    
    async findScheduledInterviews(user_id: string): Promise<Chat[] | null> {
      const scheduledInterviews = await chatModel.find(
        { receiver: user_id, type:'interview' },
      ).populate('interviewDetails.employer')

      return scheduledInterviews || null
    }

}

export default ChatRepository