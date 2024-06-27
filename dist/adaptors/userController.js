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
const cloudinary_1 = __importDefault(require("../providers/cloudinary"));
class UserController {
    constructor(_userUseCase) {
        this._userUseCase = _userUseCase;
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                console.log(userData);
                const user = yield this._userUseCase.signUp(userData);
                res.status(user.status).json(user.message);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    sendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const response = yield this._userUseCase.sendOTP(email);
                res.status(response.status).json(response.message);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    logIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield this._userUseCase.logIn(email, password);
                if (user && user.accessToken && user.refreshToken) {
                    return res
                        .status(200)
                        .json({
                        user,
                    });
                }
                else {
                    return res
                        .status(400)
                        .json({
                        user,
                    });
                }
            }
            catch (error) {
                console.error();
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('hwrw thw refre route');
                const token = req.body.refreshToken;
                console.log('token here', token);
                if (token) {
                    const result = yield this._userUseCase.refreshToken(token);
                    res.status(result.status).json({ message: result.message, accessToken: result.accessToken, refreshToken: result.refreshToken, refreshTokenExpired: result.refreshTokenExpired });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    gAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fullName, email, password, google_id } = req.body;
                const user = yield this._userUseCase.gAuth(fullName, email, password, google_id);
                if (user && user.token) {
                    return res
                        .status(200)
                        .json({
                        user,
                    });
                }
                else {
                    return res
                        .status(400)
                        .json({
                        user,
                    });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    forgotPasswordSendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const user = yield this._userUseCase.forgotPasswordSendOTP(email);
                res.status(user.status).json(user.message);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, OTP, password } = req.body;
                const data = yield this._userUseCase.resetPassword(email, OTP, password);
                res.status(data.status).json(data.message);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    loadUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pageNo = req.query.page || '1';
                const result = yield this._userUseCase.loadUsers(pageNo);
                res.status(result.status).json({ message: result.message, data: result.users });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    fetchUserData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                if (token) {
                    const result = yield this._userUseCase.fetchUserDataWithToken(token);
                    res.status(result.status).json({ message: result === null || result === void 0 ? void 0 : result.message, userData: result === null || result === void 0 ? void 0 : result.userData });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    fetchUserProfileById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_id = req.body.user_id;
                const result = yield this._userUseCase.fetchUseProfileWithUserId(user_id);
                res.status(result.status).json({ message: result === null || result === void 0 ? void 0 : result.message, userData: result === null || result === void 0 ? void 0 : result.userData });
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
                const token = req.header('User-Token');
                const page = req.query.page || '1';
                const sort = req.query.sort;
                const search = req.query.search;
                const query = req.query;
                const filter = {};
                for (const key in query) {
                    if (query.hasOwnProperty(key) && key !== 'page' && key !== 'sort' && key !== 'search') {
                        const value = query[key];
                        if (value.includes(',')) {
                            const valuesArray = value.split(',');
                            if (key === 'jobTitle') {
                                filter[key] = { $in: valuesArray.map((val) => new RegExp(val, 'i')) };
                            }
                            else {
                                filter[key] = { $in: valuesArray };
                            }
                        }
                        else {
                            if (key === 'jobTitle') {
                                filter[key] = new RegExp(value, 'i');
                            }
                            else {
                                filter[key] = value;
                            }
                        }
                    }
                }
                if (token) {
                    const result = yield this._userUseCase.fetchUsersData(token, page, sort, search, filter);
                    res.status(result.status).json({ message: result === null || result === void 0 ? void 0 : result.message, users: result === null || result === void 0 ? void 0 : result.users, totalNoOfUsers: result.totalNoOfUsers });
                }
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
                const page = req.query.page || '1';
                const sort = req.query.sort;
                const search = req.query.search;
                const query = req.query;
                console.log('empQ', query);
                const filter = {};
                for (const key in query) {
                    if (query.hasOwnProperty(key) && key !== 'page' && key !== 'sort' && key !== 'search') {
                        const value = query[key];
                        if (value.includes(',')) {
                            const valuesArray = value.split(',');
                            if (key === 'industry') {
                                filter[key] = { $in: valuesArray.map((val) => new RegExp(val, 'i')) };
                            }
                            else {
                                filter[key] = { $in: valuesArray };
                            }
                        }
                        else {
                            if (key === 'industry') {
                                filter[key] = new RegExp(value, 'i');
                            }
                            else {
                                filter[key] = value;
                            }
                        }
                    }
                }
                const result = yield this._userUseCase.fetchEmployersData(page, sort, search, filter);
                res.status(result.status).json({ message: result === null || result === void 0 ? void 0 : result.message, employers: result === null || result === void 0 ? void 0 : result.employers, totalEmployersCount: result.totalEmployersCount });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    getScheduledInterviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                if (token) {
                    const result = yield this._userUseCase.getScheduledInterviews(token);
                    res.status(result.status).json({ message: result.message, scheduledInterviews: result.scheduledInterviews });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    fetchEmployerProfileById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employer_id = req.body.employer_id;
                const result = yield this._userUseCase.fetchEmployerProfileById(employer_id);
                res.status(result === null || result === void 0 ? void 0 : result.status).json({ message: result.message, employerData: result === null || result === void 0 ? void 0 : result.employerData });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    isUserBlocked(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                if (token) {
                    const result = yield this._userUseCase.isUserBlockedOrNot(token);
                    res.status(result.status).json({ message: result === null || result === void 0 ? void 0 : result.message, });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    updateUserProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const token = req.header('User-Token');
                const newData = req.body;
                if (typeof newData.DOB == "string") {
                    newData.DOB = this.convertTuiDayToDate(newData.DOB);
                }
                if (req.files) {
                    const profile_pic = (_a = req.files['profile-file']) === null || _a === void 0 ? void 0 : _a[0];
                    const resume = (_b = req.files['resume-file']) === null || _b === void 0 ? void 0 : _b[0];
                    if (profile_pic) {
                        console.log('before profile upload');
                        const profileUpload = yield cloudinary_1.default.uploader.upload(profile_pic.path);
                        newData.profile_url = profileUpload.secure_url;
                        console.log('after profile upload');
                    }
                    if (resume) {
                        console.log('before resume upload');
                        const resumeUpload = yield cloudinary_1.default.uploader.upload(resume.path, { resource_type: 'raw' });
                        newData.resume_url = resumeUpload.url;
                        console.log('after resume upload');
                    }
                }
                if (token) {
                    const result = yield this._userUseCase.updateUserProfile(newData, token);
                    res.status(result.status).json({ updatedData: result.userData, message: result.message });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    convertTuiDayToDate(dateString) {
        const [day, month, year] = dateString.split('.').map(Number);
        return new Date(year, month - 1, day);
    }
    updateUserAbout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                const about = req.body.about;
                if (token) {
                    const result = yield this._userUseCase.updateUserAbout(token, about);
                    res.status(result.status).json({ message: result.message, updatedData: result.userData });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    updateUserExperience(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                const exp_id = req.body.exp_id;
                const experience = req.body.exp;
                if (token) {
                    const result = yield this._userUseCase.updateUserExperience(token, experience, exp_id);
                    res.status(result.status).json({ message: result.message, updatedData: result.userData });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    deleteUserExperience(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const exp_id = req.params.exp_id;
                const token = req.header('User-Token');
                if (token) {
                    const result = yield this._userUseCase.deleteUserExperience(token, exp_id);
                    res.status(result.status).json({ message: result.message, updatedData: result.userData });
                }
                else {
                    res.status(400).json({ message: 'Unauthorized user' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    updateUserEducation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                const education_id = req.body.education_id;
                const education = req.body.education;
                if (token) {
                    const result = yield this._userUseCase.updateUserEducation(token, education, education_id);
                    res.status(result.status).json({ updatedData: result.userData, message: result.message });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    deleteUserEducation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const edu_id = req.params.edu_id;
                const token = req.header('User-Token');
                if (token) {
                    const result = yield this._userUseCase.deleteUserEducation(token, edu_id);
                    res.status(result.status).json({ message: result.message, updatedData: result.userData });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    updateUserSkills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('User-Token');
                const skills = req.body.skills;
                if (token) {
                    const result = yield this._userUseCase.updateUserSkills(token, skills);
                    res.status(result.status).json({ updatedData: result.userData, message: result.message });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    changeEmailSendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentEmail = req.body.currentEmail;
                const result = yield this._userUseCase.sendOTPToCurrentEmail(currentEmail);
                res.status(result.status).json({ message: result.message });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    updateEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentEmail = req.body.currentEmail;
                const currentEmailOTP = req.body.currentEmailOTP;
                const newEmail = req.body.newEmail;
                const newEmailOTP = req.body.newEmailOTP;
                const result = yield this._userUseCase.updateCurrentEmail(currentEmail, currentEmailOTP, newEmail, newEmailOTP);
                res.status(result.status).json({ message: result.message });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
}
exports.default = UserController;
