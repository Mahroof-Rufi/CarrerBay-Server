import PostsRepository from "../infrastructure/repositories/postsRepository"
import IPostsUseCase from "../interfaces/iUseCases/iPostsUseCase"
import Jwt from "../providers/jwt"

class PostsUseCase implements IPostsUseCase{

    constructor(
        private readonly _jwt:Jwt,
        private readonly _postsRepository:PostsRepository
    ) {}

    async fetchPosts() {
        const posts = await this._postsRepository.fetchAllPosts()
        return {
            status:200,
            posts: posts,
            message:'Posts found'
        }
    }

    async fetchPostsByEmployerId(token:string) {
        const decode = this._jwt.verifyToken(token)
        const post = await this._postsRepository.fetchPostsById(decode?.id)
        if (post) {
            return {
                status:200,
                post:post,
                message:'Posts found successfully'
            }
        }
        return {
            status: 404,
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