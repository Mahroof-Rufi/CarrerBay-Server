import { EmployerPosts, Post } from "../../interfaces/models/employerPosts";
import IPostsRepository from "../../interfaces/iRepositories/iPostRepository";
import postsModel from "../../entities_models/postModel";

class PostsRepository implements IPostsRepository {

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

    async fetchSearchedPosts(company_id:string, query:string): Promise<any> {
        const searchedPosts = await postsModel.find(
            { employer_id: company_id,
              "posts.description": { $regex: query , $options: 'i' }
            },
            { "posts.$": 1 } 
        )

        if (searchedPosts) {
            return searchedPosts
        } else {
            return null
        }
    }

}

export default PostsRepository