import { Chat } from "./chat";

export interface ChatOutput {
    status: number;
    message: string;
    chats?: Chat[] | null;
    connection?: Chat[] | null
}