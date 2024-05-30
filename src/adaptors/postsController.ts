import cloudinary from "../providers/cloudinary";
import PostsUseCase from "../use-case/postsUseCase";
import { Request,Response } from "express";

class PostsController {

    constructor(
        private readonly _postsUseCase:PostsUseCase
    ) {}

    async fetchPosts(req:Request, res:Response) {
        try {
            const page = req.query.page
            const result = await this._postsUseCase.fetchPosts(page as string)
            res.status(result.status).json({ message:result.message, posts:result.posts, totalNoOfPosts:result.totalNoOfPosts })
        } catch (error) {
            console.error(error);            
        }
    }

    async fetchPostsByEmployer(req:Request, res:Response) {
        try {            
            const token = req.header('Employer-Token');
            const searchQuery = req.query.search            
            const page = req.query.page

            if (searchQuery && token && searchQuery != ' ' && typeof searchQuery == 'string') {
                const searchedPosts = await this._postsUseCase.fetchSearchedPosts(token, searchQuery)
                res.status(searchedPosts.status).json({ posts:searchedPosts.posts, })
            } else {
                if (token && page) {                    
                    const result = await this._postsUseCase.fetchPostsByEmployerId(token,page as string)
                    res.status(result.status).json({ message:result.message, posts:result.post, totalNoOfPosts:result.noOfPost })
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

    async editPost(req:Request, res:Response) {
        try {
            const token = req.header('Employer-Token');
            const description = req.body.description;
            const post_id = req.body.post_id
            let imageURLs = []
            if (req.body.oldImageUrls) {
                imageURLs = JSON.parse(req.body.oldImageUrls)
            }
            
            for (let i = 1; i <= 6; i++) {
                const image = (req.files as any)[`image${i}`];
                if (image) {
                    try {
                        console.log('upload'+i);
                        const result = await cloudinary.uploader.upload(image[0].path);
                        console.log('upload'+i+'done');
                        
                        imageURLs.push(result.secure_url);
                    } catch (error) {
                        console.error(`Error uploading image ${i}:`, error);
                    }
                }
            } 
            
            if (token) {
                const result = await this._postsUseCase.editPost(post_id,description, token,imageURLs)

                if (result.oldURLs) {
                    for (let url = 0; url < result?.oldURLs?.length; url++) {
                        try {
                            console.log('delete start' + url);
                            
                            await cloudinary.uploader.destroy(result.oldURLs[url]) 
                            console.log('delete done' + url);
                            
                        } catch (error) {
                            console.log(error);
                            
                        }                       
                    }
                }
                
                res.status(result.status).json({ message:result.message,updatedPosts:result.post})
            }
        } catch (error) {
            console.error(error);            
        }
    }

    async deletePost(req:Request, res:Response) {
        try {
            const token = req.header('Employer-Token');
            const postId = req.params.post_id
            if (token) {
                const result = await this._postsUseCase.deletePost(token, postId)
                res.status(result.status).json({ message:result.message,post_id:postId })
            }
        } catch (error) {
            console.error(error);            
        }
    }
}

export default PostsController