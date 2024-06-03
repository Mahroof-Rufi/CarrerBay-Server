import { EmployerPosts, Post } from "../../interfaces/models/employerPosts";
import IPostsRepository from "../../interfaces/iRepositories/iPostRepository";
import postsModel from "../../entities_models/postModel";
import mongoose from "mongoose";
import e from "express";

class PostsRepository implements IPostsRepository {

    async fetchPostsById(employer_id: string, skip:number, limit:number, sort:string): Promise<EmployerPosts | any> {

        let sortQuery: 1 | -1 = 1;

        if (sort === 'newest') {
            sortQuery = -1;
        } else if (sort === 'oldest') {
            sortQuery = 1;
        }

        const posts = await postsModel.aggregate([
            { $match: { employer_id: new mongoose.Types.ObjectId(employer_id) } },
            { $unwind: '$posts' },
            { $skip: skip },
            { $limit: limit },
            { $sort:  { 'posts._id':sortQuery } },
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

    async fetchTotalNoOfEmployerPosts(employer_id: string, skip:number = 0, limit:number = 0, searchQuery?:string): Promise<number> {
        if (searchQuery) {
            
            const searchedPosts:any = await postsModel.find(
                { employer_id: employer_id,
                  "posts.description": { $regex: searchQuery , $options: 'i' }
                },
                { "posts.$": 1 } 
            ).skip(skip).limit(limit)

            console.log(searchedPosts.length);
           
            return searchedPosts.length ? searchedPosts.length : 0
            
        } else {
            const postsCount = await postsModel.findOne(
                { employer_id: employer_id }
            )        
    
            return postsCount?.posts.length || 0
        }
    }

    async triggerPostLike(employer_id: string, post_id: string, user_id: string): Promise<EmployerPosts | any> {
        const post:any = await postsModel.findOne(
            { employer_id: employer_id, 'posts._id': post_id  },
            { 'posts.$': 1 }
        );

        if (!post || post.posts.length === 0) {
            throw new Error('Post not found');
        }

        const userLiked = post.posts[0].likes.includes(user_id);

        const updateQuery = userLiked ? { $pull: { 'posts.$.likes': user_id } } : { $addToSet: { 'posts.$.likes': user_id } };
        
        await postsModel.updateOne(
            { 'employer_id': employer_id, 'posts._id': post_id },
            updateQuery
        );   
        
        const updatedEmployer = await postsModel.aggregate([
            { $match: { 'employer_id': { $in: [new mongoose.Types.ObjectId(employer_id)] } } },
            { $unwind: '$posts' },
            { $match: { 'posts._id': { $in: [new mongoose.Types.ObjectId(post_id)] } } },
            {
              $addFields: {
                'posts.employer_id': '$employer_id'
              }
            },
            {
              $replaceRoot: {
                newRoot: '$posts'
              }
            }
          ]);
      
          return updatedEmployer;
    }
 
    async addPost(description: string,employer_id:string, images?: string[] | undefined): Promise<EmployerPosts[] | any> {
        const result = await postsModel.findOneAndUpdate(
            { employer_id: employer_id }, 
            { $push: { posts: { description: description, image_urls: images } } }, 
            { upsert: true, new: true }
        );

        return result || null
    }

    async fetchAPerticularPost(employer_id: string, post_id: string): Promise<EmployerPosts | null> {
        const post = await postsModel.findOne(
            { employer_id:employer_id,'posts._id': post_id  },
            { 'posts.$': 1 }
        )

        if (post) {
            return post
        } else {
            return null
        }
    }

    async editPost(employer_id: string, post_id: string, description: string, images?: string[] | undefined): Promise<EmployerPosts | null> {
        const result = await postsModel.findOneAndUpdate(
            { employer_id: employer_id, 'posts._id': post_id }, 
            { $set: { 'posts.$.description': description, 'posts.$.image_urls':images } }, 
            { new: true }
        );

        if (result) {
            return result
        } else {
            return null
        }
    }

    async fetchAllPosts(skip: number, limit: number): Promise<any> {
        const result = await postsModel.aggregate([
            { $project: { employer_id: 1, posts: 1, _id: 0 } },
            { $unwind: '$posts' },
            { $addFields: { 'posts.employer_id': '$employer_id' } },
            { $replaceRoot: { newRoot: '$posts' } },
            { $skip: skip },
            { $limit: limit }
          ]);
    
        if (result) {            
            return result;
        } else {
            return null;
        }
    }    

    async fetchTotalNoOfPosts() {
        const postsCount = await postsModel.aggregate([
            { $unwind: "$posts" },        
            { $count: "totalPosts" }      
        ]);
        
        return postsCount[0].totalPosts
    }

    async fetchSearchedPosts(company_id:string, skip:number, limit:number, sort:string, query?:string): Promise<any> {
        
        let sortQuery: -1 | 1 = 1;

        if (sort == 'newest') {
            sortQuery = -1
        } else if (sort == 'oldest') {
            sortQuery = 1
        }

        const searchedPosts:any = await postsModel.find(
            { employer_id: company_id,
              "posts.description": { $regex: query , $options: 'i' }
            },
            { "posts.$": 1 } 
        ).sort({ _id:sortQuery })

        console.log(searchedPosts);
        

        if (searchedPosts[0]?.posts) {
            return searchedPosts[0]?.posts
        } else {
            return null
        }
    }

    async deletePostById(employer_id: string, post_id: string): Promise<EmployerPosts | null> {
        try {
            const deletePost = await postsModel.findOneAndUpdate(
                { employer_id: employer_id },
                { $pull: { posts: { _id: post_id } } }
            ) 

            if (deletePost) {
                return deletePost
            } else {
                return deletePost
            }
        } catch (error) {
            throw error
        }
    }

}

export default PostsRepository