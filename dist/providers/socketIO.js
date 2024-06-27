"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = require("../infrastructure/config/app");
const server = http_1.default.createServer((0, app_1.createServer)());
const socketServer = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
let users = [];
const addUser = (userId, socketId) => {
    const exists = users.find(user => user.userId === userId);
    if (exists) {
        exists.socketId = socketId;
    }
    else {
        users.push({ userId, socketId });
    }
};
const getUser = (userId) => users.find(user => user.userId === userId);
const removeUser = (userId) => users = users.filter(user => user.userId !== userId);
socketServer.on('connection', (socket) => {
    socket.on("add_user", (userId) => {
        addUser(userId, socket.id);
    });
    socket.on("chat:started", ({ to }) => {
        const user = getUser(to);
        if (user) {
            socketServer.to(user.socketId).emit("chat:started");
        }
    });
    socket.on('sendMessage', ({ _id = '', sender, receiver, text = '', type, isMediaFile, createdAt, employer, interviewDate, interviewTime, status }) => {
        try {
            const receiverData = getUser(receiver);
            const senderData = getUser(sender);
            const messageData = {
                _id,
                sender,
                receiver,
                isMediaFile,
                content: text,
                type,
                interviewDetails: {
                    employer: employer,
                    interviewDate,
                    interviewTime,
                    status
                },
                createdAt
            };
            if (receiverData) {
                socketServer.to(receiverData.socketId).emit('message', messageData);
                console.log(`Message sent to receiver: ${receiverData.socketId}`);
            }
            if (senderData) {
                socketServer.to(senderData.socketId).emit('message', messageData);
                console.log(`Message sent to sender: ${senderData.socketId}`);
            }
            else {
                console.log('kkkk');
            }
        }
        catch (error) {
            console.error('Error in sendMessage:', error);
        }
    });
    socket.on('delete-message', ({ deletedMessageId, receiverId }) => {
        try {
            const receiverData = getUser(receiverId);
            if (receiverData) {
                socketServer.to(receiverData.socketId).emit('deleted-message', deletedMessageId);
            }
        }
        catch (error) {
            console.error('Error in sendMessage:', error);
        }
    });
    socket.on("end_session", (receiver) => {
        const user = getUser(receiver);
        users = removeUser(receiver);
        if (user) {
            socketServer.to(user.socketId).emit("exit_from_chat");
        }
    });
    socket.on('disconnect', () => {
        // console.log('User disconnected');
    });
    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
});
exports.default = server;
