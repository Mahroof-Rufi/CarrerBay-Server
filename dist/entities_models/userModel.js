"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const experienceSchema = new mongoose_1.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    present: {
        type: Boolean,
        required: true
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    remort: {
        type: Boolean,
        required: true
    },
    overView: {
        type: String,
        required: true
    },
    technologies: {
        type: [String],
        required: true
    }
});
const educationSchema = new mongoose_1.Schema({
    universityName: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    present: {
        type: Boolean,
        required: true
    },
    city: {
        type: String,
    },
    state: {
        type: String
    },
    distance: {
        type: Boolean,
        required: true
    }
});
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    profile_url: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
    },
    industry: {
        type: String,
    },
    DOB: {
        type: Date,
    },
    gender: {
        type: String,
    },
    about: {
        type: String,
    },
    google_id: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    gitHub_url: {
        type: String
    },
    portfolio_url: {
        type: String
    },
    resume_url: {
        type: String
    },
    experiences: {
        type: [experienceSchema]
    },
    educations: {
        type: [educationSchema]
    },
    skills: {
        type: [String],
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
const userModel = (0, mongoose_1.model)('user', userSchema);
exports.default = userModel;
