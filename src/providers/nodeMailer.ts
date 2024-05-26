import nodemailer from "nodemailer";

import mailer from "../interfaces/mailerInterface";

class NodeMailer implements mailer {

    private readonly _transporter: nodemailer.Transporter

    constructor() {
        this._transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL,
                pass: process.env.PASSWORD
            }
        });
    }

    sendMail(email: string, otp: number): boolean {
        let mailOption = {
            from: process.env.GMAIL,
            to: email,
            subject: 'CAREER-BAY \n OTP for email verification',
            text: `Your OTP is :${otp}`
        };
    
        try {
            this._transporter.sendMail(mailOption);
            return true;
        } catch (err) {
            console.error('Error sending email:', err);
            return false;
        }
    }

    sendVerificationMail(id: any, to: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
}

export default NodeMailer