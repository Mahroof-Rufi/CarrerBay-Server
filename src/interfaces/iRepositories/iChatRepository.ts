import { Chat } from "../models/chat";

interface IChatRepository {

    addConnection(user_id:string, connection_id:string, isUser?:boolean): Promise<any>
    getConnectedUsers(user_id:string,context:'User' | 'Employer'): Promise<Chat[] | null>
    getMessagesByUserIdAndReceiverId(user_id:string, receiver_id:string): Promise<Chat[] | null>
    saveMessage(user_id:string, receiver_id:string, content:string, type:string): Promise<Chat>
    saveInterviewSchedule(employer_id:string, receiver_id:string, date:Date, time:string, message_id?:string): Promise<Chat | null>
    findScheduledInterviews(user_id:string): Promise<Chat[] | null>
    cancelInterview(message_id:string): Promise<Chat | null>

}

export default IChatRepository