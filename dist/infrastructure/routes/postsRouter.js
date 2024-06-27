"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../providers/controllers");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const employerAuth_1 = __importDefault(require("../../middlewares/employerAuth"));
const userAuth_1 = __importDefault(require("../../middlewares/userAuth"));
const router = express_1.default.Router();
const handleFiles = multer_1.default.fields([
    { name: 'image1' },
    { name: 'image2' },
    { name: 'image3' },
    { name: 'image4' },
    { name: 'image5' }
]);
// Route handlers
const handleFetchPosts = (req, res) => controllers_1.postsController.fetchPosts(req, res);
const handleTriggerPostLike = (req, res) => controllers_1.postsController.triggerPostLike(req, res);
const handleFetchPostsByEmployer = (req, res) => controllers_1.postsController.fetchPostsByEmployer(req, res);
const handleAddPost = (req, res) => controllers_1.postsController.addPost(req, res);
const handleEditPost = (req, res) => controllers_1.postsController.editPost(req, res);
const handleDeletePost = (req, res) => controllers_1.postsController.deletePost(req, res);
// USER POSTS ROUTES
router.route('/')
    .get(userAuth_1.default, handleFetchPosts)
    .post(userAuth_1.default, handleTriggerPostLike);
// EMPLOYER POSTS ROUTES
router.route('/employer-posts')
    .get(employerAuth_1.default, handleFetchPostsByEmployer)
    .post(employerAuth_1.default, handleFiles, handleAddPost)
    .put(employerAuth_1.default, handleFiles, handleEditPost);
router.delete('/delete-post/:post_id', employerAuth_1.default, handleDeletePost);
exports.default = router;
