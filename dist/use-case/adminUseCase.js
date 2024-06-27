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
class AdminUseCase {
    constructor(_adminRepo, _userRepo, _employerRepo, _jobsRepo, _appliedJobsRepo, _jobApplications, _jwt) {
        this._adminRepo = _adminRepo;
        this._userRepo = _userRepo;
        this._employerRepo = _employerRepo;
        this._jobsRepo = _jobsRepo;
        this._appliedJobsRepo = _appliedJobsRepo;
        this._jobApplications = _jobApplications;
        this._jwt = _jwt;
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this._adminRepo.findByEmail(email);
            if (admin) {
                if (password !== admin.password) {
                    return {
                        status: 400,
                        message: 'Invalid credentials'
                    };
                }
                const accessToken = this._jwt.createAccessToken(admin.id, 'admin');
                const refreshToken = this._jwt.createRefreshToken(admin.id, 'admin');
                return {
                    status: 200,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    message: 'Login successfully'
                };
            }
            else {
                return {
                    status: 400,
                    message: 'Data not found'
                };
            }
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = yield this._jwt.verifyRefreshToken(refreshToken);
            if ((decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id) && (decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role)) {
                const newAccessToken = yield this._jwt.createAccessToken(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role);
                const newRefreshToken = yield this._jwt.createRefreshToken(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role);
                return {
                    status: 200,
                    message: 'Token updated successfully',
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                };
            }
            else {
                return {
                    status: 401,
                    message: 'Refresh token expired',
                    refreshTokenExpired: true,
                };
            }
        });
    }
    getDashboardStatistics(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const userStats = yield this._userRepo.getUsersStatistics(startDate, endDate);
            const employerStats = yield this._employerRepo.getEmployersStatistics(startDate, endDate);
            const jobStats = yield this._jobsRepo.getJobsStatistics(startDate, endDate);
            const jobApplicationStats = yield this._appliedJobsRepo.getAppliedJobsStatistics(startDate, endDate);
            const hiringStats = yield this._jobApplications.getHiringStatistics(startDate, endDate);
            const totalNoOfUsers = yield this._userRepo.fetchUsersCount();
            const totalNoOfEmployers = yield this._employerRepo.FetchEmployersCount();
            const totalNoOfJobs = yield this._jobsRepo.FetchJobsCount({ isActive: true, isClosed: false });
            const totalNoOfAppliedJobs = yield this._appliedJobsRepo.getTotalAppliedJobsCount();
            return {
                status: 200,
                message: 'Dashboard statistics found successful',
                userStats: userStats,
                employerStats: employerStats,
                jobsStats: jobStats,
                appliedJobsStats: jobApplicationStats,
                hiringStats: hiringStats,
                totalNoOfUsers: totalNoOfUsers,
                totalNoOfEmployers: totalNoOfEmployers,
                totalNoOfJobs: totalNoOfJobs,
                totalNoOfAppliedJobs: totalNoOfAppliedJobs
            };
        });
    }
    fetchAllUsers(pageNo, sort, search, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 10;
            const skip = (pageNo - 1) * limit;
            const users = yield this._userRepo.fetchAllUsers(skip, limit, '', sort, filter, search);
            const totalUsersCount = yield this._userRepo.fetchUsersCount('', filter);
            return {
                status: 200,
                message: 'Users found successfully',
                users: users,
                totalUsersCount: totalUsersCount
            };
        });
    }
    userAction(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this._userRepo.changeStatusById(user_id);
            if (!updatedUser) {
                return {
                    status: 400,
                    message: 'User not found'
                };
            }
            return {
                status: 200,
                message: 'User action successful',
                updatedUser: updatedUser
            };
        });
    }
    fetchUserByUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this._userRepo.findById(user_id);
            if (userData) {
                return {
                    status: 200,
                    message: 'User found successfully',
                    userData: userData
                };
            }
            else {
                return {
                    status: 400,
                    message: 'User not found'
                };
            }
        });
    }
    fetchAllEmployers(pageNo, sort, search, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 10;
            const skip = (pageNo - 1) * limit;
            const employers = yield this._employerRepo.fetchAllEmployers(skip, limit, '', sort, search, filter);
            const totalEmployersCount = yield this._employerRepo.FetchEmployersCount(filter);
            return {
                status: 200,
                message: 'Employers found successfully',
                employers: employers,
                totalEmployersCount: totalEmployersCount
            };
        });
    }
    fetchEmployerById(employer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const employerData = yield this._employerRepo.findById(employer_id);
            if (employerData) {
                return {
                    status: 200,
                    message: 'Employer found successfully',
                    employerData: employerData
                };
            }
            else {
                return {
                    status: 400,
                    message: 'Employer not found'
                };
            }
        });
    }
    employerAction(employer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedEmployer = yield this._employerRepo.changeStatusById(employer_id);
            if (!updatedEmployer) {
                return {
                    status: 400,
                    message: 'Employer not found'
                };
            }
            return {
                status: 200,
                message: 'Employer action successful',
                updatedEmployer: updatedEmployer
            };
        });
    }
    verifyEmployer(employer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const verifiedEmployer = yield this._employerRepo.verifyAccountById(employer_id);
            if (!verifiedEmployer) {
                return {
                    status: 400,
                    message: 'Employer not found'
                };
            }
            return {
                status: 200,
                message: 'Employer action successful',
                employer: verifiedEmployer
            };
        });
    }
    fetchAllJobs(pageNo, sort, search, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 10;
            const skip = (pageNo - 1) * limit;
            const jobs = yield this._jobsRepo.fetch8Jobs(skip, limit, sort, search, filter);
            const totalJobsCount = yield this._jobsRepo.FetchJobsCount(filter);
            return {
                status: 200,
                message: 'Employers found successfully',
                jobs: jobs,
                totalJobsCount: totalJobsCount
            };
        });
    }
    jobAction(job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedJob = yield this._jobsRepo.changeStatusById(job_id);
            if (!updatedJob) {
                return {
                    status: 400,
                    message: 'Job not found'
                };
            }
            return {
                status: 200,
                message: 'Job action successful',
                updatedJob: updatedJob
            };
        });
    }
}
exports.default = AdminUseCase;
