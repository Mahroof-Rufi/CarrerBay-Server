import express from "express";
import { adminController } from "../../providers/controllers";

const router = express.Router()

router.route('/users')
    .patch((req, res) => adminController.userAction(req, res))
router.route('/companies')
    .patch((req, res) => adminController.employerAction(req, res))

export default router