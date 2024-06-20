import { Chat } from "./chat";
import { User } from "./user";

export interface ChatOutput {
    status: number;
    message: string;
    chat?: Chat
    chats?: Chat[] | null;
    connection?: Chat[] | null;
    user?:User | null
}