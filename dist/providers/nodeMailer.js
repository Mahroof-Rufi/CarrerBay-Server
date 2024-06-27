"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class NodeMailer {
    constructor() {
        this._transporter = nodemailer_1.default.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL,
                pass: process.env.PASSWORD
            }
        });
    }
    sendMail(email, otp) {
        let mailOption = {
            from: process.env.GMAIL,
            to: email,
            subject: 'CAREER-BAY \n OTP for email verification',
            text: `Your OTP is :${otp}`
        };
        try {
            this._transporter.sendMail(mailOption);
            return true;
        }
        catch (err) {
            console.error('Error sending email:', err);
            return false;
        }
    }
    sendVerificationMail(id, to) {
        throw new Error("Method not implemented.");
    }
}
exports.default = NodeMailer;
