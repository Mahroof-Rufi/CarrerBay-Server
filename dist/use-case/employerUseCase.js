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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
class EmployerUseCase {
    constructor(_employerRepository, _employerOTPRepository, _OTPGenerator, _mailer, _jwt) {
        this._employerRepository = _employerRepository;
        this._employerOTPRepository = _employerOTPRepository;
        this._OTPGenerator = _OTPGenerator;
        this._mailer = _mailer;
        this._jwt = _jwt;
    }
    sendOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const OTP = this._OTPGenerator.generateOTP();
            const employer = yield this._employerRepository.findByEmail(email);
            if (!employer) {
                const res = yield this._mailer.sendMail(email, parseInt(OTP));
                this._employerOTPRepository.insertOTP(email, parseInt(OTP));
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
    register(employerData) {
        return __awaiter(this, void 0, void 0, function* () {
            const employer = yield this._employerRepository.findByEmail(employerData.email);
            if (!employer) {
                const otp = yield this._employerOTPRepository.getOtpByEmail(employerData.email);
                if ((otp === null || otp === void 0 ? void 0 : otp.OTP) == employerData.OTP) {
                    yield this._employerRepository.insertOne(employerData);
                    return {
                        status: 200,
                        message: 'Registration successful'
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
    login(email, employerPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const employerData = yield this._employerRepository.findByEmail(email);
            if (employerData) {
                if (employerPassword !== employerData.password) {
                    return {
                        status: 400,
                        message: 'Invalid credentials'
                    };
                }
                else if (!employerData.isVerified) {
                    return {
                        status: 400,
                        message: 'Your account is not yet verified by Admin'
                    };
                }
                else if (!employerData.isActive) {
                    return {
                        status: 400,
                        message: 'Your account blocked by Admin'
                    };
                }
                const accessToken = this._jwt.createAccessToken(employerData._id, 'Normal-employer');
                const refreshToken = this._jwt.createRefreshToken(employerData._id, 'Normal-employer');
                const { password } = employerData, employerDataWithoutPassword = __rest(employerData, ["password"]);
                return {
                    status: 200,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    employerData: employerDataWithoutPassword,
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
    fetchEmployerData(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decode = this._jwt.verifyToken(token, "Employer");
            const res = yield this._employerRepository.findById(decode === null || decode === void 0 ? void 0 : decode.id);
            if (res) {
                return {
                    status: 200,
                    employerData: res,
                    message: 'Operation success'
                };
            }
            else {
                return {
                    status: 401,
                    message: 'Employer not found'
                };
            }
        });
    }
    forgotPasswordSendOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield this._employerRepository.findByEmail(email);
            if (company) {
                const OTP = this._OTPGenerator.generateOTP();
                const res = yield this._mailer.sendMail(email, parseInt(OTP));
                this._employerOTPRepository.insertOTP(email, parseInt(OTP));
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
            const realOTP = yield this._employerOTPRepository.getOtpByEmail(email);
            if ((realOTP === null || realOTP === void 0 ? void 0 : realOTP.OTP) == OTP) {
                const res = yield this._employerRepository.updatePassword(email, password);
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
    loadCompanies() {
        return __awaiter(this, void 0, void 0, function* () {
            const limit = 12;
            const employers = yield this._employerRepository.fetchAllEmployers(limit, 0);
            if (!employers) {
                return {
                    status: 400,
                    message: 'Employers not found'
                };
            }
            return {
                status: 200,
                message: 'Employers found successfully',
                employers: employers
            };
        });
    }
    updateProfile(newData) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._employerRepository.updateProfile(newData.email, newData);
            if (data) {
                const updatedData = yield this._employerRepository.findByEmail(data.email);
                return {
                    status: 200,
                    oldProfileUrl: data.profile_url,
                    employerData: updatedData,
                    message: 'Profile updated successfully'
                };
            }
            else {
                return {
                    status: 400,
                    message: 'Something went wrong'
                };
            }
        });
    }
    updateEmailWithOTP(email, OTP, newMail) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = yield this._employerOTPRepository.getOtpByEmail(email);
            if ((otp === null || otp === void 0 ? void 0 : otp.OTP) == OTP) {
                const updatedData = yield this._employerRepository.updateEmail(email, newMail);
                return {
                    status: 200,
                    message: 'Email updated Successfully',
                    EmployerData: updatedData
                };
            }
            else {
                return {
                    status: 400,
                    message: 'Invalid OTP',
                };
            }
        });
    }
}
exports.default = EmployerUseCase;
