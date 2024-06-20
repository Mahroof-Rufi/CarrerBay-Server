import mongoose, { connection } from "mongoose";
import chatModel from "../../entities_models/chatModel";
import IChatRepository from "../../interfaces/iRepositories/iChatRepository";
import { Chat } from "../../interfaces/models/chat";
import connectionsModel from "../../entities_models/connectionModel";

class ChatRepository implements IChatRepository {

    async addConnection(user_id: string, connection_id: string, isUser?: boolean): Promise<any> {      
      try {
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
      } catch (error) {
        console.log(error);
        throw error
      }
    }

    async getConnectedUsers(user_id: string, context:'User' | 'Employer'): Promise<any> {
      try {
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
      } catch (error) {
        console.log(error);
        throw error
      }
    }

    async getMessagesByUserIdAndReceiverId(user_id: string, receiver_id: string): Promise<Chat[] | null> {
      try {
        const chats = await chatModel.find({
          $or: [
            { sender: user_id, receiver: receiver_id },
            { sender: receiver_id, receiver: user_id }
          ]
        }).sort({ timestamp: 1 }).populate('interviewDetails.employer');
  
        return chats || null
      } catch (error) {
        console.log(error);
        throw error
      }
    }

    async saveMessage(user_id: string, receiver_id: string, content: string, type:string): Promise<Chat> {
      try {
        const message = new chatModel({ sender:user_id, receiver:receiver_id, content:content, type:type })
        await message.save()
        return message
      } catch (error) {
        console.log(error);
        throw error
      }
    }

    async saveInterviewSchedule(employer_id: string, receiver_id: string, date: Date, time: string, message_id?:string): Promise<Chat | null> {
      try {
        if (message_id) {
          const scheduleData = {
            employer: employer_id,
            interviewDate:date,
            interviewTime:time,
            status:'scheduled'
          }
          const interviewSchedule = await chatModel.findByIdAndUpdate(
            { _id:message_id },
            { sender:employer_id, receiver:receiver_id, type:'interview', interviewDetails:scheduleData })
  
          return interviewSchedule || null
        } else {
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
      } catch (error) {
        console.log(error);
        throw error
      }
    }
    
    async findScheduledInterviews(user_id: string): Promise<Chat[] | null> {
      try {
        const scheduledInterviews = await chatModel.find(
          { receiver: user_id, type:'interview' },
        ).populate('interviewDetails.employer')
  
        return scheduledInterviews || null
      } catch (error) {
        console.log(error);
        throw error
      }
    }

    async cancelInterview(message_id: string): Promise<Chat | null> {
      try {
        const cancelledInterview = await chatModel.findByIdAndUpdate(
          { _id: message_id },
          { 'interviewDetails.status': 'canceled' },
          { new: true }
        ).populate('interviewDetails.employer')
  
        return cancelledInterview || null
      } catch (error) {
        console.log(error);
        throw error
      }
    }

}

export default ChatRepository