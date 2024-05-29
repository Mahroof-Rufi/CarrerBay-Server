import PostsRepository from "../infrastructure/repositories/postsRepository"
import IPostsUseCase from "../interfaces/iUseCases/iPostsUseCase"
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
        const decode = this._jwt.verifyToken(token)
        const limit = 5
        const skip = (parseInt(pageNo) - 1) * limit
        const post = await this._postsRepository.fetchPostsById(decode?.id, skip, limit)
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
        const decode = this._jwt.verifyToken(token)
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
        const decode = this._jwt.verifyToken(token)
        const searchedPosts = await this._postsRepository.fetchSearchedPosts(decode?.id, searchQuery)
        return {
            status: 200,
            message: 'Searched posts found successfully',
            posts: searchedPosts
        }
    }
    
}

export default PostsUseCase