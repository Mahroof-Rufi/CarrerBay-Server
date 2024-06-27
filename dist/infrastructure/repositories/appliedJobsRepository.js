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
const appliedJobsModel_1 = __importDefault(require("../../entities_models/appliedJobsModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class AppliedJobsRepository {
    addAppliedJob(user_id, job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appliedJob = yield appliedJobsModel_1.default.findOneAndUpdate({ user_id: new mongoose_1.default.Types.ObjectId(user_id) }, { $addToSet: { appliedJobs: { job_id: job_id, status: "under-review", } } }, { upsert: true, new: true });
                return appliedJob ? appliedJob : null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    findOneById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appliedJobs = yield appliedJobsModel_1.default.findOne({ user_id: user_id }).populate({
                    path: 'appliedJobs.job_id',
                    populate: {
                        path: 'company_id',
                        model: 'employer'
                    }
                });
                if (appliedJobs) {
                    return appliedJobs;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    updateJobStatusById(user_id, job_id, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUserAppliedJob = yield appliedJobsModel_1.default.findOneAndUpdate({ user_id: user_id, 'appliedJobs.job_id': job_id }, { $set: { 'appliedJobs.$.status': newStatus } }, { new: true });
                if (updatedUserAppliedJob) {
                    return updatedUserAppliedJob;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    rejectApplication(user_id, job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUserAppliedJob = yield appliedJobsModel_1.default.findOneAndUpdate({ user_id: user_id, 'appliedJobs.job_id': job_id }, { $set: { 'appliedJobs.$.rejected': true } }, { new: true });
                if (updatedUserAppliedJob) {
                    return updatedUserAppliedJob;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getAppliedJobsStatistics(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pipeline = [
                    {
                        $unwind: "$appliedJobs"
                    },
                    {
                        $match: {
                            "appliedJobs.appliedAt": {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: { $month: "$appliedJobs.appliedAt" },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { _id: 1 }
                    }
                ];
                const result = yield appliedJobsModel_1.default.aggregate(pipeline);
                const monthlyCountsArray = Array(6).fill(0);
                result.forEach(item => {
                    const monthIndex = item._id - 1;
                    monthlyCountsArray[monthIndex] = item.count;
                });
                return monthlyCountsArray;
            }
            catch (error) {
                console.log("Error:", error);
                throw error;
            }
        });
    }
    getTotalAppliedJobsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield appliedJobsModel_1.default.aggregate([
                    { $unwind: "$appliedJobs" },
                    { $count: "totalAppliedJobs" }
                ]);
                return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.totalAppliedJobs) || 0;
            }
            catch (error) {
                console.error("Error fetching total applied jobs count:", error);
                throw error;
            }
        });
    }
}
exports.default = AppliedJobsRepository;
