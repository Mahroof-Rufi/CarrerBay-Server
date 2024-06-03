import express from 'express'
import upload from "../../middlewares/multer";
import { postsController } from '../../providers/controllers'
import employerAuth from '../../middlewares/employerAuth';
import userAuth from '../../middlewares/userAuth';

const router = express.Router()

const handleFiles = upload.fields([ { name:'image1' }, { name:'image2' }, { name:'image3' }, { name:'image4' }, { name:'image5' } ])

// USER POSTS ROUTES
router.route('/')
    .get( userAuth, (req, res) => postsController.fetchPosts(req, res))
    .post( userAuth, (req, res) => postsController.triggerPostLike(req, res))

// EMPLOYER POSTS ROUTES
router.route('/employer-posts')
    .get( employerAuth, (req, res) => postsController.fetchPostsByEmployer(req, res))
    .post( employerAuth, handleFiles, (req, res) => postsController.addPost(req, res))
    .put( employerAuth, handleFiles, (req, res) => postsController.editPost(req, res))
router.route('/delete-post/:post_id')
    .delete( employerAuth, (req, res) => postsController.deletePost(req, res))

export default router