import express from 'express';
import { postsController } from '../../providers/controllers';
import upload from '../../middlewares/multer';
import employerAuth from '../../middlewares/employerAuth';
import userAuth from '../../middlewares/userAuth';
import { Request, Response } from 'express-serve-static-core';

const router = express.Router();
const handleFiles = upload.fields([
    { name: 'image1' },
    { name: 'image2' },
    { name: 'image3' },
    { name: 'image4' },
    { name: 'image5' },
    { name: 'image6' },
]);

// Route handlers
const handleFetchPosts = (req: Request, res: Response) => postsController.fetchPosts(req, res);
const handleTriggerPostLike = (req: Request, res: Response) => postsController.triggerPostLike(req, res);
const handleAddComment = (req:Request, res:Response) => postsController.addComment(req, res);
const handleFetchPostsByEmployer = (req: Request, res: Response) => postsController.fetchPostsByEmployer(req, res);
const handleAddPost = (req: Request, res: Response) => postsController.addPost(req, res);
const handleEditPost = (req: Request, res: Response) => postsController.editPost(req, res);
const handleDeletePost = (req: Request, res: Response) => postsController.deletePost(req, res);


// USER POSTS ROUTES
router.route('/')
    .get(userAuth, handleFetchPosts)
    .post(userAuth, handleTriggerPostLike);
router.route('/add-comment').post(userAuth, handleAddComment)

// EMPLOYER POSTS ROUTES
router.route('/employer-posts')
    .get(employerAuth, handleFetchPostsByEmployer)
    .post(employerAuth, handleFiles, handleAddPost)
    .put(employerAuth, handleFiles, handleEditPost);

router.delete('/delete-post/:post_id', employerAuth, handleDeletePost);

export default router;
