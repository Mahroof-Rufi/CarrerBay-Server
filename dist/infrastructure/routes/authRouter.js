"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../providers/controllers");
const multer_1 = __importDefault(require("../../middlewares/multer"));
const router = express_1.default.Router();
const verificationDocumentHandler = multer_1.default.single('verificationDocument');
// User Auth route handlers
const handleUserSendOTP = (req, res) => controllers_1.userController.sendOTP(req, res);
const handleUserLogin = (req, res) => controllers_1.userController.logIn(req, res);
const handleUserRefreshToken = (req, res) => controllers_1.userController.refreshToken(req, res);
const handleUserRegister = (req, res) => controllers_1.userController.signUp(req, res);
const handleUserForgotPasswordSendOTP = (req, res) => controllers_1.userController.forgotPasswordSendOTP(req, res);
const handleUserResetPassword = (req, res) => controllers_1.userController.resetPassword(req, res);
// Employer Auth route handlers
const handleEmployerSendOTP = (req, res) => controllers_1.employerController.sendOTP(req, res);
const handleEmployerLogin = (req, res) => controllers_1.employerController.logIn(req, res);
const handleEmployerRefreshToken = (req, res) => controllers_1.employerController.refreshToken(req, res);
const handleEmployerRegister = (req, res) => controllers_1.employerController.register(req, res);
const handleEmployerForgotPasswordSendOTP = (req, res) => controllers_1.employerController.forgotPasswordSendOTP(req, res);
const handleEmployerResetPassword = (req, res) => controllers_1.employerController.resetPassword(req, res);
// Admin Auth route handlers
const handleAdminRefreshToken = (req, res) => controllers_1.adminController.refreshToken(req, res);
const handleAdminLogin = (req, res) => controllers_1.adminController.login(req, res);
// User Auth Routes
router.post('/user/send-otp', handleUserSendOTP);
router.post('/user/login', handleUserLogin);
router.post('/user/refresh-token', handleUserRefreshToken);
router.post('/user/register', handleUserRegister);
router.route('/user/forgot-password')
    .post(handleUserForgotPasswordSendOTP)
    .patch(handleUserResetPassword);
// Employer Auth Routes
router.post('/employer/send-otp', handleEmployerSendOTP);
router.post('/employer/login', handleEmployerLogin);
router.post('/employer/refresh-token', handleEmployerRefreshToken);
router.post('/employer/register', verificationDocumentHandler, handleEmployerRegister);
router.route('/employer/forgot-password')
    .post(handleEmployerForgotPasswordSendOTP)
    .patch(handleEmployerResetPassword);
// Admin Auth Routes
router.post('/admin/refresh-token', handleAdminRefreshToken);
router.post('/admin/login', handleAdminLogin);
exports.default = router;
