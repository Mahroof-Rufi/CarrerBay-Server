import express from "express";
import employerUseCase from "../../use-case/employerUseCase";
import employerOTPRepo from "../repository/employerOTPRepository";
import GenerateOTP from "../utils/generateOTP";
import NodeMailer from "../utils/nodeMailer";
import employerRepository from "../repository/employerRepository";
import Jwt from "../utils/jwt";
import employerController from "../../adaptor/employerController";

const router = express.Router()

const employerotpRepo = new employerOTPRepo()
const generateOTP = new GenerateOTP()
const mailere = new NodeMailer
const jwt = new Jwt()

const repository = new employerRepository
const useCase = new employerUseCase(repository,employerotpRepo,generateOTP,mailere,jwt)
const controller = new employerController(useCase)

router.post('/send-otp', (req, res) => controller.sendOTP(req,  res))
router.post('/register', (req, res) => controller.register(req,res))
router.post('/login', (req, res) => controller.logIn(req, res))
router.route('/forgot-password')
    .post((req, res) => controller.forgotPasswordSendOTP(req, res))
    .patch((req, res) => controller.resetPassword(req, res))

export default router