"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("../providers/cloudinary"));
class JobApplicantsController {
    constructor(_jobApplicantsUseCase) {
        this._jobApplicantsUseCase = _jobApplicantsUseCase;
    }
    fetchJobApplicants(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job_id = req.body.job_id;
                const result = yield this._jobApplicantsUseCase.fetchJobApplicants(job_id);
                res.status(result.status).json({ message: result.message, appliedUsers: result.appliedUsers });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    applyJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const job_id = req.body.job_id;
                let resume_url;
                const resume = (_a = req.files["resume"]) === null || _a === void 0 ? void 0 : _a[0];
                if (resume) {
                    console.log('before resume upload');
                    const resumeUpload = yield cloudinary_1.default.uploader.upload(resume.path, { resource_type: 'raw' });
                    resume_url = resumeUpload.url;
                    console.log('after resume upload');
                }
                const token = req.header('User-Token');
                if (token) {
                    const result = yield this._jobApplicantsUseCase.applyJobs(token, job_id, resume_url);
                    res.status(result.status).json({ message: result.message, updatedAppliedJobs: result.updatedAppliedJobs });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    updateCandidateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job_id = req.body.job_id;
                const user_id = req.body.user_id;
                const newStatus = req.body.newStatus;
                const result = yield this._jobApplicantsUseCase.updateCandidateStatus(job_id, user_id, newStatus);
                res.status(result.status).json({ message: result.message, updatedData: result.appliedUsers });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    rejectCandidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job_id = req.body.job_id;
                const user_id = req.body.user_id;
                const result = yield this._jobApplicantsUseCase.rejectCandidate(job_id, user_id);
                res.status(result.status).json({ message: result.message, updatedData: result.appliedUsers });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    verifyUserApplication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                const job_id = req.body.job_id;
                if (token) {
                    const result = yield this._jobApplicantsUseCase.verifyUserApplication(token, job_id);
                    res.status(result.status).json({ message: result.message, isApplied: result.isApplied });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    fetchAppliedJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                if (token) {
                    const result = yield this._jobApplicantsUseCase.fetchAppliedJobs(token);
                    res.status(result.status).json({ message: result.message, appliedJobs: result.appliedJobs });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
}
exports.default = JobApplicantsController;
