import express from "express";
import userController from "../../adaptor/userController";
import userUseCase from "../../use-case/userUseCase";
import userRepository from "../repository/userRepo";
import Jwt from "../utils/jwt";
import GenerateOTP from "../utils/generateOTP";
import NodeMailer from "../utils/nodeMailer";
import OtpRepo from "../repository/OTPRepo";

const jwt = new Jwt()
const OTP = new GenerateOTP()
const mailer = new NodeMailer()
const OTPRepo = new OtpRepo()

const router = express.Router()

const repository = new userRepository()
const useCase = new userUseCase(repository,jwt,OTP,mailer,OTPRepo)
const controller = new userController(useCase);

router.post('/send-otp', (req, res) => controller.sendOTP(req,res))
router.post('/login', (req, res) => controller.logIn(req,res))
router.post('/sign_up', (req, res) => controller.signUp(req,res))

export default router