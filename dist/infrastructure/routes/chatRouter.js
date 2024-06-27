"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = __importDefault(require("../../middlewares/userAuth"));
const employerAuth_1 = __importDefault(require("../../middlewares/employerAuth"));
const multer_1 = __importDefault(require("../../middlewares/multer"));
const controllers_1 = require("../../providers/controllers");
const router = express_1.default.Router();
const mediaFileHandler = multer_1.default.single('mediaFile');
// User Chat route handlers
const handleAddUserConnection = (req, res) => controllers_1.chatController.addUserConnection(req, res);
const handleGetUserConnections = (req, res) => controllers_1.chatController.getConnectedUsers(req, res);
const handleGetUserMessagesByReceiverId = (req, res) => controllers_1.chatController.getUserMessagesByReceiverId(req, res);
const handleSaveMessageByUser = (req, res) => controllers_1.chatController.saveMessageByUser(req, res);
const handleSaveMediaFileByUser = (req, res) => controllers_1.chatController.saveMediaFileByUser(req, res);
const handleDeleteMessageById = (req, res) => controllers_1.chatController.deleteMessageById(req, res);
// Employer Chat route handlers
const handleAddEmployerConnection = (req, res) => controllers_1.chatController.addEmployerConnection(req, res);
const handleGetEmployerConnections = (req, res) => controllers_1.chatController.getEmployerConnections(req, res);
const handleGetUserById = (req, res) => controllers_1.chatController.getUserById(req, res);
const handleGetEmployerMessagesByReceiverId = (req, res) => controllers_1.chatController.getEmployerMessagesByReceiverId(req, res);
const handleSaveMessageByEmployer = (req, res) => controllers_1.chatController.saveMessageByEmployer(req, res);
const handleSaveMediaFileByEmployer = (req, res) => controllers_1.chatController.saveMediaFileByEmployer(req, res);
const handleScheduleInterview = (req, res) => controllers_1.chatController.scheduleInterview(req, res);
const handleCancelScheduleInterview = (req, res) => controllers_1.chatController.cancelScheduleInterview(req, res);
// User Chat Routes
router.post('/user/add-connection', userAuth_1.default, handleAddUserConnection);
router.get('/user/get-connections', userAuth_1.default, handleGetUserConnections);
router.get('/user/get-messages/:receiver_id', userAuth_1.default, handleGetUserMessagesByReceiverId);
router.post('/user/save-message', userAuth_1.default, handleSaveMessageByUser);
router.post('/user/save-mediaFile', userAuth_1.default, mediaFileHandler, handleSaveMediaFileByUser);
router.delete('/user/delete-message/:messageId', userAuth_1.default, handleDeleteMessageById);
// Employer Chat Routes
router.post('/employer/add-connection', employerAuth_1.default, handleAddEmployerConnection);
router.get('/employer/get-connections', employerAuth_1.default, handleGetEmployerConnections);
router.get('/employer/get-user', employerAuth_1.default, handleGetUserById);
router.get('/employer/get-messages/:receiver_id', employerAuth_1.default, handleGetEmployerMessagesByReceiverId);
router.post('/employer/save-message', employerAuth_1.default, handleSaveMessageByEmployer);
router.post('/employer/save-mediaFile', employerAuth_1.default, mediaFileHandler, handleSaveMediaFileByEmployer);
router.route('/employer/schedule-interview')
    .post(employerAuth_1.default, handleScheduleInterview)
    .patch(employerAuth_1.default, handleCancelScheduleInterview);
router.delete('/employer/delete-message/:messageId', employerAuth_1.default, handleDeleteMessageById);
exports.default = router;
