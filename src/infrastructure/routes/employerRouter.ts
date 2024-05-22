import express from "express";
import employerUseCase from "../../use-case/employerUseCase";
import employerOTPRepo from "../repository/employerOTPRepository";
import GenerateOTP from "../utils/generateOTP";
import NodeMailer from "../utils/nodeMailer";
import employerRepository from "../repository/employerRepository";
import Jwt from "../utils/jwt";
import employerController from "../../adaptor/employerController";
import upload from "../middleware/multer";
import jobsRepository from "../repository/jobsRepository";
import employerAuth from "../middleware/employerAuth";
import jobApplicantsRepository from "../repository/jobApplicantsRepository";
import appliedJobsRepository from "../repository/appliedJobsRepository";
import PostsRepository from "../repository/postsRepository";

const router = express.Router()

const employerotpRepo = new employerOTPRepo()
const jobRepo = new jobsRepository()
const jobApplicantsRepo = new jobApplicantsRepository()
const userAppliedJobsRepo = new appliedJobsRepository()
const postsRepo = new PostsRepository()
const generateOTP = new GenerateOTP()
const mailere = new NodeMailer
const jwt = new Jwt()

const repository = new employerRepository()
const useCase = new employerUseCase(repository,employerotpRepo,jobRepo,generateOTP,mailere,jwt,jobApplicantsRepo,userAppliedJobsRepo,postsRepo)
const controller = new employerController(useCase)

const handleFiles = upload.fields([ { name:'image1' }, { name:'image2' }, { name:'image3' }, { name:'image4' }, { name:'image5' } ])

router.post('/send-otp', (req, res) => controller.sendOTP(req,  res))
router.post('/register', (req, res) => controller.register(req,res))
router.post('/login', (req, res) => controller.logIn(req, res))

router.get('/', (req, res) => controller.fetchEmployerData(req, res))

router.route('/forgot-password')
    .post((req, res) => controller.forgotPasswordSendOTP(req, res))
    .patch((req, res) => controller.resetPassword(req, res))

router.route('/update-profile')
    .put(employerAuth,upload.single("profile-img"), (req, res) => controller.updateProfile(req, res))

router.route('/job')
    .get(employerAuth, (req, res) => controller.fetchJobs(req, res))
    .post(employerAuth, (req, res) => controller.postNewJob(req, res))

router.route('/job/:id')
    .put(employerAuth, (req, res) => controller.editJob(req, res))
    .delete(employerAuth, (req, res) => controller.deleteJob(req, res));

router.route('/post')
    .get(employerAuth, (req, res) => controller.fetchPosts(req, res))
    .post(employerAuth, handleFiles, (req, res) => controller.addPost(req, res))

router.route('/applicants/:employer_id')
    .post(employerAuth, (req, res) => controller.fetchJobApplicants(req, res))
    .patch(employerAuth, (req, res) => controller.updateCandidateStatus(req, res))

export default router