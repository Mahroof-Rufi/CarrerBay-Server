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
class UserUseCase {
    constructor(_userRepository, _employerRepository, _chatRepository, _jwt, _OTPgenerator, _mailer, _userOTPRepo) {
        this._userRepository = _userRepository;
        this._employerRepository = _employerRepository;
        this._chatRepository = _chatRepository;
        this._jwt = _jwt;
        this._OTPgenerator = _OTPgenerator;
        this._mailer = _mailer;
        this._userOTPRepo = _userOTPRepo;
    }
    sendOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const OTP = this._OTPgenerator.generateOTP();
            const user = yield this._userRepository.findByEmail(email);
            if (!user) {
                const res = yield this._mailer.sendMail(email, parseInt(OTP));
                this._userOTPRepo.insertOTP(email, parseInt(OTP));
                if (res) {
                    return {
                        status: 200,
                        message: 'OTP send successfully'
                    };
                }
                else {
                    return {
                        status: 400,
                        message: 'OTP send failed, try again'
                    };
                }
            }
            else {
                return {
                    status: 400,
                    message: 'Email already exists'
                };
            }
        });
    }
    signUp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findByEmail(userData.email);
            if (!user) {
                const otp = yield this._userOTPRepo.getOtpByEmail(userData.email);
                if ((otp === null || otp === void 0 ? void 0 : otp.OTP) == userData.OTP) {
                    yield this._userRepository.insertOne(userData);
                    return {
                        status: 200,
                        message: 'User registration successful'
                    };
                }
                else {
                    return {
                        status: 400,
                        message: 'Invalid OTP'
                    };
                }
            }
            else {
                return {
                    status: 400,
                    message: 'Email already exists'
                };
            }
        });
    }
    logIn(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = yield this._userRepository.findByEmail(email);
            if (userData) {
                if (password !== userData.password) {
                    return {
                        status: 400,
                        message: 'Invalid credentials'
                    };
                }
                else if (!userData.isActive) {
                    return {
                        status: 400,
                        message: 'This account blocked by Admin'
                    };
                }
                const accessToken = this._jwt.createAccessToken(userData._id, 'Normal-User');
                const refreshToken = this._jwt.createRefreshToken(userData._id, 'Normal-User');
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
                    message: 'User not found'
                };
            }
        });
    }
    refreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = yield this._jwt.verifyRefreshToken(token);
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
    gAuth(fullName, email, password, google_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findByEmail(email);
            if (user) {
                const token = this._jwt.createAccessToken(user._id, 'Normal-User');
                return {
                    status: 200,
                    token: token,
                    userDate: user,
                    message: 'Login successfully'
                };
            }
            else {
                const res = yield this._userRepository.insertOne({ firstName: fullName, email: email, g_id: google_id });
                if (res) {
                    const token = this._jwt.createAccessToken(res._id, 'Normal-User');
                    return {
                        status: 200,
                        token: token,
                        userDate: user,
                        message: 'Login successfully'
                    };
                }
                return {
                    status: 400,
                    message: 'Something went wrong'
                };
            }
        });
    }
    forgotPasswordSendOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findByEmail(email);
            if (user) {
                const OTP = this._OTPgenerator.generateOTP();
                const res = yield this._mailer.sendMail(email, parseInt(OTP));
                yield this._userOTPRepo.insertOTP(email, parseInt(OTP));
                if (res) {
                    return {
                        status: 200,
                        message: 'OTP send successfully'
                    };
                }
                else {
                    return {
                        status: 400,
                        message: 'OTP sending failed, try again'
                    };
                }
            }
            else {
                return {
                    status: 400,
                    message: 'Email not exists'
                };
            }
        });
    }
    resetPassword(email, OTP, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const realOTP = yield this._userOTPRepo.getOtpByEmail(email);
            if ((realOTP === null || realOTP === void 0 ? void 0 : realOTP.OTP) == OTP) {
                const res = yield this._userRepository.updatePassword(email, password);
                if (res) {
                    return {
                        status: 200,
                        message: 'Password updated Successfully'
                    };
                }
                else {
                    return {
                        status: 400,
                        message: 'Something went wrong'
                    };
                }
            }
            else {
                return {
                    status: 400,
                    message: 'Invalid OTP'
                };
            }
        });
    }
    fetchUserDataWithToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decode = this._jwt.verifyToken(token, "User");
            const res = yield this._userRepository.findById(decode === null || decode === void 0 ? void 0 : decode.id);
            if (res) {
                return {
                    status: 200,
                    message: 'Operation success',
                    userData: res,
                };
            }
            else {
                return {
                    status: 401,
                    message: 'Something went wrong',
                };
            }
        });
    }
    fetchUseProfileWithUserId(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._userRepository.findById(user_id);
            if (res) {
                return {
                    status: 200,
                    message: 'Operation success',
                    userData: res,
                };
            }
            else {
                return {
                    status: 400,
                    message: 'Something went wrong',
                };
            }
        });
    }
    fetchUsersData(token, pageNo, sort, search, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "User");
            const limit = 12;
            const skip = (parseInt(pageNo) - 1) * limit;
            const res = yield this._userRepository.fetchAllUsers(skip, limit, decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, sort, filter, search);
            const totalNoOfUsers = yield this._userRepository.fetchUsersCount(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, filter);
            return {
                status: 200,
                message: 'Users found successfully',
                users: res,
                totalNoOfUsers: totalNoOfUsers
            };
        });
    }
    fetchEmployersData(pageNo, sort, search, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 10;
            const skip = (parseInt(pageNo) - 1) * limit;
            const res = yield this._employerRepository.fetchAllEmployers(skip, limit, '', sort, search, filter);
            const totalEmployersCount = yield this._employerRepository.FetchEmployersCount(filter);
            return {
                status: 200,
                message: 'Employers found successfully',
                employers: res,
                totalEmployersCount: totalEmployersCount
            };
        });
    }
    fetchEmployerProfileById(employer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._employerRepository.findById(employer_id);
            if (res) {
                return {
                    status: 200,
                    employerData: res,
                    message: 'Operation success'
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
    getScheduledInterviews(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "User");
            const scheduleInterviews = yield this._chatRepository.findScheduledInterviews(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
            if (scheduleInterviews) {
                return {
                    status: 200,
                    message: 'Scheduled Interviews found successfully',
                    scheduledInterviews: scheduleInterviews
                };
            }
            else {
                return {
                    status: 400,
                    message: 'Scheduled Interviews not found'
                };
            }
        });
    }
    isUserBlockedOrNot(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "User");
            const res = yield this._userRepository.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
            if (res === null || res === void 0 ? void 0 : res.isActive) {
                return {
                    status: 200,
                    message: 'User is not blocked'
                };
            }
            return {
                status: 403,
                message: 'User account block by admin'
            };
        });
    }
    loadUsers(pageNo) {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 10;
            const skip = (parseInt(pageNo) - 1) * limit;
            const users = yield this._userRepository.fetchAllUsers(skip, limit);
            return {
                status: 200,
                message: 'Users found successfully',
                users: users
            };
        });
    }
    updateUserProfile(newData, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "User");
            const allowedUpdates = [
                'firstName', 'lastName', 'profile_url', 'jobTitle', 'industry', 'DOB', 'gender', 'city', 'state',
                'remort', 'resume_url', 'portfolio_url', 'gitHub_url', 'about', 'experiences', 'educations', 'skills'
            ];
            const updateValidator = Object.keys(newData).every((update) => allowedUpdates.includes(update));
            if (!updateValidator) {
                return {
                    status: 405,
                    message: 'disallowed fields found'
                };
            }
            const userData = yield this._userRepository.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
            if (!userData) {
                return {
                    status: 404,
                    message: 'User not found'
                };
            }
            const res = yield this._userRepository.findByIdAndUpdate(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, newData);
            if (res) {
                return {
                    status: 201,
                    userData: res,
                    message: 'User profile update successfully'
                };
            }
            else {
                return {
                    status: 404,
                    message: 'User not found'
                };
            }
        });
    }
    updateUserAbout(token, about) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "User");
            const userData = yield this._userRepository.findById(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
            if (!userData) {
                return {
                    status: 404,
                    message: 'User not found'
                };
            }
            const res = yield this._userRepository.updateUserAbout(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, about);
            if (res) {
                return {
                    status: 201,
                    userData: res,
                    message: 'User about update successfully'
                };
            }
            else {
                return {
                    status: 404,
                    message: 'User not found'
                };
            }
        });
    }
    updateUserExperience(token, experience, exp_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "User");
            if (exp_id) {
                const res = yield this._userRepository.updateUserExperience(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, exp_id, experience);
                if (res) {
                    return {
                        status: 201,
                        userData: res,
                        message: 'User experience updated successfully'
                    };
                }
                else {
                    return {
                        status: 404,
                        message: 'User not found'
                    };
                }
            }
            else {
                const res = yield this._userRepository.addUserExperience(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, experience);
                if (res) {
                    return {
                        status: 201,
                        userData: res,
                        message: 'User experience updated successfully'
                    };
                }
                else {
                    return {
                        status: 404,
                        message: 'User not found'
                    };
                }
            }
        });
    }
    deleteUserExperience(token, exp_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const decode = this._jwt.verifyToken(token, "User");
            const updatedUserExperience = yield this._userRepository.deleteUserExperience(decode === null || decode === void 0 ? void 0 : decode.id, exp_id);
            if (!updatedUserExperience) {
                return {
                    status: 400,
                    message: 'User not found',
                };
            }
            return {
                status: 200,
                message: 'User experience delete successful',
                userData: updatedUserExperience
            };
        });
    }
    updateUserEducation(token, education, education_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "User");
            if (education_id) {
                const res = yield this._userRepository.updateUserEducation(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, education, education_id);
                if (res) {
                    return {
                        status: 201,
                        userData: res,
                        message: 'User education updated successfully'
                    };
                }
                else {
                    return {
                        status: 404,
                        message: 'User not found'
                    };
                }
            }
            else {
                const res = yield this._userRepository.addUserEducation(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, education);
                if (res) {
                    return {
                        status: 201,
                        userData: res,
                        message: 'User education updated successfully'
                    };
                }
                else {
                    return {
                        status: 404,
                        message: 'User not found'
                    };
                }
            }
        });
    }
    deleteUserEducation(token, edu_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const decode = this._jwt.verifyToken(token, "User");
            const updatedUserEducation = yield this._userRepository.deleteUserEducation(decode === null || decode === void 0 ? void 0 : decode.id, edu_id);
            if (!updatedUserEducation) {
                return {
                    status: 400,
                    message: 'User not found',
                };
            }
            return {
                status: 200,
                message: 'User education delete successful',
                userData: updatedUserEducation
            };
        });
    }
    updateUserSkills(token, skills) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedToken = this._jwt.verifyToken(token, "User");
            const res = yield this._userRepository.updateUserSkills(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id, skills);
            if (res) {
                return {
                    status: 201,
                    userData: res,
                    message: 'User skills updated successfully'
                };
            }
            else {
                return {
                    status: 404,
                    message: 'User not found'
                };
            }
        });
    }
    sendOTPToCurrentEmail(currentEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findByEmail(currentEmail);
            if (!user) {
                return {
                    status: 400,
                    message: 'Email not exists'
                };
            }
            const OTP = this._OTPgenerator.generateOTP();
            const res = yield this._mailer.sendMail(currentEmail, parseInt(OTP));
            this._userOTPRepo.insertOTP(currentEmail, parseInt(OTP));
            if (res) {
                return {
                    status: 200,
                    message: 'OTP successfully send to current registered main'
                };
            }
            else {
                return {
                    status: 400,
                    message: 'OTP send failed, try again'
                };
            }
        });
    }
    updateCurrentEmail(currentEmail, currentMailOTP, newEmail, newMailOTP) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentMail = yield this._userOTPRepo.getOtpByEmail(currentEmail);
            const newMail = yield this._userOTPRepo.getOtpByEmail(newEmail);
            if (!currentMail || !newMail) {
                return {
                    status: 400,
                    message: 'OTP not found, try again'
                };
            }
            if (currentMail.OTP != parseInt(currentMailOTP)) {
                return {
                    status: 400,
                    message: 'Current email OTP mismatch'
                };
            }
            else {
                if (newMail.OTP != parseInt(newMailOTP)) {
                    return {
                        status: 400,
                        message: 'New mail OTP mismatch'
                    };
                }
                const newData = yield this._userRepository.changeEmailByEmail(currentEmail, newEmail);
                if (!newData) {
                    return {
                        status: 400,
                        message: 'User not found'
                    };
                }
                return {
                    status: 200,
                    message: 'Email updated successfully'
                };
            }
        });
    }
}
exports.default = UserUseCase;
