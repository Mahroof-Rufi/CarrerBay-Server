import { Comment } from "./comment";

export interface Post {
    image_urls: string[];
    description: string;
    likes: string[];
    comments: Comment[];
    saved: string[];
}