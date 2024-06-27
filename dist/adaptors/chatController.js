"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("../providers/cloudinary"));
class ChatController {
    constructor(_chatUseCase) {
        this._chatUseCase = _chatUseCase;
    }
    addUserConnection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                const connection_id = req.body.connection_id;
                const isUser = req.body.isUser;
                if (token) {
                    const result = yield this._chatUseCase.addConnections(token, connection_id, isUser);
                    res.status(result.status).json({ message: result.message, connections: result.connection });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    getConnectedUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                if (token) {
                    const result = yield this._chatUseCase.getConnectedUsers(token);
                    res.status(result.status).json({ message: result.message, connections: result.connection });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    getUserMessagesByReceiverId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                const receiver_id = req.params.receiver_id;
                if (token) {
                    const result = yield this._chatUseCase.getUserMessagesByReceiverId(token, receiver_id);
                    res.status(result.status).json({ message: result.message, chats: result.chats });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    saveMessageByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = req.header('User-Token');
                const messageData = req.body;
                if (typeof messageData.type == 'undefined')
                    messageData.type = 'text';
                if (token) {
                    const result = yield this._chatUseCase.saveMessageByUser(token, messageData);
                    res.status(result.status).json({ message: result.message, messageId: (_a = result.chat) === null || _a === void 0 ? void 0 : _a._id });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    saveMediaFileByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                const messageData = req.body;
                if (req.file) {
                    const mediaFileUpload = yield cloudinary_1.default.uploader.upload(req.file.path, { resource_type: 'auto' });
                    messageData.isMediaFile = true;
                    const { resource_type, format, mime_type, url } = mediaFileUpload;
                    if (resource_type === 'raw' || format == 'pdf') {
                        messageData.type = 'raw';
                    }
                    else {
                        messageData.type = mediaFileUpload.resource_type;
                    }
                    messageData.content = mediaFileUpload.url;
                }
                if (token) {
                    const result = yield this._chatUseCase.saveMessageByUser(token, messageData);
                    res.status(result.status).json({ message: result.message, mediaFileMessage: result.chat });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    getEmployerConnections(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('Employer-Token');
                if (token) {
                    const result = yield this._chatUseCase.getConnectedUsers(token);
                    res.status(result.status).json({ message: result.message, connections: result.connection });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.query.user_id;
                const result = yield this._chatUseCase.fetchUserById(user_id);
                res.status(result.status).json({ message: result.message, userData: result.user });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    getEmployerMessagesByReceiverId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('Employer-Token');
                const receiver_id = req.params.receiver_id;
                if (token && receiver_id) {
                    const result = yield this._chatUseCase.getEmployerMessagesByReceiverId(token, receiver_id);
                    res.status(result.status).json({ message: result.message, chats: result.chats });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    saveMessageByEmployer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = req.header('Employer-Token');
                const messageData = req.body;
                if (typeof messageData.type == 'undefined')
                    messageData.type = 'text';
                if (token) {
                    const result = yield this._chatUseCase.saveMessageByEmployer(token, messageData);
                    res.status(result.status).json({ message: result.message, messageId: (_a = result.chat) === null || _a === void 0 ? void 0 : _a._id });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    saveMediaFileByEmployer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('Employer-Token');
                const messageData = req.body;
                if (req.file) {
                    const mediaFileUpload = yield cloudinary_1.default.uploader.upload(req.file.path, { resource_type: 'auto' });
                    messageData.isMediaFile = true;
                    const { resource_type, format, mime_type, url } = mediaFileUpload;
                    if (resource_type === 'raw' || format == 'pdf') {
                        messageData.type = 'raw';
                    }
                    else {
                        messageData.type = mediaFileUpload.resource_type;
                    }
                    messageData.content = mediaFileUpload.url;
                }
                if (token) {
                    const result = yield this._chatUseCase.saveMessageByEmployer(token, messageData);
                    res.status(result.status).json({ message: result.message, mediaFileMessage: result.chat });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    addEmployerConnection(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('Employer-Token');
                const connection_id = req.body.connection_id;
                if (token) {
                    const result = yield this._chatUseCase.addConnections(token, connection_id);
                    res.status(result.status).json({ message: result.message, connections: result.connection });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    scheduleInterview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('Employer-Token');
                const { receiver, date, time, message_id } = req.body;
                if (token) {
                    const result = yield this._chatUseCase.scheduleInterview(token, receiver, date, time, message_id);
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    cancelScheduleInterview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message_id = req.body.message_id;
                const result = yield this._chatUseCase.cancelScheduledInterview(message_id);
                res.status(result.status).json({ message: result.message, chat: result.chat });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    deleteMessageById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message_id = req.params.messageId;
                const result = yield this._chatUseCase.deleteMessageById(message_id);
                res.status(result.status).json({ message: result.message, deletedMessage: result.chat });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
}
exports.default = ChatController;
