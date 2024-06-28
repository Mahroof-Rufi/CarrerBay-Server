import { EmployerPosts, Post } from "./employerPosts";

export interface PostsOutput {
    status:number,
    message:string,
    post?:EmployerPosts,
    posts?:EmployerPosts[] | null,
    oldURLs?:string[],
    comment?:any
}