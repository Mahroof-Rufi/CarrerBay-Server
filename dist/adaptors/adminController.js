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
class AdminController {
    constructor(_adminUseCase) {
        this._adminUseCase = _adminUseCase;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const admin = yield this._adminUseCase.login(email, password);
                if (admin && admin.accessToken && admin.refreshToken) {
                    return res.status(200)
                        .json({
                        admin,
                    });
                }
                else {
                    return res
                        .status(400)
                        .json({
                        admin,
                    });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.body.refreshToken;
                if (token) {
                    const result = yield this._adminUseCase.refreshToken(token);
                    res.status(result.status).json({ message: result.message, accessToken: result.accessToken, refreshToken: result.refreshToken, refreshTokenExpired: result.refreshTokenExpired });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    fetchDashBoardStatistics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startDate = req.query.startDate;
                const endDate = req.query.endDate;
                const result = yield this._adminUseCase.getDashboardStatistics(startDate, endDate);
                res.status(result.status).json({
                    message: result.message,
                    userStats: result.userStats,
                    employerStats: result.employerStats,
                    jobStats: result.jobsStats,
                    jobApplicationStats: result.appliedJobsStats,
                    hiringStats: result.hiringStats,
                    totalNoOfUsers: result.totalNoOfUsers,
                    totalNoOfEmployers: result.totalNoOfEmployers,
                    totalNoOfJobs: result.totalNoOfJobs,
                    totalNoOfAppliedJobs: result.totalNoOfAppliedJobs
                });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    fetchAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const sort = req.query.sort;
                const search = req.query.search;
                const queries = req.query;
                const filter = {};
                for (const key in queries) {
                    if (queries.hasOwnProperty(key) && key !== 'page' && key !== 'sort' && key !== 'search') {
                        const value = queries[key];
                        if (value.includes(',')) {
                            const valuesArray = value.split(',');
                            if (valuesArray.every((v) => v === 'true' || v === 'false')) {
                                filter[key] = { $in: valuesArray.map((v) => v === 'true') };
                            }
                            else {
                                if (key === 'jobTitle') {
                                    const regexArray = valuesArray.map((v) => new RegExp(v, 'i'));
                                    filter.$or = regexArray.map((regex) => ({ jobTitle: regex }));
                                }
                                else {
                                    filter[key] = { $in: valuesArray };
                                }
                            }
                        }
                        else if (value === 'true' || value === 'false') {
                            filter[key] = value === 'true';
                        }
                        else if (key === 'jobTitle') {
                            const regex = new RegExp(value, 'i');
                            filter[key] = regex;
                        }
                        else {
                            filter[key] = value;
                        }
                    }
                }
                const result = yield this._adminUseCase.fetchAllUsers(page, sort, search, filter);
                res.status(result.status).json({ message: result.message, users: result.users, totalUsersCount: result.totalUsersCount });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    userAction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.user_id;
                const result = yield this._adminUseCase.userAction(userId);
                res.status(result.status).json({ message: result.message, updatedUser: result.updatedUser });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    fetchUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.query.user_id;
                const result = yield this._adminUseCase.fetchUserByUserId(user_id);
                res.status(result.status).json({ message: result.message, userData: result.userData });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    fetchAllEmployers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const sort = req.query.sort;
                const search = req.query.search;
                const queries = req.query;
                const filter = {};
                for (const key in queries) {
                    if (queries.hasOwnProperty(key) && key !== 'page' && key !== 'sort' && key !== 'search') {
                        const value = queries[key];
                        if (value.includes(',')) {
                            const valuesArray = value.split(',');
                            if (valuesArray.every((v) => v === 'true' || v === 'false')) {
                                filter[key] = { $in: valuesArray.map((v) => v === 'true') };
                            }
                            else {
                                if (key === 'industry') {
                                    const regexArray = valuesArray.map((v) => new RegExp(v, 'i'));
                                    filter.$or = regexArray.map((regex) => ({ industry: regex }));
                                }
                                else {
                                    filter[key] = { $in: valuesArray };
                                }
                            }
                        }
                        else if (value === 'true' || value === 'false') {
                            filter[key] = value === 'true';
                        }
                        else if (key === 'industry') {
                            const regex = new RegExp(value, 'i');
                            filter[key] = regex;
                        }
                        else {
                            filter[key] = value;
                        }
                    }
                }
                const result = yield this._adminUseCase.fetchAllEmployers(page, sort, search, filter);
                res.status(result.status).json({ message: result.message, employers: result.employers, totalUsersCount: result.totalEmployersCount });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    employerAction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employer_id = req.body.employer_id;
                const result = yield this._adminUseCase.employerAction(employer_id);
                res.status(result.status).json({ message: result.message, updatedEmployer: result.updatedEmployer });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    verifyEmployer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const employer_id = req.body.employer_id;
                const result = yield this._adminUseCase.verifyEmployer(employer_id);
                res.status(result.status).json({ message: result.message, verifiedEmployerId: (_a = result.employer) === null || _a === void 0 ? void 0 : _a._id });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    fetchAllJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page || 1;
                const sort = req.query.sort;
                const search = req.query.search;
                const queries = req.query;
                const filter = {};
                for (const key in queries) {
                    if (queries.hasOwnProperty(key) && key !== 'page' && key !== 'sort' && key !== 'search') {
                        const value = queries[key];
                        if (value.includes(',')) {
                            const valuesArray = value.split(',');
                            if (valuesArray.every((v) => v === 'true' || v === 'false')) {
                                filter[key] = { $in: valuesArray.map((v) => v === 'true') };
                            }
                            else {
                                if (key === 'industry') {
                                    const regexArray = valuesArray.map((v) => new RegExp(v, 'i'));
                                    filter.$or = regexArray.map((regex) => ({ industry: regex }));
                                }
                                else {
                                    filter[key] = { $in: valuesArray };
                                }
                            }
                        }
                        else if (value === 'true' || value === 'false') {
                            filter[key] = value === 'true';
                        }
                        else if (key === 'industry') {
                            const regex = new RegExp(value, 'i');
                            filter[key] = regex;
                        }
                        else {
                            filter[key] = value;
                        }
                    }
                }
                const result = yield this._adminUseCase.fetchAllJobs(page, sort, search, filter);
                res.status(result.status).json({ message: result.message, jobs: result.jobs, totalJobsCount: result.totalJobsCount });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    jobAction(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job_id = req.body.job_id;
                const result = yield this._adminUseCase.jobAction(job_id);
                res.status(result.status).json({ message: result.message, updatedJob: result.updatedJob });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    fetchEmployerById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employer_id = req.query.employer_id;
                const result = yield this._adminUseCase.fetchEmployerById(employer_id);
                res.status(result.status).json({ message: result.message, employerData: result.employerData });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
}
exports.default = AdminController;
