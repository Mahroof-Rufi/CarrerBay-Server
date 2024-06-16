import express from "express";
import userAuth from "../../middlewares/userAuth";
import { chatController } from "../../providers/controllers";

const router = express.Router()

router.post('/user/add-connection', userAuth, (req, res) => chatController.addConnection(req, res))
router.get('/user/get-connections', userAuth, (req, res) => chatController.getConnectedUsers(req, res))
router.get('/user/get-messages/:receiver_id', userAuth, (req, res) => chatController.getMessagesByReceiverId(req, res))
router.post('/user/save-message', userAuth, (req, res) => chatController.saveMessage(req, res))

export default router