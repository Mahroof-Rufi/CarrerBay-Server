import cloudinary from "../providers/cloudinary";
import PostsUseCase from "../use-case/postsUseCase";
import { Request,Response } from "express";

class PostsController {

    constructor(
        private readonly _postsUseCase:PostsUseCase
    ) {}

    async fetchPosts(req:Request, res:Response) {
        try {
            const result = await this._postsUseCase.fetchPosts()
            res.status(result.status).json({ message:result.message, posts:result.posts })
        } catch (error) {
            console.error(error);            
        }
    }

    async fetchPostsByEmployer(req:Request, res:Response) {
        try {
            const token = req.header('Employer-Token');
            const searchQuery = req.query.search
            if (searchQuery && token && searchQuery != ' ' && typeof searchQuery == 'string') {
                const searchedPosts = await this._postsUseCase.fetchSearchedPosts(token, searchQuery)
                res.status(searchedPosts.status).json({ posts:searchedPosts.posts })
            } else {
                if (token) {
                    const result = await this._postsUseCase.fetchPostsByEmployerId(token)
                    res.status(result.status).json({ message:result.message, posts:result.post })
                }
            }
            
        } catch (error) {
            console.error(error);            
        }
    }

    async addPost(req:Request, res:Response) {
        try {
            const token = req.header('Employer-Token');
            const description = req.body.description;
            const urls = []
            for (let i = 1; i <= 6; i++) {
                const image = (req.files as any)[`image${i}`];
                if (image) {
                    try {
                        console.log('upload'+i);
                        const result = await cloudinary.uploader.upload(image[0].path);
                        console.log('upload'+i+'done');
                        
                        urls.push(result.secure_url);
                    } catch (error) {
                        console.error(`Error uploading image ${i}:`, error);
                    }
                }
            } 
            
            if (token) {
                const result = await this._postsUseCase.addPost(description, token,urls)
                res.status(result.status).json({ message:result.message,updatedPosts:result.post })
            }
        } catch (error) {
            console.error(error);            
        }
    }
}

export default PostsController