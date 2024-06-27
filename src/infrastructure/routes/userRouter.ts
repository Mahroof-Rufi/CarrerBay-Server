import express from "express";
import userAuth from "../../middlewares/userAuth";
import upload from "../../middlewares/multer";
import { userController } from "../../providers/controllers";
import { Request, Response } from "express-serve-static-core";

const router = express.Router();
const handleFiles = upload.fields([{ name: 'resume-file' }, { name: 'profile-file' }]);

// Route handlers
const fetchUserData = (req: Request, res: Response) => userController.fetchUserData(req, res);
const fetchUserProfileById = (req: Request, res: Response) => userController.fetchUserProfileById(req, res);
const fetchAllUsers = (req: Request, res: Response) => userController.fetchAllUsers(req, res);
const fetchAllEmployers = (req: Request, res: Response) => userController.fetchAllEmployers(req, res);
const getScheduledInterviews = (req: Request, res: Response) => userController.getScheduledInterviews(req, res);
const fetchEmployerProfileById = (req: Request, res: Response) => userController.fetchEmployerProfileById(req, res);
const isUserBlocked = (req: Request, res: Response) => userController.isUserBlocked(req, res);
const updateUserProfile = (req: Request, res: Response) => userController.updateUserProfile(req, res);
const updateUserAbout = (req: Request, res: Response) => userController.updateUserAbout(req, res);
const updateUserExperience = (req: Request, res: Response) => userController.updateUserExperience(req, res);
const deleteUserExperience = (req: Request, res: Response) => userController.deleteUserExperience(req, res);
const updateUserEducation = (req: Request, res: Response) => userController.updateUserEducation(req, res);
const deleteUserEducation = (req: Request, res: Response) => userController.deleteUserEducation(req, res);
const updateUserSkills = (req: Request, res: Response) => userController.updateUserSkills(req, res);
const changeEmailSendOTP = (req: Request, res: Response) => userController.changeEmailSendOTP(req, res);
const updateEmail = (req: Request, res: Response) => userController.updateEmail(req, res);

// Routes
router.route('/')
    .get(userAuth, fetchUserData)
    .post(userAuth, fetchUserProfileById);

router.route('/users').get(userAuth, fetchAllUsers);
router.route('/employers').get(userAuth, fetchAllEmployers);
router.route('/scheduled-interviews').get(userAuth, getScheduledInterviews);
router.route('/employer-profile').post(userAuth, fetchEmployerProfileById);
router.route('/is-blocked').get(userAuth, isUserBlocked);
router.patch('/update-profile', userAuth, handleFiles, updateUserProfile);
router.patch('/update-about', userAuth, updateUserAbout);
router.route('/update-experience').patch(userAuth, updateUserExperience);
router.route('/delete-experience/:exp_id').delete(userAuth, deleteUserExperience);
router.route('/update-education').patch(userAuth, updateUserEducation);
router.route('/delete-education/:edu_id').delete(userAuth, deleteUserEducation);
router.route('/update-skills').patch(userAuth, updateUserSkills);

router.route('/change-email')
    .post(userAuth, changeEmailSendOTP)
    .patch(userAuth, updateEmail);

export default router;
