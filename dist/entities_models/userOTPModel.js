"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userOTPSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true
    },
    OTP: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
});
const otpModel = (0, mongoose_1.model)('userOtp', userOTPSchema);
exports.default = otpModel;
