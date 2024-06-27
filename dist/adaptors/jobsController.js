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
class JobsController {
    constructor(_jobsUseCase) {
        this._jobsUseCase = _jobsUseCase;
    }
    fetchJobById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job_id = req.query.job_id;
                const result = yield this._jobsUseCase.fetchJobById(job_id);
                res.status(result.status).json({ message: result.message, job: result.job });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    fetchJobsByUSer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchQuery = req.query.search;
                const pageNo = req.query.page || '1';
                const sort = req.query.sort;
                const query = req.query;
                const filter = {};
                for (const key in query) {
                    if (query.hasOwnProperty(key) && key !== 'page' && key !== 'sort' && key !== 'search') {
                        const value = query[key];
                        if (value.includes(',')) {
                            const valuesArray = value.split(',');
                            if (valuesArray.every((v) => v === 'true' || v === 'false')) {
                                filter[key] = { $in: valuesArray.map((v) => v === 'true') };
                            }
                            else {
                                filter[key] = { $in: valuesArray };
                            }
                        }
                        else if (value === 'true' || value === 'false') {
                            filter[key] = value === 'true';
                        }
                        else {
                            filter[key] = value;
                        }
                    }
                }
                if (searchQuery && searchQuery != '' && typeof searchQuery == 'string') {
                    const searchedJobs = yield this._jobsUseCase.searchJobs(searchQuery, pageNo, sort, filter);
                    res.status(searchedJobs.status).json({ data: searchedJobs.jobs, totalNoOfJob: searchedJobs.noOfJobs });
                }
                else {
                    const data = yield this._jobsUseCase.fetchJobs(pageNo, sort, filter);
                    res.status(data.status).json({ data: data.jobs, totalNoOfJob: data.totalNoOfJobs });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    fetchJobsByEmployerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employer_id = req.query.employer_id;
                const pageNo = req.query.page;
                const result = yield this._jobsUseCase.fetchJobsByEmployerID(employer_id, pageNo);
                res.status(result.status).json({ message: result.message, employerJobs: result.jobs, totalNoOfJobs: result.noOfJobs });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    fetchJobsByEmployer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('Employer-Token');
                const searchQuery = req.query.search;
                const pageNo = req.query.page || '1';
                const sort = req.query.sort;
                const query = req.query;
                const filter = {};
                for (const key in query) {
                    if (query.hasOwnProperty(key) && key !== 'page' && key !== 'sort' && key !== 'search') {
                        const value = query[key];
                        if (value.includes(',')) {
                            const valuesArray = value.split(',');
                            if (valuesArray.every((v) => v === 'true' || v === 'false')) {
                                filter[key] = { $in: valuesArray.map((v) => v === 'true') };
                            }
                            else {
                                filter[key] = { $in: valuesArray };
                            }
                        }
                        else if (value === 'true' || value === 'false') {
                            filter[key] = value === 'true';
                        }
                        else {
                            filter[key] = value;
                        }
                    }
                }
                // if (filter.isActive === undefined) {
                //     filter.isActive = true;
                // }
                if (token) {
                    if (searchQuery && searchQuery != '' && typeof searchQuery == "string") {
                        const searchedJobs = yield this._jobsUseCase.fetchSearchedJobs(token, pageNo, searchQuery, sort, filter);
                        res.status(searchedJobs.status).json({ jobs: searchedJobs.jobs, noOfJobs: searchedJobs.noOfJobs });
                    }
                    else {
                        const result = yield this._jobsUseCase.fetchJobsByEmployerId(token, pageNo, sort, filter);
                        res.status(result.status).json({ jobs: result.jobs, noOfJobs: result.noOfJobs });
                    }
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    postNewJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobData = Object.assign({}, req.body);
                const token = req.header('Employer-Token');
                if (token) {
                    const response = yield this._jobsUseCase.addNewJobPost(jobData, token);
                    res.status(response.status).json({ message: response.message, job: response.job });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    editJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobData = req.body.newJobData;
                const jobId = req.body.jobId;
                const response = yield this._jobsUseCase.editJobPost(jobId, jobData);
                res.status(response.status).json({ message: response.message, updatedJob: response.job });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    deleteJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = req.params.id;
                const response = yield this._jobsUseCase.deleteJob(jobId);
                res.status(response.status).json({ message: response.message });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    saveJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                const jobId = req.body.job_id;
                if (token) {
                    const result = yield this._jobsUseCase.saveJobPost(token, jobId);
                    res.status(result.status).json({ message: result.message, saved: result.savedJobsAndPosts });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    isJobSaved(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                const jobId = req.body.job_id;
                if (token) {
                    const result = yield this._jobsUseCase.isJobSaved(token, jobId);
                    res.status(result.status).json({ message: result.message, isSaved: result.isSaved });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    unSaveJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                const jobId = req.body.job_id;
                if (token) {
                    const result = yield this._jobsUseCase.unSaveJobPost(token, jobId);
                    res.status(result.status).json({ message: result.message, updatedSavedJobAndPosts: result.updatedSavedJobsAndPosts });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    loadSavedJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const token = req.header('User-Token');
            if (token) {
                const result = yield this._jobsUseCase.loadUserSavedJobs(token);
                res.status(result.status).json({ message: result.message, jobs: (_a = result.savedJobsAndPosts) === null || _a === void 0 ? void 0 : _a.savedJobs });
            }
        });
    }
    closeHiring(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.header('Employer-Token');
            const jobId = req.body.job_id;
            if (token) {
                const result = yield this._jobsUseCase.closeHiring(token, jobId);
                res.status(result.status).json({ message: result.message });
            }
        });
    }
}
exports.default = JobsController;
