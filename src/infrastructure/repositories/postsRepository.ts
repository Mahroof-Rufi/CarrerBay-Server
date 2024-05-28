import { EmployerPosts, Post } from "../../interfaces/models/employerPosts";
import IPostsRepository from "../../interfaces/iRepositories/iPostRepository";
import postsModel from "../../entities_models/postModel";
import mongoose from "mongoose";

class PostsRepository implements IPostsRepository {

    async fetchPostsById(employer_id: string, skip:number, limit:number): Promise<EmployerPosts | any> {
        const posts = await postsModel.aggregate([
            { $match: { employer_id: new mongoose.Types.ObjectId(employer_id) } },
            { $unwind: '$posts' },
            { $skip: skip },
            { $limit: limit },
            { $group: {
                _id: '$_id',
                posts: { $push: '$posts' }
            }}
        ]);        

        if (posts) {
            return posts[0].posts
        } else {
            return null
        }
    }

    async fetchTotalNoOfPosts(employer_id: string): Promise<number> {
        const postsCount = await postsModel.findOne(
            { employer_id: employer_id }
        )        

        return postsCount?.posts.length || 0
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