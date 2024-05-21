import express from "express";
import userController from "../../adaptor/userController";
import userUseCase from "../../use-case/userUseCase";
import userRepository from "../repository/userRepository";
import Jwt from "../utils/jwt";
import GenerateOTP from "../utils/generateOTP";
import NodeMailer from "../utils/nodeMailer";
import OtpRepo from "../repository/userOTPRepository";
import jobsRepository from "../repository/jobsRepository";
import userAuth from "../middleware/userAuth";
import upload from "../middleware/multer";
import appliedJobsRepository from "../repository/appliedJobsRepository";
import jobApplicantsRepository from "../repository/jobApplicantsRepository";
import PostsRepository from "../repository/postsRepository";

const jwt = new Jwt()
const OTP = new GenerateOTP()
const mailer = new NodeMailer()
const OTPRepo = new OtpRepo()
const jobsRepo = new jobsRepository()
const appliedJobsRepo = new appliedJobsRepository()
const jobApplicantsRepo = new jobApplicantsRepository()
const postsRepo = new PostsRepository()

const router = express.Router()

const repository = new userRepository()
const useCase = new userUseCase(repository,jwt,OTP,mailer,OTPRepo,jobsRepo,appliedJobsRepo,jobApplicantsRepo,postsRepo)
const controller = new userController(useCase);

const handleFiles = upload.fields([ { name:'resume-file' }, { name:'profile-file' } ])

router.route('/changeEmail')
    .post(userAuth, (req, res) => controller.changeEmailSendOTP(req, res))
    .patch(userAuth, (req, res) => controller.updateEmail(req, res))

router.route('/:user_id')
    .patch(userAuth, handleFiles, (req, res) => controller.updateUserProfile(req, res));

router.route('/jobs')
    .get(userAuth, (req, res) => controller.fetchJobs(req, res));

router.route('/posts')
    .get(userAuth, (req, res) => controller.fetchPosts(req, res))
    
router.route('/user')
    .get(userAuth,(req, res) => controller.fetchUserdata(req, res));

router.route('/update-experience/:user_id')
    .patch(userAuth, (req, res) => controller.updateUserExperience(req, res));

router.route('/delete-experience/:exp_id')
    .delete(userAuth, (req, res) => controller.deleteUserExperience(req, res));
    
router.route('/delete-education/:edu_id')
    .delete(userAuth, (req, res) => controller.deleteUserEducation(req, res));

router.route('/update-education/:user_id')
    .patch(userAuth, (req, res) => controller.updateUserEducation(req, res));

router.route('/update-skills/:user_id')
    .patch(userAuth, (req, res) => controller.updateUserSkills(req, res));

router.route('/apply-job/:user_id')
    .get(userAuth, (req, res) => controller.fetchAppliedJobs(req, res))
    .patch(userAuth, (req, res) => controller.applyJob(req, res));

router.route('/verify-application/:user_id')
    .post(userAuth, (req, res) => controller.verifyUserApplication(req, res))
    

router.post('/send-otp', (req, res) => controller.sendOTP(req,res))
router.post('/login', (req, res) => controller.logIn(req,res))
router.post('/sign_up', (req, res) => controller.signUp(req,res))
router.post('/g-auth', (req, res) => controller.gAuth(req, res))
router.route('/forgot-password',)
    .post((req, res) => controller.forgotPasswordSendOTP(req, res))
    .patch((req, res) => controller.resetPassword(req, res))
 
export default router