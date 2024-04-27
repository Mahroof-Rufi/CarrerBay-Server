import nodemailer from "nodemailer";

import mailer from "../../use-case/interface/mailer";

class NodeMailer implements mailer {

    private transporter: nodemailer.Transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
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
            this.transporter.sendMail(mailOption);
            console.log('Email sent successfully');
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