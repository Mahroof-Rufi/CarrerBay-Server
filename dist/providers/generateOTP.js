"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GenerateOTP {
    generateOTP() {
        const otp = Math.floor(100000 + Math.random() * 999999);
        return otp.toString();
    }
}
exports.default = GenerateOTP;
