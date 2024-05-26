import express from "express";
import { adminController } from "../../providers/controllers";

const router = express.Router()

router.route('/users')
    .get((req, res) => adminController.fetchAllUsers(req, res))
    .patch((req, res) => adminController.userAction(req, res))
router.route('/employers')
    .get((req, res) => adminController.fetchAllEmployers(req, res))
    .patch((req, res) => adminController.employerAction(req, res))

export default router