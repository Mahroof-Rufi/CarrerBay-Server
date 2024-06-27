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
const jobApplicantsModel_1 = __importDefault(require("../../entities_models/jobApplicantsModel"));
class JobApplicantsRepository {
    addAppliedUser(job_id, user_id, resume_url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appliedUsers = yield jobApplicantsModel_1.default.findOneAndUpdate({ job_id: job_id }, { $addToSet: { appliedUsers: { user_id: user_id, resume: resume_url, status: "under-review" } } }, { upsert: true, new: true });
                if (appliedUsers) {
                    return appliedUsers;
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
    findOne(job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const appliedUsers = yield jobApplicantsModel_1.default.findOne({ job_id: job_id }).populate({
                    path: 'appliedUsers.user_id',
                    model: 'user'
                });
                if (appliedUsers) {
                    return appliedUsers;
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
    updateCandidateStatus(job_id, user_id, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateQuery = { job_id: job_id, 'appliedUsers.user_id': user_id };
                let updateOperation;
                if (newStatus === 'hired') {
                    updateOperation = {
                        $set: {
                            'appliedUsers.$[elem].status': newStatus,
                            'appliedUsers.$[elem].hiredAt': new Date()
                        }
                    };
                }
                else {
                    updateOperation = {
                        $set: {
                            'appliedUsers.$[elem].status': newStatus
                        }
                    };
                }
                const options = {
                    arrayFilters: [{ 'elem.user_id': user_id }],
                    new: true
                };
                const updatedJobApplicant = yield jobApplicantsModel_1.default.findOneAndUpdate(updateQuery, updateOperation, options).populate('appliedUsers.user_id');
                if (updatedJobApplicant) {
                    return updatedJobApplicant;
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
    rejectCandidateStatus(job_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedJobApplicant = yield jobApplicantsModel_1.default.findOneAndUpdate({ job_id: job_id, 'appliedUsers.user_id': user_id }, { $set: { 'appliedUsers.$.rejected': true } }, { new: true }).populate('appliedUsers.user_id');
                if (updatedJobApplicant) {
                    return updatedJobApplicant;
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
    findOneCandidate(job_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobApplication = yield jobApplicantsModel_1.default.findOne({ job_id: job_id, 'appliedUsers.user_id': user_id });
                if (jobApplication) {
                    return jobApplication;
                }
                else {
                    null;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getHiringStatistics(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pipeline = [
                    {
                        $unwind: "$appliedUsers"
                    },
                    {
                        $match: {
                            "appliedUsers.status": 'hired',
                            "appliedUsers.hiredAt": {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: { $month: "$appliedUsers.hiredAt" },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { _id: 1 }
                    }
                ];
                const result = yield jobApplicantsModel_1.default.aggregate(pipeline).exec();
                const monthlyCountsArray = Array(6).fill(0);
                result.forEach(item => {
                    const monthIndex = item._id - 1;
                    monthlyCountsArray[monthIndex] = item.count;
                });
                return monthlyCountsArray;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = JobApplicantsRepository;
