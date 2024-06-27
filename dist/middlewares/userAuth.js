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
exports.userAuth = void 0;
const userRepository_1 = __importDefault(require("../infrastructure/repositories/userRepository"));
const jwt_1 = __importDefault(require("../providers/jwt"));
const jwt = new jwt_1.default();
const userRepo = new userRepository_1.default();
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header('User-Token');
        if (!token) {
            res.status(401).json({ message: 'Unauthorized user access denied' });
            return;
        }
        const decodedToken = jwt.verifyToken(token, "User");
        console.log('dec', decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id);
        if ((decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.status) && decodedToken.status == 401) {
            res.status(decodedToken.status).json({ message: decodedToken.message });
            return;
        }
        else if ((decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role) != 'Normal-User') {
            console.log(decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role);
            res.status(401).json({ message: 'Unauthorized user access denied' });
            return;
        }
        const userData = yield userRepo.findById(decodedToken.id);
        if (!userData) {
            res.status(401).json({ message: 'Unauthorized user access denied' });
        }
        else if (!userData.isActive) {
            res.status(401).json({ message: 'Your account is blocked by admin' });
        }
        else {
            next();
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.userAuth = userAuth;
exports.default = exports.userAuth;
