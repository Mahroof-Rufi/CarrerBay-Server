import express from 'express'
import { adminController, employerController, userController } from '../../providers/controllers'

const router = express.Router()

// USER AUTH ROUTES
router.post('/user/send-otp', (req, res) => userController.sendOTP(req,res))
router.post('/user/login', (req, res) => userController.logIn(req,res))
router.post('/user/register', (req, res) => userController.signUp(req,res))
router.route('/user/forgot-password',)
    .post((req, res) => userController.forgotPasswordSendOTP(req, res))
    .patch((req, res) => userController.resetPassword(req, res))

// EMPLOYER AUTH ROUTES
router.post('/employer/send-otp', (req, res) => employerController.sendOTP(req,  res))
router.post('/employer/login', (req, res) => employerController.logIn(req, res))
router.post('/employer/register', (req, res) => employerController.register(req,res))
router.route('/employer/forgot-password')
    .post((req, res) => employerController.forgotPasswordSendOTP(req, res))
    .patch((req, res) => employerController.resetPassword(req, res))

// ADMIN AUTH ROUTES
router.post('/admin/login', (req, res) => adminController.login(req, res))


// router.post('/user/g-auth', (req, res) => userController.gAuth(req, res))

export default router