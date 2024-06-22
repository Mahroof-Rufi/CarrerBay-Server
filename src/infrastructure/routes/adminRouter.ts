import express from "express";
import { adminController } from "../../providers/controllers";
import adminAuth from "../../middlewares/adminAuth";

const router = express.Router()

router.route('/dashboard-stats').get( adminAuth, (req, res) => adminController.fetchDashBoardStatistics(req, res))
router.route('/users')
    .get( adminAuth ,(req, res) => adminController.fetchAllUsers(req, res))
    .patch( adminAuth, (req, res) => adminController.userAction(req, res))

router.route('/user').get( adminAuth, (req, res) => adminController.fetchUserById(req, res))

router.route('/employers')
    .get( adminAuth, (req, res) => adminController.fetchAllEmployers(req, res))
    .patch( adminAuth, (req, res) => adminController.employerAction(req, res))

router.route('/jobs')
    .get( adminAuth, (req,res) => adminController.fetchAllJobs(req, res))
    .patch( adminAuth, (req,res) => adminController.jobAction(req, res))

router.route('/employer')
    .get( adminAuth, (req, res) => adminController.fetchEmployerById(req, res))

export default router