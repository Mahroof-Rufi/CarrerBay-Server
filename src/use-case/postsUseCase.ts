import PostsRepository from "../infrastructure/repositories/postsRepository"
import IPostsUseCase from "../interfaces/iUseCases/iPostsUseCase"
import { PostsOutput } from "../interfaces/models/postsOutput"
import Jwt from "../providers/jwt"

class PostsUseCase implements IPostsUseCase{

    constructor(
        private readonly _jwt:Jwt,
        private readonly _postsRepository:PostsRepository
    ) {}

    async fetchPosts(pageNo:string) {
        const limit = 5
        const skip = (parseInt(pageNo) - 1) * limit
        const posts = await this._postsRepository.fetchAllPosts(skip,limit)
        const noOfPosts = await this._postsRepository.fetchTotalNoOfPosts()
        return {
            status:200,
            posts: posts,
            message:'Posts found',
            totalNoOfPosts: noOfPosts,
        }
    }

    async fetchPostsByEmployerId(token:string, pageNo:string) {
        const decode = this._jwt.verifyToken(token,"Employer")
        const limit = 5
        const skip = (parseInt(pageNo) - 1) * limit
        const post = await this._postsRepository.fetchPostsById(decode?.id, skip, limit)
        console.log('po',post);
        
        const noOfPost = await this._postsRepository.fetchTotalNoOfEmployerPosts(decode?.id)
        if (post ) {
            return {
                status: 200,
                message:'Posts found successfully',
                post: post,
                noOfPost: noOfPost
            }
        }
        return {
            status: 400,
            message: 'Posts not found'
        }
    }

    async addPost(description:string,token:string, urls?:string[]) {
        const decode = this._jwt.verifyToken(token,"Employer")
        const res = await this._postsRepository.addPost(description,decode?.id, urls)
        
        if (res) {
            return {
                status:201,
                message:'Post uploaded successfully',
                post:res
            }
        }
        return {
            status:400,
            message:'post upload failed'
        }
    }

    async fetchSearchedPosts(token:string, searchQuery:string) {
        const decode = this._jwt.verifyToken(token,"Employer")
        const searchedPosts = await this._postsRepository.fetchSearchedPosts(decode?.id, searchQuery)
        return {
            status: 200,
            message: 'Searched posts found successfully',
            posts: searchedPosts
        }
    }

    async editPost(post_id:string, description: string, token: string, urls?: string[] | undefined): Promise<PostsOutput> {
        const decodedToken = this._jwt.verifyToken(token,"Employer")
        const oldData = await this._postsRepository.fetchAPerticularPost(decodedToken?.id, post_id)
        const unWantedImageURLS = oldData?.posts[0].image_urls.filter((url) => !urls?.includes(url))
        const updatedPosts:any = await this._postsRepository.editPost(decodedToken?.id,post_id,description, urls)
        console.log('kk', updatedPosts.posts);
        
        if (updatedPosts) {
            return {
                status:200,
                message:'Post updated successfully',
                post:updatedPosts.posts,
                oldURLs:unWantedImageURLS
            }
        } else {
            return {
                status:400,
                message:'Something went wrong'
            }
        }
    }

    async deletePost(token: string, post_id: string): Promise<PostsOutput> {
        const decodedToken = this._jwt.verifyToken(token,"Employer")
        const res = await this._postsRepository.deletePostById(decodedToken?.id, post_id)
        return {
            status: 200,
            message: 'Post deleted successfully'
        }
    }
    
}

export default PostsUseCase