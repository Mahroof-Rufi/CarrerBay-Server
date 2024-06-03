import express from "express";
import upload from "../../middlewares/multer";
import employerAuth from "../../middlewares/employerAuth";
import { employerController } from "../../providers/controllers";

const router = express.Router()

router.route('/')
    .get( employerAuth, (req, res) => employerController.fetchEmployerData(req, res))
    // .post( employerAuth, (req, res) => employerController.fetchEmployerProfileById(req, res))
router.route('/update-profile').put( employerAuth, upload.single("profile-img"), (req, res) => employerController.updateProfile(req, res))

export default router