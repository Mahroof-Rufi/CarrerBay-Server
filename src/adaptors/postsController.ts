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
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async triggerPostLike(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const employer_id = req.body.employer_id
            const post_id = req.body.post_id
            const result = await this._postsUseCase.triggerPostLike(token as string, employer_id, post_id)  
            res.status(result.status).json({ message:result.message, updatedPost:result.posts })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async addComment(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const { employer_id, post_Id, comment } = req.body
            if (token) {
                const result = await this._postsUseCase.addComment(token, employer_id, post_Id, comment)  
                res.status(result.status).json({ message:result.message, newComment:result.comment })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async savePost(req:Request, res:Response) {
        try {
            const token = req.header('User-Token');
            const { employer_Id, post_Id } = req.body
            
            if (token) {
                const result = await this._postsUseCase.triggerPostSave(token, employer_Id, post_Id)  
                res.status(result.status).json({ message:result.message, updatedPost:result.post })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async loadSavedPosts(req: Request, res: Response) {
        const token = req.header('User-Token');
        if (token) {
            const result = await this._postsUseCase.loadUserSavedPosts(token);
            res.status(result.status).json({ message: result.message, posts: result.savedPosts })
        }
    }

    async fetchPostsByEmployer(req:Request, res:Response) {
        try {    
                   
            const token = req.header('Employer-Token');
            const searchQuery = req.query.search            
            const page = req.query.page
            const sort = req.query.sort 
            console.log('se',sort);
                       

            if (token) {
                if (searchQuery && searchQuery != '' && typeof searchQuery == "string") {
                    const searchedPosts = await this._postsUseCase.fetchSearchedPosts(token, page as string , sort as string, searchQuery)
                    res.status(searchedPosts.status).json({ posts:searchedPosts.posts, totalNoOfPosts:searchedPosts.noOfPost })
                } else {
                    const result = await this._postsUseCase.fetchPostsByEmployerId(token, page as string, sort as string)
                    res.status(result.status).json({ message:result.message, posts:result.post, totalNoOfPosts:result.noOfPost })
                }
            }
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
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
                res.status(result.status).json({ message:result.message,updatedPost:result.post })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
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
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }

    async deletePost(req:Request, res:Response) {
        try {
            const token = req.header('Employer-Token');
            const postId = req.params.post_id
            if (token) {
                const result = await this._postsUseCase.deletePost(token, postId)
                console.log('successfully sending back :', result);
                
                res.status(result.status).json({ message:result.message, post_id:postId })
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message:'Something went wrong' })            
        }
    }
}

export default PostsController