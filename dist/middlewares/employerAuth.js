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
exports.employerAuth = void 0;
const jwt_1 = __importDefault(require("../providers/jwt"));
const employerRepository_1 = __importDefault(require("../infrastructure/repositories/employerRepository"));
const jwt = new jwt_1.default();
const employerRepo = new employerRepository_1.default();
const employerAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.header('Employer-Token');
        if (!token) {
            res.status(401).json({ message: 'Unauthorized employer access denied' });
            return;
        }
        const decodedToken = jwt.verifyToken(token, "Employer");
        if ((decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.status) && decodedToken.status == 401) {
            res.status(decodedToken.status).json({ message: decodedToken.message });
            return;
        }
        else if ((decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.role) != 'Normal-employer') {
            res.status(401).json({ message: 'Unauthorized employer access denied' });
            return;
        }
        const employerData = employerRepo.findById(decodedToken.id);
        if (!employerData) {
            res.status(401).json({ message: 'Unauthorized employer token' });
        }
        else {
            next();
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.employerAuth = employerAuth;
exports.default = exports.employerAuth;
