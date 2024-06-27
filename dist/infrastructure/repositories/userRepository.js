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
const userModel_1 = __importDefault(require("../../entities_models/userModel"));
class UserRepository {
    insertOne(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new userModel_1.default(user);
                yield newUser.save();
                return newUser;
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
                const userData = yield userModel_1.default.findOne({ email });
                if (userData) {
                    return userData;
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
    updatePassword(email, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newData = yield userModel_1.default.findOneAndUpdate({ email: email }, { password: newPassword }, { new: true });
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
    getUsersStatistics(startDate, endDate) {
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
                const result = yield userModel_1.default.aggregate(pipeline).exec();
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
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield userModel_1.default.findById(id);
                if (userData) {
                    return userData;
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
    findByIdAndUpdate(id, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield userModel_1.default.findByIdAndUpdate(id, { $set: newData }, { new: true });
                if (userData) {
                    return userData;
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
    updateUserAbout(user_id, about) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = yield userModel_1.default.findByIdAndUpdate(user_id, { about: about }, { new: true });
                if (userData) {
                    return userData;
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
    addUserExperience(user_id, experience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedData = yield userModel_1.default.findByIdAndUpdate(user_id, { $push: { experiences: experience } }, { upsert: true, new: true });
                return updatedData ? updatedData : null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    updateUserExperience(user_id, exp_id, experience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedData = yield userModel_1.default.findOneAndUpdate({ _id: user_id, 'experiences._id': exp_id }, { $set: { 'experiences.$': experience } }, { new: true });
                return updatedData ? updatedData : null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    deleteUserExperience(user_id, exp_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUserData = yield userModel_1.default.findOneAndUpdate({ _id: user_id }, { $pull: { experiences: { _id: exp_id } } }, { new: true });
                if (updatedUserData) {
                    return updatedUserData;
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
    addUserEducation(user_id, education) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedData = yield userModel_1.default.findByIdAndUpdate(user_id, { $push: { educations: education } }, { upsert: true, new: true });
                return updatedData ? updatedData : null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    updateUserEducation(user_id, education, edct_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedData = yield userModel_1.default.findOneAndUpdate({ _id: user_id, 'educations._id': edct_id }, { $set: { 'educations.$': education } }, { new: true });
                return updatedData ? updatedData : null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    deleteUserEducation(user_id, edu_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUserData = yield userModel_1.default.findOneAndUpdate({ _id: user_id }, { $pull: { educations: { _id: edu_id } } }, { new: true });
                if (updatedUserData) {
                    return updatedUserData;
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
    updateUserSkills(user_id, skills) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatdData = yield userModel_1.default.findOneAndUpdate({ _id: user_id }, { $set: { 'skills': skills } }, { new: true });
                return updatdData ? updatdData : null;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    changeEmailByEmail(currentEmail, newEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedData = yield userModel_1.default.findOneAndUpdate({ email: currentEmail }, { $set: { email: newEmail } }, { new: true });
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
    fetchAllUsers(skip, limit, user_id, sort, filter, search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!filter) {
                    filter = {};
                }
                if (user_id) {
                    filter._id = { $ne: user_id };
                }
                let sortQuery = { firstName: 1 };
                if (sort === 'a-z') {
                    sortQuery = { firstName: 1 };
                }
                else if (sort === 'z-a') {
                    sortQuery = { firstName: -1 };
                }
                if (search) {
                    const regex = new RegExp(search, 'i');
                    filter.$or = [
                        { firstName: regex },
                        { lastName: regex },
                        { jobTitle: regex }
                    ];
                }
                if (user_id) {
                    const users = yield userModel_1.default.find(filter, { password: 0 }).sort(sortQuery).skip(skip).limit(limit);
                    return users || null;
                }
                else {
                    const users = yield userModel_1.default.find(filter, { password: 0 }).sort(sortQuery).skip(skip).limit(limit);
                    return users || null;
                }
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    fetchUsersCount(user_id, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (user_id) {
                    filter._id = { $ne: user_id };
                }
                const users = yield userModel_1.default.find(filter);
                return users.length || 0;
            }
            catch (error) {
                console.log(error);
                throw error;
            }
        });
    }
    changeStatusById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield userModel_1.default.findOneAndUpdate({ _id: user_id }, [{ $set: { isActive: { $not: "$isActive" } } }], { new: true });
                if (updatedUser) {
                    return updatedUser;
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
}
exports.default = UserRepository;
