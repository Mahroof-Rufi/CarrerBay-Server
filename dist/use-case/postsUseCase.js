"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class PostsUseCase {
    constructor(_jwt, _postsRepository) {
        this._jwt = _jwt;
        this._postsRepository = _postsRepository;
    }
    fetchPosts(pageNo) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 5;
            const skip = (parseInt(pageNo) - 1) * limit;
            const posts = yield this._postsRepository.fetchAllPosts(skip, limit);
            const noOfPosts = yield this._postsRepository.fetchTotalNoOfPosts();
            return {
                status: 200,
                posts: posts,
                message: 'Posts found',
                totalNoOfPosts: noOfPosts,
            };
        });
    }
    triggerPostLike(token, employer_id, post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "User");
            const res = yield this._postsRepository.triggerPostLike(employer_id, post_id, decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
            return {
                status: 200,
                message: 'Like updated successfully',
                posts: res[0],
            };
        });
    }
    fetchPostsByEmployerId(token, pageNo, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            const decode = this._jwt.verifyToken(token, "Employer");
            const limit = 5;
            const skip = (parseInt(pageNo) - 1) * limit;
            const post = yield this._postsRepository.fetchPostsById(decode === null || decode === void 0 ? void 0 : decode.id, skip, limit, sort);
            const noOfPost = yield this._postsRepository.fetchTotalNoOfEmployerPosts(decode === null || decode === void 0 ? void 0 : decode.id);
            if (post) {
                return {
                    status: 200,
                    message: 'Posts found successfully',
                    post: post,
                    noOfPost: noOfPost
                };
            }
            return {
                status: 200,
                message: 'Posts not found'
            };
        });
    }
    fetchSearchedPosts(token, pageNo, sort, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const decode = this._jwt.verifyToken(token, "Employer");
            const limit = 5;
            const skip = (parseInt(pageNo) - 1) * limit;
            const searchedPosts = yield this._postsRepository.fetchSearchedPosts(decode === null || decode === void 0 ? void 0 : decode.id, skip, limit, sort, searchQuery);
            const noOfPost = yield this._postsRepository.fetchTotalNoOfEmployerPosts(decode === null || decode === void 0 ? void 0 : decode.id, skip, limit, searchQuery);
            return {
                status: 200,
                message: 'Searched posts found successfully',
                posts: searchedPosts,
                noOfPost: noOfPost
            };
        });
    }
    addPost(description, token, urls) {
        return __awaiter(this, void 0, void 0, function* () {
            const decode = this._jwt.verifyToken(token, "Employer");
            const res = yield this._postsRepository.addPost(description, decode === null || decode === void 0 ? void 0 : decode.id, urls);
            if (res) {
                return {
                    status: 201,
                    message: 'Post uploaded successfully',
                    post: res
                };
            }
            return {
                status: 400,
                message: 'post upload failed'
            };
        });
    }
    editPost(post_id, description, token, urls) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "Employer");
            const oldData = yield this._postsRepository.fetchAPerticularPost(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, post_id);
            const unWantedImageURLS = oldData === null || oldData === void 0 ? void 0 : oldData.posts[0].image_urls.filter((url) => !(urls === null || urls === void 0 ? void 0 : urls.includes(url)));
            const updatedPosts = yield this._postsRepository.editPost(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, post_id, description, urls);
            console.log('kk', updatedPosts.posts);
            if (updatedPosts) {
                return {
                    status: 200,
                    message: 'Post updated successfully',
                    post: updatedPosts.posts,
                    oldURLs: unWantedImageURLS
                };
            }
            else {
                return {
                    status: 400,
                    message: 'Something went wrong'
                };
            }
        });
    }
    deletePost(token, post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "Employer");
            const res = yield this._postsRepository.deletePostById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, post_id);
            return {
                status: 200,
                message: 'Post deleted successfully'
            };
        });
    }
}
exports.default = PostsUseCase;
