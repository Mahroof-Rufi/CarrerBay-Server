import express, { Router } from "express";
import userAuth from "../../middlewares/userAuth";
import { chatController } from "../../providers/controllers";
import employerAuth from "../../middlewares/employerAuth";

const router = express.Router()

router.post('/user/add-connection', userAuth, (req, res) => chatController.addUserConnection(req, res))
router.get('/user/get-connections', userAuth, (req, res) => chatController.getConnectedUsers(req, res))
router.get('/user/get-messages/:receiver_id', userAuth, (req, res) => chatController.getUserMessagesByReceiverId(req, res))
router.post('/user/save-message', userAuth, (req, res) => chatController.saveMessageByUser(req, res))


router.post('/employer/add-connection', employerAuth, (req, res) => chatController.addEmployerConnection(req, res))
router.get('/employer/get-connections', employerAuth, (req, res) => chatController.getEmployerConnections(req, res))
router.get('/employer/get-user', employerAuth, (req, res) => chatController.getUserById(req, res))
router.get('/employer/get-messages/:receiver_id', employerAuth, (req, res) => chatController.getEmployerMessagesByReceiverId(req, res))
router.post('/employer/save-message', employerAuth, (req, res) => chatController.saveMessageByEmployer(req, res))
router.post('/employer/schedule-interview', employerAuth, (req, res) => chatController.scheduleInterview(req, res))

export default router