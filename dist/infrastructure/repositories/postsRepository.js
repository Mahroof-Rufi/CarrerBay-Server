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
const postModel_1 = __importDefault(require("../../entities_models/postModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class PostsRepository {
    fetchPostsById(employer_id, skip, limit, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let sortQuery = 1;
                if (sort === 'newest') {
                    sortQuery = -1;
                }
                else if (sort === 'oldest') {
                    sortQuery = 1;
                }
                const posts = yield postModel_1.default.aggregate([
                    { $match: { employer_id: new mongoose_1.default.Types.ObjectId(employer_id) } },
                    { $unwind: '$posts' },
                    { $skip: skip },
                    { $limit: limit },
                    { $sort: { 'posts._id': sortQuery } },
                    { $group: {
                            _id: '$_id',
                            posts: { $push: '$posts' }
                        } }
                ]);
                return ((_a = posts[0]) === null || _a === void 0 ? void 0 : _a.posts) || null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    fetchTotalNoOfEmployerPosts(employer_id_1) {
        return __awaiter(this, arguments, void 0, function* (employer_id, skip = 0, limit = 0, searchQuery) {
            try {
                if (searchQuery) {
                    const searchedPosts = yield postModel_1.default.find({ employer_id: employer_id,
                        "posts.description": { $regex: searchQuery, $options: 'i' }
                    }, { "posts.$": 1 }).skip(skip).limit(limit);
                    console.log(searchedPosts.length);
                    return searchedPosts.length ? searchedPosts.length : 0;
                }
                else {
                    const postsCount = yield postModel_1.default.findOne({ employer_id: employer_id });
                    return (postsCount === null || postsCount === void 0 ? void 0 : postsCount.posts.length) || 0;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    triggerPostLike(employer_id, post_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield postModel_1.default.findOne({ employer_id: employer_id, 'posts._id': post_id }, { 'posts.$': 1 });
                if (!post || post.posts.length === 0) {
                    throw new Error('Post not found');
                }
                const userLiked = post.posts[0].likes.includes(user_id);
                const updateQuery = userLiked ? { $pull: { 'posts.$.likes': user_id } } : { $addToSet: { 'posts.$.likes': user_id } };
                yield postModel_1.default.updateOne({ 'employer_id': employer_id, 'posts._id': post_id }, updateQuery);
                const updatedEmployer = yield postModel_1.default.aggregate([
                    { $match: { 'employer_id': { $in: [new mongoose_1.default.Types.ObjectId(employer_id)] } } },
                    { $unwind: '$posts' },
                    { $match: { 'posts._id': { $in: [new mongoose_1.default.Types.ObjectId(post_id)] } } },
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
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    addPost(description, employer_id, images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield postModel_1.default.findOneAndUpdate({ employer_id: employer_id }, { $push: { posts: { description: description, image_urls: images } } }, { upsert: true, new: true });
                return result || null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    fetchAPerticularPost(employer_id, post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield postModel_1.default.findOne({ employer_id: employer_id, 'posts._id': post_id }, { 'posts.$': 1 });
                if (post) {
                    return post;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    editPost(employer_id, post_id, description, images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield postModel_1.default.findOneAndUpdate({ employer_id: employer_id, 'posts._id': post_id }, { $set: { 'posts.$.description': description, 'posts.$.image_urls': images } }, { new: true });
                if (result) {
                    return result;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    fetchAllPosts(skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield postModel_1.default.aggregate([
                    { $project: { employer_id: 1, posts: 1, _id: 0 } },
                    { $unwind: '$posts' },
                    { $addFields: { 'posts.employer_id': '$employer_id' } },
                    { $replaceRoot: { newRoot: '$posts' } },
                    { $skip: skip },
                    { $limit: limit }
                ]);
                if (result) {
                    return result;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    fetchTotalNoOfPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postsCount = yield postModel_1.default.aggregate([
                    { $unwind: "$posts" },
                    { $count: "totalPosts" }
                ]);
                return postsCount[0].totalPosts;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    fetchSearchedPosts(company_id, skip, limit, sort, query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                let sortQuery = 1;
                if (sort == 'newest') {
                    sortQuery = -1;
                }
                else if (sort == 'oldest') {
                    sortQuery = 1;
                }
                const searchedPosts = yield postModel_1.default.find({ employer_id: company_id,
                    "posts.description": { $regex: query, $options: 'i' }
                }, { "posts.$": 1 }).sort({ _id: sortQuery });
                console.log(searchedPosts);
                if ((_a = searchedPosts[0]) === null || _a === void 0 ? void 0 : _a.posts) {
                    return (_b = searchedPosts[0]) === null || _b === void 0 ? void 0 : _b.posts;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    deletePostById(employer_id, post_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletePost = yield postModel_1.default.findOneAndUpdate({ employer_id: employer_id }, { $pull: { posts: { _id: post_id } } });
                if (deletePost) {
                    return deletePost;
                }
                else {
                    return deletePost;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = PostsRepository;
