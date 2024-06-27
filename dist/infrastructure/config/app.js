"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRouter_1 = __importDefault(require("../routes/authRouter"));
const userRouter_1 = __importDefault(require("../routes/userRouter"));
const employerRouter_1 = __importDefault(require("../routes/employerRouter"));
const adminRouter_1 = __importDefault(require("../routes/adminRouter"));
const jobsRouter_1 = __importDefault(require("../routes/jobsRouter"));
const postsRouter_1 = __importDefault(require("../routes/postsRouter"));
const jobApplicantsRouter_1 = __importDefault(require("../routes/jobApplicantsRouter"));
const chatRouter_1 = __importDefault(require("../routes/chatRouter"));
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use((0, cors_1.default)({
            origin: process.env.ORIGIN_URL,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true
        }));
        app.use('/api/auth', authRouter_1.default);
        app.use('/api/users', userRouter_1.default);
        app.use('/api/employers', employerRouter_1.default);
        app.use('/api/admin', adminRouter_1.default);
        app.use('/api/jobs', jobsRouter_1.default);
        app.use('/api/posts', postsRouter_1.default);
        app.use('/api/job-applicants', jobApplicantsRouter_1.default);
        app.use('/api/chat', chatRouter_1.default);
        return app;
    }
    catch (error) {
        console.error(error);
    }
};
exports.createServer = createServer;
