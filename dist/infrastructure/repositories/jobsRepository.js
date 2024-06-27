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
const jobModel_1 = __importDefault(require("../../entities_models/jobModel"));
class JobsRepository {
    insertOneJob(jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const job = new jobModel_1.default(jobData);
                yield job.save();
                return job;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    fetch8Jobs(skip, limit, sort, searchValue, filterQuery, company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sortQuery;
                if (sort === 'newest') {
                    sortQuery = { _id: -1 };
                }
                else if (sort === 'oldest') {
                    sortQuery = { _id: 1 };
                }
                if (searchValue) {
                    const regex = new RegExp(searchValue, 'i');
                    filterQuery = { jobTitle: regex };
                }
                if (company_id)
                    filterQuery.company_id = company_id;
                let jobs;
                if (sortQuery) {
                    jobs = yield jobModel_1.default.find(filterQuery).skip(skip).limit(limit).sort(sortQuery);
                }
                else {
                    jobs = yield jobModel_1.default.find(filterQuery).skip(skip).limit(limit);
                }
                if (jobs) {
                    return jobs;
                }
                else {
                    return [];
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    fetchJobById(job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield jobModel_1.default.findOne({ _id: job_id }).populate('company_id');
            return job || null;
        });
    }
    FetchJobsCount(filterQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield jobModel_1.default.find(filterQuery);
                return jobs.length || 0;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    fetchEmployerJobsCount(employer_id, filterQuery, searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (filterQuery) {
                    filterQuery.company_id = employer_id;
                    if (searchQuery) {
                        filterQuery.jobTitle = new RegExp(searchQuery, 'i');
                    }
                    const noOfDoc = yield jobModel_1.default.find(filterQuery).countDocuments();
                    return noOfDoc;
                }
                else {
                    const noOfDoc = yield jobModel_1.default.find({ company_id: employer_id }).countDocuments();
                    return noOfDoc;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    fetchEmployerJobsById(employer_id, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employerJobs = yield jobModel_1.default.find({ company_id: employer_id, isActive: true, isClosed: false }).populate('company_id').skip(skip).limit(limit);
                return employerJobs || null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    fetchNoOfJobsByEmployerId(employer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const noOfJobs = yield jobModel_1.default.find({ company_id: employer_id }).countDocuments();
                return noOfJobs || 0;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    fetchJobsByUser(skip, limit, sort, filterQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                filterQuery.isActive = true;
                filterQuery.isClosed = false;
                let sortQuery;
                if (sort === 'newest') {
                    sortQuery = { _id: -1 };
                }
                else if (sort === 'oldest') {
                    sortQuery = { _id: 1 };
                }
                const jobs = yield jobModel_1.default.find(filterQuery).skip(skip).limit(limit).sort(sortQuery).populate('company_id');
                if (jobs) {
                    return jobs;
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
    fetchUserJobsCount(filterQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                filterQuery.isActive = true;
                filterQuery.isClosed = false;
                const totalNoOfJobs = yield jobModel_1.default.find(filterQuery).countDocuments();
                return totalNoOfJobs;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    fetchSearchedJobs(skip, limit, sort, filterQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                filterQuery.isActive = true;
                filterQuery.isClosed = false;
                const searchedJobs = jobModel_1.default.find(filterQuery).skip(skip).limit(limit).populate('company_id');
                if (searchedJobs) {
                    return searchedJobs;
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
    fetchSearchedJobsByCompanyId(company_id, skip, limit, searchQuery, sort, filterQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sortQuery;
                if (sort === 'newest') {
                    sortQuery = { _id: -1 };
                }
                else if (sort === 'oldest') {
                    sortQuery = { _id: 1 };
                }
                const combinedQuery = { company_id: company_id };
                if (searchQuery) {
                    combinedQuery.jobTitle = { $regex: searchQuery, $options: 'i' };
                }
                if (filterQuery) {
                    delete filterQuery.search;
                    Object.assign(combinedQuery, filterQuery);
                }
                let searchedJobs;
                if (sortQuery) {
                    searchedJobs = jobModel_1.default.find(combinedQuery).skip(skip).limit(limit).sort(sortQuery);
                }
                else {
                    searchedJobs = jobModel_1.default.find(combinedQuery).skip(skip).limit(limit);
                }
                if (searchedJobs) {
                    return searchedJobs;
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
    updateJobByID(job_id, jobData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedJob = yield jobModel_1.default.findByIdAndUpdate({ _id: job_id }, { $set: jobData }, { new: true });
                return updatedJob || null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    deleteJobById(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deletedJob = yield jobModel_1.default.findByIdAndDelete(jobId);
                if (deletedJob) {
                    return deletedJob;
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
    addApplicantId(job_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedJob = yield jobModel_1.default.findByIdAndUpdate(job_id, { $addToSet: { applicants: user_id } });
                return updatedJob || null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    closeHiring(job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedJob = yield jobModel_1.default.findOneAndUpdate({ _id: job_id }, { isClosed: true }, { new: true });
                if (updatedJob) {
                    return updatedJob;
                }
                else {
                    return updatedJob;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    changeStatusById(job_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedJob = yield jobModel_1.default.findOneAndUpdate({ _id: job_id }, [{ $set: { isActive: { $not: "$isActive" } } }], { new: true });
                return updatedJob || null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getJobsStatistics(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pipeline = [
                    {
                        $match: {
                            postedAt: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: { $month: "$postedAt" },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { _id: 1 }
                    }
                ];
                const result = yield jobModel_1.default.aggregate(pipeline).exec();
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
exports.default = JobsRepository;
