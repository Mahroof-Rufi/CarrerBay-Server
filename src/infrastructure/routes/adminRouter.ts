import express from "express";
import { adminController } from "../../providers/controllers";
import adminAuth from "../../middlewares/adminAuth";
import { Request, Response } from "express-serve-static-core";

const router = express.Router();

// Route handlers
const fetchDashBoardStatistics = (req:Request, res:Response) => adminController.fetchDashBoardStatistics(req, res);
const fetchAllUsers = (req:Request, res:Response) => adminController.fetchAllUsers(req, res);
const userAction = (req:Request, res:Response) => adminController.userAction(req, res);
const fetchUserById = (req:Request, res:Response) => adminController.fetchUserById(req, res);
const fetchAllEmployers = (req:Request, res:Response) => adminController.fetchAllEmployers(req, res);
const employerAction = (req:Request, res:Response) => adminController.employerAction(req, res);
const verifyEmployer = (req:Request, res:Response) => adminController.verifyEmployer(req, res);
const fetchAllJobs = (req:Request, res:Response) => adminController.fetchAllJobs(req, res);
const jobAction = (req:Request, res:Response) => adminController.jobAction(req, res);
const fetchEmployerById = (req:Request, res:Response) => adminController.fetchEmployerById(req, res);

// Routes
router.route('/dashboard-stats')
    .get(adminAuth, fetchDashBoardStatistics);

router.route('/users')
    .get(adminAuth, fetchAllUsers)
    .patch(adminAuth, userAction);

router.route('/user')
    .get(adminAuth, fetchUserById);

router.route('/employers')
    .get(adminAuth, fetchAllEmployers)
    .patch(adminAuth, employerAction);

router.route('/verify-employer')
    .patch(adminAuth, verifyEmployer);

router.route('/jobs')
    .get(adminAuth, fetchAllJobs)
    .patch(adminAuth, jobAction);

router.route('/employer')
    .get(adminAuth, fetchEmployerById);

export default router;
