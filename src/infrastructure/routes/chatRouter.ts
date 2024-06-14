import express from "express";
import userAuth from "../../middlewares/userAuth";
import { chatController } from "../../providers/controllers";

const router = express.Router()

router.get('/user/get-connections', userAuth, (req, res) => chatController.getConnectedUsers(req, res))
// router.get('/user/get-chats', userAuth, (req, res) => chatController.getUserChats(req, res))
router.get('/user/get-messages/:receiver_id', userAuth, (req, res) => chatController.getMessagesByReceiverId(req, res))

export default router