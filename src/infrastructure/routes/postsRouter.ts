import express from 'express'
import upload from "../../middlewares/multer";
import { postsController } from '../../providers/controllers'

const router = express.Router()

const handleFiles = upload.fields([ { name:'image1' }, { name:'image2' }, { name:'image3' }, { name:'image4' }, { name:'image5' } ])

router.route('/')
    .get((req, res) => postsController.fetchPosts(req, res));
router.route('/post')
    .get((req, res) => postsController.fetchPosts(req, res))
    .post(handleFiles, (req, res) => postsController.addPost(req, res))

export default router