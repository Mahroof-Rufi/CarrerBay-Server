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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("../providers/cloudinary"));
class PostsController {
    constructor(_postsUseCase) {
        this._postsUseCase = _postsUseCase;
    }
    fetchPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page;
                const result = yield this._postsUseCase.fetchPosts(page);
                res.status(result.status).json({ message: result.message, posts: result.posts, totalNoOfPosts: result.totalNoOfPosts });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    triggerPostLike(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                const employer_id = req.body.employer_id;
                const post_id = req.body.post_id;
                const result = yield this._postsUseCase.triggerPostLike(token, employer_id, post_id);
                res.status(result.status).json({ message: result.message, updatedPost: result.posts });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    fetchPostsByEmployer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('Employer-Token');
                const searchQuery = req.query.search;
                const page = req.query.page;
                const sort = req.query.sort;
                console.log('se', sort);
                if (token) {
                    if (searchQuery && searchQuery != '' && typeof searchQuery == "string") {
                        const searchedPosts = yield this._postsUseCase.fetchSearchedPosts(token, page, sort, searchQuery);
                        res.status(searchedPosts.status).json({ posts: searchedPosts.posts, totalNoOfPosts: searchedPosts.noOfPost });
                    }
                    else {
                        const result = yield this._postsUseCase.fetchPostsByEmployerId(token, page, sort);
                        res.status(result.status).json({ message: result.message, posts: result.post, totalNoOfPosts: result.noOfPost });
                    }
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    addPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('Employer-Token');
                const description = req.body.description;
                const urls = [];
                for (let i = 1; i <= 6; i++) {
                    const image = req.files[`image${i}`];
                    if (image) {
                        try {
                            console.log('upload' + i);
                            const result = yield cloudinary_1.default.uploader.upload(image[0].path);
                            console.log('upload' + i + 'done');
                            urls.push(result.secure_url);
                        }
                        catch (error) {
                            console.error(`Error uploading image ${i}:`, error);
                        }
                    }
                }
                if (token) {
                    const result = yield this._postsUseCase.addPost(description, token, urls);
                    res.status(result.status).json({ message: result.message, updatedPosts: result.post });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    editPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = req.header('Employer-Token');
                const description = req.body.description;
                const post_id = req.body.post_id;
                let imageURLs = [];
                if (req.body.oldImageUrls) {
                    imageURLs = JSON.parse(req.body.oldImageUrls);
                }
                for (let i = 1; i <= 6; i++) {
                    const image = req.files[`image${i}`];
                    if (image) {
                        try {
                            console.log('upload' + i);
                            const result = yield cloudinary_1.default.uploader.upload(image[0].path);
                            console.log('upload' + i + 'done');
                            imageURLs.push(result.secure_url);
                        }
                        catch (error) {
                            console.error(`Error uploading image ${i}:`, error);
                        }
                    }
                }
                if (token) {
                    const result = yield this._postsUseCase.editPost(post_id, description, token, imageURLs);
                    if (result.oldURLs) {
                        for (let url = 0; url < ((_a = result === null || result === void 0 ? void 0 : result.oldURLs) === null || _a === void 0 ? void 0 : _a.length); url++) {
                            try {
                                console.log('delete start' + url);
                                yield cloudinary_1.default.uploader.destroy(result.oldURLs[url]);
                                console.log('delete done' + url);
                            }
                            catch (error) {
                                console.log(error);
                            }
                        }
                    }
                    res.status(result.status).json({ message: result.message, updatedPosts: result.post });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('Employer-Token');
                const postId = req.params.post_id;
                if (token) {
                    const result = yield this._postsUseCase.deletePost(token, postId);
                    res.status(result.status).json({ message: result.message, post_id: postId });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
}
exports.default = PostsController;
