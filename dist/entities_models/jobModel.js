"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const employerModel_1 = __importDefault(require("./employerModel"));
const jobSchema = new mongoose_1.Schema({
    company_id: {
        type: String,
        ref: employerModel_1.default,
        required: true
    },
    jobTitle: {
        type: String,
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
    jobType: {
        type: String,
        required: true
    },
    minimumPay: {
        type: Number,
        required: true
    },
    maximumPay: {
        type: Number,
        required: true
    },
    payType: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true
    },
    workShift: {
        type: String,
        required: true
    },
    overView: {
        type: String,
        required: true
    },
    responsibilities: {
        type: [String],
        required: true
    },
    qualifications: {
        type: [String],
        required: true
    },
    postedAt: {
        type: Date,
        required: true
    },
    isClosed: {
        type: Boolean,
        required: true,
        default: false
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    applicants: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'user' }]
});
const jobModel = (0, mongoose_1.model)('job', jobSchema);
exports.default = jobModel;
