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
const chatModel_1 = __importDefault(require("../../entities_models/chatModel"));
const connectionModel_1 = __importDefault(require("../../entities_models/connectionModel"));
class ChatRepository {
    addConnection(user_id, connection_id, isUser) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let update;
                if (typeof isUser != 'undefined') {
                    update = isUser
                        ? { $addToSet: { 'connections.users': connection_id } }
                        : { $addToSet: { 'connections.employers': connection_id } };
                }
                else {
                    update = { $addToSet: { 'connections.users': connection_id } };
                }
                const connections = yield connectionModel_1.default.findOneAndUpdate({ user_id: user_id }, update, { upsert: true, new: true })
                    .populate('connections.users')
                    .populate('connections.employers');
                if (typeof isUser != 'undefined') {
                    yield connectionModel_1.default.findOneAndUpdate({ user_id: connection_id }, { $addToSet: { 'connections.users': user_id } }, { upsert: true, new: true });
                }
                else {
                    yield connectionModel_1.default.findOneAndUpdate({ user_id: connection_id }, { $addToSet: { 'connections.employers': user_id } }, { upsert: true, new: true });
                }
                return connections || null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getConnectedUsers(user_id, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (context == 'User') {
                    const connections = yield connectionModel_1.default.findOne({ user_id: user_id }, { _id: 0, user_id: 0 })
                        .populate('connections.users')
                        .populate('connections.employers');
                    return connections || null;
                }
                else if (context == 'Employer') {
                    const connections = yield connectionModel_1.default.findOne({ user_id: user_id }, { _id: 0, user_id: 0 })
                        .populate('connections.users');
                    return connections || null;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getMessagesByUserIdAndReceiverId(user_id, receiver_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chats = yield chatModel_1.default.find({
                    $or: [
                        { sender: user_id, receiver: receiver_id },
                        { sender: receiver_id, receiver: user_id }
                    ]
                }).sort({ timestamp: 1 }).populate('interviewDetails.employer');
                return chats || null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    saveMessage(user_id, messageData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                messageData.sender = user_id;
                const message = new chatModel_1.default(messageData);
                yield message.save();
                return message;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    saveInterviewSchedule(employer_id, receiver_id, date, time, message_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (message_id) {
                    const scheduleData = {
                        employer: employer_id,
                        interviewDate: date,
                        interviewTime: time,
                        status: 'scheduled'
                    };
                    const interviewSchedule = yield chatModel_1.default.findByIdAndUpdate({ _id: message_id }, { sender: employer_id, receiver: receiver_id, type: 'interview', interviewDetails: scheduleData });
                    return interviewSchedule || null;
                }
                else {
                    const scheduleData = {
                        employer: employer_id,
                        interviewDate: date,
                        interviewTime: time,
                        status: 'scheduled'
                    };
                    const interviewSchedule = new chatModel_1.default({ sender: employer_id, receiver: receiver_id, type: 'interview', interviewDetails: scheduleData });
                    yield interviewSchedule.save();
                    return interviewSchedule;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    findScheduledInterviews(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const scheduledInterviews = yield chatModel_1.default.find({ receiver: user_id, type: 'interview' }).populate('interviewDetails.employer');
                return scheduledInterviews || null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    cancelInterview(message_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cancelledInterview = yield chatModel_1.default.findByIdAndUpdate({ _id: message_id }, { 'interviewDetails.status': 'canceled' }, { new: true }).populate('interviewDetails.employer');
                return cancelledInterview || null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    deleteMessageById(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedMessage = yield chatModel_1.default.findOneAndDelete({ _id: messageId });
                return deletedMessage || null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = ChatRepository;
