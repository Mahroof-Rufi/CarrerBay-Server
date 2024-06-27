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
const employerModel_1 = __importDefault(require("../../entities_models/employerModel"));
class EmployerRepository {
    insertOne(employer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newEmployer = new employerModel_1.default(employer);
                yield newEmployer.save();
                return newEmployer;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employer = yield employerModel_1.default.findOne({ email: email }).lean();
                if (employer) {
                    return employer;
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
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employerData = yield employerModel_1.default.findById(id);
                return employerData || null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    updatePassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newData = yield employerModel_1.default.findOneAndUpdate({ email: email }, { password: newPassword }, { new: true });
                if (newData) {
                    return newData;
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
    updateProfile(email, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedData = yield employerModel_1.default.findOneAndUpdate({ email: email }, { $set: newData }, { new: false });
                if (updatedData) {
                    return updatedData;
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
    updateEmail(email, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedData = yield employerModel_1.default.findOneAndUpdate({ email: email }, { $set: {
                        email: newEmail
                    } }, { new: true });
                if (updatedData) {
                    return updatedData;
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
    fetchAllEmployers(skip, limit, employer_id, sort, search, filterQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let sortQuery = { companyName: 1 };
                if (sort == 'a-z') {
                    sortQuery = { companyName: 1 };
                }
                else {
                    sortQuery = { companyName: -1 };
                }
                if (typeof filterQuery.isVerified == "undefined") {
                    console.log(' inside if');
                    filterQuery.isVerified = true;
                }
                if (search) {
                    const regex = new RegExp(search, 'i');
                    filterQuery.$or = [
                        { companyName: regex },
                        { industry: regex },
                    ];
                }
                if (employer_id) {
                    const employers = yield employerModel_1.default.find({ _id: { $ne: employer_id } }).sort(sortQuery).skip(skip).limit(limit);
                    return employers || null;
                }
                else {
                    const employers = yield employerModel_1.default.find(filterQuery).skip(skip).sort(sortQuery).limit(limit);
                    return employers || null;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    FetchEmployersCount(filterQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employers = yield employerModel_1.default.find(filterQuery);
                return employers.length || 0;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    changeStatusById(employer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedEmployer = yield employerModel_1.default.findOneAndUpdate({ _id: employer_id }, [{ $set: { isActive: { $not: "$isActive" } } }], { new: true });
                if (updatedEmployer) {
                    return updatedEmployer;
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
    verifyAccountById(employer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedEmployer = yield employerModel_1.default.findOneAndUpdate({ _id: employer_id }, { isVerified: true }, { new: true });
                return updatedEmployer || null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    getEmployersStatistics(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pipeline = [
                    {
                        $match: {
                            joinedAt: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: { $month: "$joinedAt" },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $sort: { _id: 1 }
                    }
                ];
                const result = yield employerModel_1.default.aggregate(pipeline).exec();
                const monthlyCountsArray = Array(6).fill(0);
                result.forEach(item => {
                    const monthIndex = item._id - 1;
                    monthlyCountsArray[monthIndex] = item.count;
                });
                console.log(monthlyCountsArray);
                return monthlyCountsArray;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
}
exports.default = EmployerRepository;
