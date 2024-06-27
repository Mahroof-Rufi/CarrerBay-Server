import express, { Router, Request, Response } from "express";
import userAuth from "../../middlewares/userAuth";
import employerAuth from "../../middlewares/employerAuth";
import upload from "../../middlewares/multer";
import { chatController } from "../../providers/controllers";

const router = express.Router();
const mediaFileHandler = upload.single('mediaFile');

// User Chat route handlers
const handleAddUserConnection = (req: Request, res: Response) => chatController.addUserConnection(req, res);
const handleGetUserConnections = (req: Request, res: Response) => chatController.getConnectedUsers(req, res);
const handleGetUserMessagesByReceiverId = (req: Request, res: Response) => chatController.getUserMessagesByReceiverId(req, res);
const handleSaveMessageByUser = (req: Request, res: Response) => chatController.saveMessageByUser(req, res);
const handleSaveMediaFileByUser = (req: Request, res: Response) => chatController.saveMediaFileByUser(req, res);
const handleDeleteMessageById = (req: Request, res: Response) => chatController.deleteMessageById(req, res);

// Employer Chat route handlers
const handleAddEmployerConnection = (req: Request, res: Response) => chatController.addEmployerConnection(req, res);
const handleGetEmployerConnections = (req: Request, res: Response) => chatController.getEmployerConnections(req, res);
const handleGetUserById = (req: Request, res: Response) => chatController.getUserById(req, res);
const handleGetEmployerMessagesByReceiverId = (req: Request, res: Response) => chatController.getEmployerMessagesByReceiverId(req, res);
const handleSaveMessageByEmployer = (req: Request, res: Response) => chatController.saveMessageByEmployer(req, res);
const handleSaveMediaFileByEmployer = (req: Request, res: Response) => chatController.saveMediaFileByEmployer(req, res);
const handleScheduleInterview = (req: Request, res: Response) => chatController.scheduleInterview(req, res);
const handleCancelScheduleInterview = (req: Request, res: Response) => chatController.cancelScheduleInterview(req, res);

// User Chat Routes
router.post('/user/add-connection', userAuth, handleAddUserConnection);
router.get('/user/get-connections', userAuth, handleGetUserConnections);
router.get('/user/get-messages/:receiver_id', userAuth, handleGetUserMessagesByReceiverId);
router.post('/user/save-message', userAuth, handleSaveMessageByUser);
router.post('/user/save-mediaFile', userAuth, mediaFileHandler, handleSaveMediaFileByUser);
router.delete('/user/delete-message/:messageId', userAuth, handleDeleteMessageById);

// Employer Chat Routes
router.post('/employer/add-connection', employerAuth, handleAddEmployerConnection);
router.get('/employer/get-connections', employerAuth, handleGetEmployerConnections);
router.get('/employer/get-user', employerAuth, handleGetUserById);
router.get('/employer/get-messages/:receiver_id', employerAuth, handleGetEmployerMessagesByReceiverId);
router.post('/employer/save-message', employerAuth, handleSaveMessageByEmployer);
router.post('/employer/save-mediaFile', employerAuth, mediaFileHandler, handleSaveMediaFileByEmployer);
router.route('/employer/schedule-interview')
    .post(employerAuth, handleScheduleInterview)
    .patch(employerAuth, handleCancelScheduleInterview);
router.delete('/employer/delete-message/:messageId', employerAuth, handleDeleteMessageById);

export default router;
