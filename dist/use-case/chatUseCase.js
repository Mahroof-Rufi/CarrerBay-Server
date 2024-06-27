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
Object.defineProperty(exports, "__esModule", { value: true });
class ChatUseCase {
    constructor(_chatRepo, _userRepo, _jwt) {
        this._chatRepo = _chatRepo;
        this._userRepo = _userRepo;
        this._jwt = _jwt;
    }
    addConnections(token, connection_id, isUser) {
        return __awaiter(this, void 0, void 0, function* () {
            let decodedToken;
            if (typeof isUser != undefined) {
                decodedToken = yield this._jwt.verifyToken(token, "User");
            }
            else {
                decodedToken = yield this._jwt.verifyToken(token, "Employer");
            }
            const connections = yield this._chatRepo.addConnection(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, connection_id, isUser);
            return {
                status: 200,
                message: 'Connections added successfully',
                connection: connections
            };
        });
    }
    getConnectedUsers(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = yield this._jwt.verifyToken(token, "User");
            const connectedUsers = yield this._chatRepo.getConnectedUsers(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, "User");
            return {
                status: 200,
                message: 'Connections found successfully',
                connection: connectedUsers
            };
        });
    }
    getUserMessagesByReceiverId(token, receiver_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = yield this._jwt.verifyToken(token, "User");
            const chats = yield this._chatRepo.getMessagesByUserIdAndReceiverId(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, receiver_id);
            return {
                status: 200,
                message: 'chats found successfully',
                chats: chats
            };
        });
    }
    saveMessageByUser(token, messageData) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = yield this._jwt.verifyToken(token, "User");
            const message = yield this._chatRepo.saveMessage(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, messageData);
            if (message) {
                return {
                    status: 200,
                    message: 'message saved successfully',
                    chat: message
                };
            }
            else {
                return {
                    status: 400,
                    message: 'something went wrong',
                };
            }
        });
    }
    saveMessageByEmployer(token, messageData) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = yield this._jwt.verifyToken(token, "Employer");
            const message = yield this._chatRepo.saveMessage(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, messageData);
            if (message) {
                return {
                    status: 200,
                    message: 'message saved successfully',
                    chat: message
                };
            }
            else {
                return {
                    status: 400,
                    message: 'something went wrong',
                };
            }
        });
    }
    getEmployerConnections(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = yield this._jwt.verifyToken(token, "Employer");
            const connections = yield this._chatRepo.getConnectedUsers(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, "Employer");
            return {
                status: 200,
                message: 'Connections found successfully',
                connection: connections
            };
        });
    }
    fetchUserById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this._userRepo.findById(user_id);
            if (userData) {
                return {
                    status: 200,
                    message: 'User found successfully',
                    user: userData
                };
            }
            else {
                return {
                    status: 400,
                    message: 'User not found',
                };
            }
        });
    }
    getEmployerMessagesByReceiverId(token, receiver_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = yield this._jwt.verifyToken(token, "Employer");
            const chats = yield this._chatRepo.getMessagesByUserIdAndReceiverId(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, receiver_id);
            return {
                status: 200,
                message: 'chats found successfully',
                chats: chats
            };
        });
    }
    scheduleInterview(token, receiver_id, date, time, message_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = yield this._jwt.verifyToken(token, "Employer");
            const scheduledInterview = yield this._chatRepo.saveInterviewSchedule(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, receiver_id, date, time, message_id);
            if (scheduledInterview) {
                return {
                    status: 200,
                    message: 'Interview scheduled successfully'
                };
            }
            else {
                return {
                    status: 400,
                    message: 'Interview schedule failed'
                };
            }
        });
    }
    cancelScheduledInterview(message_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cancelledInterview = yield this._chatRepo.cancelInterview(message_id);
            if (cancelledInterview) {
                return {
                    status: 200,
                    message: 'Interview cancellation successful',
                    chat: cancelledInterview,
                };
            }
            else {
                return {
                    status: 400,
                    message: 'Something went wrong'
                };
            }
        });
    }
    deleteMessageById(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedMessage = yield this._chatRepo.deleteMessageById(messageId);
            if (deletedMessage) {
                return {
                    status: 200,
                    message: 'Delete message successfully',
                    chat: deletedMessage,
                };
            }
            else {
                return {
                    status: 400,
                    message: 'Message not found'
                };
            }
        });
    }
}
exports.default = ChatUseCase;
