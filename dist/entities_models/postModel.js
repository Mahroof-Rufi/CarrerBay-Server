"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const commentSchema = new mongoose_2.Schema({
    user_id: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'user',
        required: true
    },
    comment: {
        type: String,
        required: true
    }
});
const postSchema = new mongoose_2.Schema({
    image_urls: {
        type: [String],
    },
    description: {
        type: String
    },
    likes: {
        type: [String]
    },
    comments: {
        type: [commentSchema]
    },
    saved: {
        type: [String]
    },
    postedAt: {
        type: Date,
        required: true,
        default: Date.now
    },
});
const postsSchema = new mongoose_2.Schema({
    employer_id: {
        type: mongoose_1.default.Types.ObjectId,
    },
    posts: {
        type: [postSchema]
    }
});
const postsModel = (0, mongoose_2.model)('posts', postsSchema);
exports.default = postsModel;
