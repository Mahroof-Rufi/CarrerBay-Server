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
const savedJobsAndPostsModel_1 = __importDefault(require("../../entities_models/savedJobsAndPostsModel"));
class SavedJobsAndPostsRepository {
    insertJob(userId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield savedJobsAndPostsModel_1.default.findOneAndUpdate({ user_id: userId }, { $push: { savedJobs: { job_id: jobId } } }, { new: true, upsert: true });
                if (result) {
                    return result;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    isJobSaved(user_id, job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield savedJobsAndPostsModel_1.default.findOne({
                    user_id: user_id,
                    savedJobs: { $elemMatch: { job_id: job_id } }
                });
                if (result) {
                    return result;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    removeJob(userId, jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield savedJobsAndPostsModel_1.default.findOneAndUpdate({ user_id: userId }, { $pull: { savedJobs: { job_id: jobId } } }, { new: true });
                console.log('res here', result);
                if (result) {
                    return result;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    findSavedJobs(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedJobs = yield savedJobsAndPostsModel_1.default.findOne({ user_id: user_id }).populate({
                    path: 'savedJobs.job_id',
                    populate: {
                        path: 'company_id'
                    }
                });
                if (savedJobs) {
                    return savedJobs;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = SavedJobsAndPostsRepository;
