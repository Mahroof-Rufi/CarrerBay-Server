"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../providers/controllers");
const adminAuth_1 = __importDefault(require("../../middlewares/adminAuth"));
const router = express_1.default.Router();
// Route handlers
const fetchDashBoardStatistics = (req, res) => controllers_1.adminController.fetchDashBoardStatistics(req, res);
const fetchAllUsers = (req, res) => controllers_1.adminController.fetchAllUsers(req, res);
const userAction = (req, res) => controllers_1.adminController.userAction(req, res);
const fetchUserById = (req, res) => controllers_1.adminController.fetchUserById(req, res);
const fetchAllEmployers = (req, res) => controllers_1.adminController.fetchAllEmployers(req, res);
const employerAction = (req, res) => controllers_1.adminController.employerAction(req, res);
const verifyEmployer = (req, res) => controllers_1.adminController.verifyEmployer(req, res);
const fetchAllJobs = (req, res) => controllers_1.adminController.fetchAllJobs(req, res);
const jobAction = (req, res) => controllers_1.adminController.jobAction(req, res);
const fetchEmployerById = (req, res) => controllers_1.adminController.fetchEmployerById(req, res);
// Routes
router.route('/dashboard-stats')
    .get(adminAuth_1.default, fetchDashBoardStatistics);
router.route('/users')
    .get(adminAuth_1.default, fetchAllUsers)
    .patch(adminAuth_1.default, userAction);
router.route('/user')
    .get(adminAuth_1.default, fetchUserById);
router.route('/employers')
    .get(adminAuth_1.default, fetchAllEmployers)
    .patch(adminAuth_1.default, employerAction);
router.route('/verify-employer')
    .patch(adminAuth_1.default, verifyEmployer);
router.route('/jobs')
    .get(adminAuth_1.default, fetchAllJobs)
    .patch(adminAuth_1.default, jobAction);
router.route('/employer')
    .get(adminAuth_1.default, fetchEmployerById);
exports.default = router;
