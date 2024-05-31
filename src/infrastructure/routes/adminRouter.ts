import express from "express";
import { adminController } from "../../providers/controllers";
import adminAuth from "../../middlewares/adminAuth";

const router = express.Router()

router.route('/users')
    .get( adminAuth ,(req, res) => adminController.fetchAllUsers(req, res))
    .patch( adminAuth, (req, res) => adminController.userAction(req, res))
router.route('/employers')
    .get( adminAuth, (req, res) => adminController.fetchAllEmployers(req, res))
    .patch( adminAuth, (req, res) => adminController.employerAction(req, res))

export default router