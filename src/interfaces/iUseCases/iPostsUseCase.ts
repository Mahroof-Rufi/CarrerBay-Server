import { PostsOutput } from "../models/postsOutput"

interface IPostsUseCase {

    fetchPosts(pageNo:string): Promise<PostsOutput>
    fetchPostsByEmployerId(token:string,pageNo:string): Promise<PostsOutput>
    addPost(description:string, token:string, urls?:string[]): Promise<PostsOutput>
    fetchSearchedPosts(token:string, searchQuery:string): Promise<PostsOutput>
    

}

export default IPostsUseCase