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
class EmployerController {
    constructor(_employerUseCase) {
        this._employerUseCase = _employerUseCase;
    }
    sendOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const response = yield this._employerUseCase.sendOTP(email);
                res.status(response.status).json(response.message);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const employerData = req.body;
                console.log(employerData);
                console.log(req.file);
                if (req.file) {
                    const resumeUpload = yield cloudinary_1.default.uploader.upload(req.file.path, { resource_type: 'raw' });
                    console.log(resumeUpload.url);
                    employerData.verificationDocument = resumeUpload.url;
                }
                const result = yield this._employerUseCase.register(employerData);
                res.status(result.status).json(result.message);
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
                console.log('emp login');
                const { email, password } = req.body;
                const employer = yield this._employerUseCase.login(email, password);
                console.log(employer);
                if (employer && employer.accessToken && employer.refreshToken) {
                    return res
                        .status(200)
                        .json({
                        employer,
                    });
                }
                else {
                    console.log('else');
                    return res
                        .status(400)
                        .json({
                        employer,
                    });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.body.refreshToken;
                if (token) {
                    const result = yield this._employerUseCase.refreshToken(token);
                    res.status(result.status).json({ message: result.message, accessToken: result.accessToken, refreshToken: result.refreshToken, refreshTokenExpired: result.refreshTokenExpired });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    loadCompanies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._employerUseCase.loadCompanies();
                res.status(result.status).json({ message: result.message, data: result.employers });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    fetchEmployerData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = req.header('Employer-Token');
                if (token) {
                    const result = yield this._employerUseCase.fetchEmployerData(token);
                    res.status(result === null || result === void 0 ? void 0 : result.status).json({ message: result.message, employerData: result === null || result === void 0 ? void 0 : result.employerData });
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
                const result = yield this._employerUseCase.forgotPasswordSendOTP(email);
                res.status(result.status).json(result.message);
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
                const data = yield this._employerUseCase.resetPassword(email, OTP, password);
                res.status(data.status).json(data.message);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (req.file) {
                    console.log('before upload');
                    const data = yield cloudinary_1.default.uploader.upload((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
                    console.log('after upload');
                    if (data.url) {
                        const newData = Object.assign(Object.assign({}, req.body), { profile_url: data.url });
                        const result = yield this._employerUseCase.updateProfile(newData);
                        if (result.oldProfileUrl) {
                            console.log('before destroy');
                            yield cloudinary_1.default.uploader.destroy(result.oldProfileUrl);
                            console.log('after destroy');
                        }
                        res.status(result.status).json({ message: result.message, updatedData: result.employerData });
                    }
                    else {
                        throw new Error('Unable to get Cloudinary URL');
                    }
                }
                else {
                    const newData = Object.assign({}, req.body);
                    const data = yield this._employerUseCase.updateProfile(newData);
                    res.status(data.status).json({ updatedData: data.employerData, message: data.message });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
    updateEmailWithOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, OTP, newEmail } = req.body;
                const result = yield this._employerUseCase.updateEmailWithOTP(email, OTP, newEmail);
                res.status(result.status).json({ message: result.message, data: result === null || result === void 0 ? void 0 : result.EmployerData });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Something went wrong' });
            }
        });
    }
}
exports.default = EmployerController;
