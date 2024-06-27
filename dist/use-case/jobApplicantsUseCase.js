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
Object.defineProperty(exports, "__esModule", { value: true });
class JobApplicantsUseCase {
    constructor(_jobApplicantsRepository, _userAppliedJobs, _jwt) {
        this._jobApplicantsRepository = _jobApplicantsRepository;
        this._userAppliedJobs = _userAppliedJobs;
        this._jwt = _jwt;
    }
    fetchJobApplicants(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._jobApplicantsRepository.findOne(jobId);
            if (res) {
                return {
                    status: 200,
                    appliedUsers: res,
                    message: 'applied users found successfully'
                };
            }
            else {
                return {
                    status: 200,
                    message: 'applied users not found'
                };
            }
        });
    }
    updateCandidateStatus(jobId, user_id, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._jobApplicantsRepository.updateCandidateStatus(jobId, user_id, newStatus);
            const updateUserSide = yield this._userAppliedJobs.updateJobStatusById(user_id, jobId, newStatus);
            if (res && updateUserSide) {
                return {
                    status: 200,
                    message: 'Candidate status update successful',
                    appliedUsers: res
                };
            }
            else {
                return {
                    status: 404,
                    message: 'Candidate not found'
                };
            }
        });
    }
    rejectCandidate(job_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._jobApplicantsRepository.rejectCandidateStatus(job_id, user_id);
            const updateUserSide = yield this._userAppliedJobs.rejectApplication(user_id, job_id);
            if (res && updateUserSide) {
                return {
                    status: 200,
                    message: 'Candidate application rejected successful',
                    appliedUsers: res
                };
            }
            else {
                return {
                    status: 404,
                    message: 'Candidate not found'
                };
            }
        });
    }
    applyJobs(token, jobId, resume_url) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "User");
            const res = yield this._userAppliedJobs.addAppliedJob(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, jobId);
            if (!res) {
                return {
                    status: 404,
                    message: 'User not found'
                };
            }
            else {
                const job = yield this._jobApplicantsRepository.addAppliedUser(jobId, decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, resume_url);
                if (!job) {
                    return {
                        status: 404,
                        message: 'Job not found'
                    };
                }
                return {
                    status: 201,
                    message: 'Job application send successful',
                    updatedAppliedJobs: res
                };
            }
        });
    }
    verifyUserApplication(token, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "Employer");
            const jobApplicants = yield this._jobApplicantsRepository.findOneCandidate(jobId, decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
            if (jobApplicants) {
                if (jobApplicants) {
                    return {
                        status: 200,
                        isApplied: true,
                        message: 'user application exists'
                    };
                }
                else {
                    return {
                        status: 200,
                        isApplied: false,
                        message: 'user application not found'
                    };
                }
            }
            return {
                status: 200,
                isApplied: false,
                message: 'Job not found'
            };
        });
    }
    fetchAppliedJobs(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "User");
            const appliedJobs = yield this._userAppliedJobs.findOneById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
            if (!appliedJobs) {
                return {
                    status: 200,
                    message: 'Applied jobs not found'
                };
            }
            return {
                status: 200,
                appliedJobs: appliedJobs,
                message: 'Applied jobs found'
            };
        });
    }
}
exports.default = JobApplicantsUseCase;
