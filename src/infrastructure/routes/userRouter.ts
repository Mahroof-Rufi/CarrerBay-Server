import express from "express";
import userAuth from "../../middlewares/userAuth";
import upload from "../../middlewares/multer";
import { userController } from "../../providers/controllers";

const router = express.Router()

const handleFiles = upload.fields([ { name:'resume-file' }, { name:'profile-file' } ])

router.route('/')
    .get( userAuth, (req, res) => userController.fetchUserData(req, res))
    .post( userAuth, (req, res) => userController.fetchUserProfileById(req, res))
router.route('/users').get( userAuth,(req, res) => userController.fetchAllUsers(req, res));
router.route('/employers').get( userAuth, (req, res) => userController.fetchAllEmployers(req, res));
router.route('/is-blocked').get( userAuth, (req, res) => userController.isUserBlocked(req, res));
router.patch('/update-profile', userAuth, handleFiles, (req, res) => userController.updateUserProfile(req, res));
router.patch('/update-about', userAuth, (req, res) => userController.updateUserAbout(req, res));
router.route('/update-experience').patch( userAuth, (req, res) => userController.updateUserExperience(req, res));
router.route('/delete-experience/:exp_id').delete( userAuth, (req, res) => userController.deleteUserExperience(req, res));
router.route('/update-education').patch( userAuth, (req, res) => userController.updateUserEducation(req, res));
router.route('/delete-education/:edu_id').delete( userAuth, (req, res) => userController.deleteUserEducation(req, res));
router.route('/update-skills').patch( userAuth, (req, res) => userController.updateUserSkills(req, res));
router.route('/change-email')
    .post(userAuth, (req, res) => userController.changeEmailSendOTP(req, res))
    .patch(userAuth, (req, res) => userController.updateEmail(req, res))
 
export default router