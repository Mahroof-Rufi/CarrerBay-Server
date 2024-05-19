import { EmployerPosts, Post } from "../../domain/post";
import PostsInterface from "../../use-case/interface/postInterface";
import postsModel from "../data-base/postModel";

class PostsRepository implements PostsInterface {

    async fetchPostsById(employer_id: string): Promise<EmployerPosts | null> {
        const posts = await postsModel.findOne(
            { employer_id:employer_id }
        );

        if (posts) {
            return posts
        } else {
            return null
        }
    }
 
    async addPost(description: string,employer_id:string, images?: string[] | undefined): Promise<EmployerPosts | null> {
        const result = await postsModel.findOneAndUpdate(
            { employer_id: employer_id }, 
            { $push: { posts: { description: description, image_urls: images } } }, 
            { upsert: true, new: true }
        );

        if (result) {
            return result
        } else {
            return null
        }
    }

    async fetchAllPosts(): Promise<any> {
        const result = await postsModel.find()
        if (result) {
            return result
        } else {
            return null
        }
    }

}

export default PostsRepository