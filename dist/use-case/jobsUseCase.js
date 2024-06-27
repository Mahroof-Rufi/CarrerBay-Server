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
class JobsUseCase {
    constructor(_jwt, _jobRepository, _savedJobsAndPostsRepository) {
        this._jwt = _jwt;
        this._jobRepository = _jobRepository;
        this._savedJobsAndPostsRepository = _savedJobsAndPostsRepository;
    }
    fetchJobs(page, sort, filterQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 12;
            const skip = (parseInt(page) - 1) * limit;
            const jobs = yield this._jobRepository.fetchJobsByUser(skip, limit, sort, filterQuery);
            const noOfJobs = yield this._jobRepository.fetchUserJobsCount(filterQuery);
            return {
                status: 200,
                message: 'Jobs found successfully',
                jobs: jobs,
                totalNoOfJobs: noOfJobs
            };
        });
    }
    fetchJobById(job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield this._jobRepository.fetchJobById(job_id);
            return {
                status: 200,
                message: 'Job found successfully',
                job: job,
            };
        });
    }
    fetchJobsByEmployerID(employer_id, pageNo) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 6;
            const skip = (parseInt(pageNo) - 1) * limit;
            const employerJobs = yield this._jobRepository.fetchEmployerJobsById(employer_id, skip, limit);
            const totalEmployerJobsCount = yield this._jobRepository.fetchNoOfJobsByEmployerId(employer_id);
            return {
                status: 200,
                message: 'Jobs found successfully',
                jobs: employerJobs,
                noOfJobs: totalEmployerJobsCount
            };
        });
    }
    fetchJobsByEmployerId(token, pageNo, sort, filterQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const decode = this._jwt.verifyToken(token, "Employer");
            const limit = 10;
            const skip = (parseInt(pageNo) - 1) * limit;
            const jobs = yield this._jobRepository.fetch8Jobs(skip, limit, sort, '', filterQuery, decode === null || decode === void 0 ? void 0 : decode.id);
            const noOfJobs = yield this._jobRepository.fetchEmployerJobsCount(decode === null || decode === void 0 ? void 0 : decode.id, filterQuery);
            return {
                status: 200,
                message: 'Jobs found successfully',
                jobs: jobs,
                noOfJobs: noOfJobs
            };
        });
    }
    fetchSearchedJobs(token, pageNo, searchQuery, sort, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const decode = this._jwt.verifyToken(token, "Employer");
            const limit = 10;
            const skip = (parseInt(pageNo) - 1) * limit;
            const searchedJobs = yield this._jobRepository.fetchSearchedJobsByCompanyId(decode === null || decode === void 0 ? void 0 : decode.id, skip, limit, searchQuery, sort, filter);
            const noOfJobs = yield this._jobRepository.fetchEmployerJobsCount(decode === null || decode === void 0 ? void 0 : decode.id, filter, searchQuery);
            return {
                status: 200,
                message: 'Searched jobs found successfully',
                jobs: searchedJobs,
                noOfJobs: noOfJobs,
            };
        });
    }
    addNewJobPost(jobData, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decode = this._jwt.verifyToken(token, "Employer");
            jobData.company_id = decode === null || decode === void 0 ? void 0 : decode.id;
            const currentDate = new Date();
            jobData.postedAt = currentDate;
            const job = yield this._jobRepository.insertOneJob(jobData);
            if (job) {
                return {
                    status: 200,
                    message: 'Job Post added successful',
                    job: job
                };
            }
            else {
                return {
                    status: 400,
                    message: 'Something went wrong'
                };
            }
        });
    }
    editJobPost(jobId, jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedJob = yield this._jobRepository.updateJobByID(jobId, jobData);
            if (updatedJob) {
                return {
                    status: 200,
                    message: 'Job Post updated successfully',
                    job: updatedJob
                };
            }
            else {
                return {
                    status: 400,
                    message: 'Something went wrong update job'
                };
            }
        });
    }
    deleteJob(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._jobRepository.deleteJobById(jobId);
            if (res) {
                return {
                    status: 200,
                    message: 'Job deleted successfully'
                };
            }
            else {
                return {
                    status: 401,
                    message: 'Something went wrong'
                };
            }
        });
    }
    searchJobs(query, page, sort, filterQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            filterQuery.jobTitle = { $regex: query, $options: 'i' };
            const limit = 10;
            const skip = (parseInt(page) - 1) * limit;
            const searchedJobs = yield this._jobRepository.fetchSearchedJobs(skip, limit, sort, filterQuery);
            const noOfJobs = yield this._jobRepository.fetchUserJobsCount(filterQuery);
            return {
                status: 200,
                message: 'Searched Jobs found successfully',
                jobs: searchedJobs,
                noOfJobs: noOfJobs
            };
        });
    }
    saveJobPost(token, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "User");
            const res = yield this._savedJobsAndPostsRepository.insertJob(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, jobId);
            if (res) {
                return {
                    status: 200,
                    message: 'Job saved successfully',
                    savedJobsAndPosts: res
                };
            }
            else {
                return {
                    status: 400,
                    message: 'save job failed, try again'
                };
            }
        });
    }
    isJobSaved(token, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "User");
            const res = yield this._savedJobsAndPostsRepository.isJobSaved(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, jobId);
            if (res) {
                return {
                    status: 200,
                    message: 'Job is saved',
                    isSaved: true
                };
            }
            else {
                return {
                    status: 200,
                    message: 'Job is not saved yet',
                    isSaved: false
                };
            }
        });
    }
    unSaveJobPost(token, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "User");
            const res = yield this._savedJobsAndPostsRepository.removeJob(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, jobId);
            if (res) {
                return {
                    status: 200,
                    message: 'Job unsaved successfully',
                    updatedSavedJobsAndPosts: res
                };
            }
            else {
                return {
                    status: 400,
                    message: 'unsave job failed, try again'
                };
            }
        });
    }
    loadUserSavedJobs(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "User");
            const res = yield this._savedJobsAndPostsRepository.findSavedJobs(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
            return {
                status: 200,
                message: 'Jobs found successfully',
                savedJobsAndPosts: res
            };
        });
    }
    closeHiring(token, job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "Employer");
            const res = yield this._jobRepository.closeHiring(job_id);
            if (res) {
                return {
                    status: 200,
                    message: 'Hiring closed successfully'
                };
            }
            else {
                return {
                    status: 400,
                    message: 'Something went wrong on the close hiring'
                };
            }
        });
    }
}
exports.default = JobsUseCase;
