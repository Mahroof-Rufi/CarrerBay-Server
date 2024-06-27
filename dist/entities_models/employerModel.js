"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const employerSchema = new mongoose_1.Schema({
    companyName: {
        type: String,
        required: true
    },
    profile_url: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    noOfWorkersRange: {
        type: String,
    },
    web_url: {
        type: String,
    },
    instagram_url: {
        type: String,
    },
    X_url: {
        type: String
    },
    about: {
        type: String
    },
    verificationDocument: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    joinedAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});
const employerModel = (0, mongoose_1.model)('employer', employerSchema);
exports.default = employerModel;
