import { PostsOutput } from "../models/postsOutput"

interface IPostsUseCase {

    fetchPosts(pageNo:string): Promise<PostsOutput>
    triggerPostLike(token:string, employer_id:string, post_id:string): Promise<PostsOutput>
    addComment(token:string, employer_Id:string, post_Id:string, comment:string): Promise<PostsOutput>
    fetchPostsByEmployerId(token:string,pageNo:string): Promise<PostsOutput>
    addPost(description:string, token:string, urls?:string[]): Promise<PostsOutput>
    editPost(post_id:string, description:string, token:string, urls?:string[]): Promise<PostsOutput>
    fetchSearchedPosts(token:string, searchQuery:string, pageNo:string, sort?:string): Promise<PostsOutput>
    deletePost(token:string, post_id:string): Promise<PostsOutput>

}

export default IPostsUseCase