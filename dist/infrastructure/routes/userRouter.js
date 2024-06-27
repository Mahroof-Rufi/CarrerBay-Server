"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = __importDefault(require("../../middlewares/userAuth"));
const multer_1 = __importDefault(require("../../middlewares/multer"));
const controllers_1 = require("../../providers/controllers");
const router = express_1.default.Router();
const handleFiles = multer_1.default.fields([{ name: 'resume-file' }, { name: 'profile-file' }]);
// Route handlers
const fetchUserData = (req, res) => controllers_1.userController.fetchUserData(req, res);
const fetchUserProfileById = (req, res) => controllers_1.userController.fetchUserProfileById(req, res);
const fetchAllUsers = (req, res) => controllers_1.userController.fetchAllUsers(req, res);
const fetchAllEmployers = (req, res) => controllers_1.userController.fetchAllEmployers(req, res);
const getScheduledInterviews = (req, res) => controllers_1.userController.getScheduledInterviews(req, res);
const fetchEmployerProfileById = (req, res) => controllers_1.userController.fetchEmployerProfileById(req, res);
const isUserBlocked = (req, res) => controllers_1.userController.isUserBlocked(req, res);
const updateUserProfile = (req, res) => controllers_1.userController.updateUserProfile(req, res);
const updateUserAbout = (req, res) => controllers_1.userController.updateUserAbout(req, res);
const updateUserExperience = (req, res) => controllers_1.userController.updateUserExperience(req, res);
const deleteUserExperience = (req, res) => controllers_1.userController.deleteUserExperience(req, res);
const updateUserEducation = (req, res) => controllers_1.userController.updateUserEducation(req, res);
const deleteUserEducation = (req, res) => controllers_1.userController.deleteUserEducation(req, res);
const updateUserSkills = (req, res) => controllers_1.userController.updateUserSkills(req, res);
const changeEmailSendOTP = (req, res) => controllers_1.userController.changeEmailSendOTP(req, res);
const updateEmail = (req, res) => controllers_1.userController.updateEmail(req, res);
// Routes
router.route('/')
    .get(userAuth_1.default, fetchUserData)
    .post(userAuth_1.default, fetchUserProfileById);
router.route('/users').get(userAuth_1.default, fetchAllUsers);
router.route('/employers').get(userAuth_1.default, fetchAllEmployers);
router.route('/scheduled-interviews').get(userAuth_1.default, getScheduledInterviews);
router.route('/employer-profile').post(userAuth_1.default, fetchEmployerProfileById);
router.route('/is-blocked').get(userAuth_1.default, isUserBlocked);
router.patch('/update-profile', userAuth_1.default, handleFiles, updateUserProfile);
router.patch('/update-about', userAuth_1.default, updateUserAbout);
router.route('/update-experience').patch(userAuth_1.default, updateUserExperience);
router.route('/delete-experience/:exp_id').delete(userAuth_1.default, deleteUserExperience);
router.route('/update-education').patch(userAuth_1.default, updateUserEducation);
router.route('/delete-education/:edu_id').delete(userAuth_1.default, deleteUserEducation);
router.route('/update-skills').patch(userAuth_1.default, updateUserSkills);
router.route('/change-email')
    .post(userAuth_1.default, changeEmailSendOTP)
    .patch(userAuth_1.default, updateEmail);
exports.default = router;
