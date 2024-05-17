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

const jwt = new Jwt()
const OTP = new GenerateOTP()
const mailer = new NodeMailer()
const OTPRepo = new OtpRepo()
const jobsRepo = new jobsRepository()

const router = express.Router()

const repository = new userRepository()
const useCase = new userUseCase(repository,jwt,OTP,mailer,OTPRepo,jobsRepo)
const controller = new userController(useCase);

const handleFiles = upload.fields([ { name:'resume-file' }, { name:'profile-file' } ])

router.route('/:user_id')
    .patch(userAuth, handleFiles, (req, res) => controller.updateUserProfile(req, res));

router.route('/jobs')
    .get(userAuth, (req, res) => controller.fetchJobs(req, res));
    
router.route('/user')
    .get(userAuth,(req, res) => controller.fetchUserdata(req, res));

router.route('/update-experience/:user_id')
    .patch(userAuth, (req, res) => controller.updateUserExperience(req, res));

router.route('/update-education/:user_id')
    .patch(userAuth, (req, res) => controller.updateUserEducation(req, res));

router.post('/send-otp', (req, res) => controller.sendOTP(req,res))
router.post('/login', (req, res) => controller.logIn(req,res))
router.post('/sign_up', (req, res) => controller.signUp(req,res))
router.post('/g-auth', (req, res) => controller.gAuth(req, res))
router.route('/forgot-password',)
    .post((req, res) => controller.forgotPasswordSendOTP(req, res))
    .patch((req, res) => controller.resetPassword(req, res))
 
export default router