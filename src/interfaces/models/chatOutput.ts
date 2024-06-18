import { Chat } from "./chat";
import { User } from "./user";

export interface ChatOutput {
    status: number;
    message: string;
    chats?: Chat[] | null;
    connection?: Chat[] | null;
    user?:User | null
}