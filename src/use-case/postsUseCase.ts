import PostsRepository from "../infrastructure/repositories/postsRepository"
import Jwt from "../providers/jwt"

class PostsUseCase {

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
        const posts = await this._postsRepository.fetchPostsById(decode?.id)
        if (posts) {
            return {
                status:200,
                posts:posts,
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
                newData:res
            }
        }
        return {
            status:400,
            message:'post upload failed'
        }
    }

    async fetchSearchedPosts(token:string, searchQuery:string) {
        const decode = this._jwt.verifyToken(token)
        const searchedJobs = await this._postsRepository.fetchSearchedPosts(decode?.id, searchQuery)
        return {
            status: 200,
            posts: searchedJobs
        }
    }
    
}

export default PostsUseCase