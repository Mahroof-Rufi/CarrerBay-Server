"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Jwt {
    constructor() {
        this._secretKey = process.env.JWT_Secret || "";
    }
    createAccessToken(id, role) {
        try {
            console.log('create token', role, '  ', id);
            if (!this._secretKey) {
                throw new Error('Secret key is undefined');
            }
            const payload = { id, role };
            const token = (0, jsonwebtoken_1.sign)(payload, this._secretKey, { expiresIn: '24h' });
            return token;
        }
        catch (error) {
            console.error(error);
        }
    }
    createRefreshToken(id, role) {
        try {
            if (!this._secretKey) {
                throw new Error('Secret key is undefined');
            }
            const payload = { id, role };
            const token = (0, jsonwebtoken_1.sign)(payload, this._secretKey, { expiresIn: '7d' });
            return token;
        }
        catch (error) {
            console.error(error);
        }
    }
    verifyToken(token, role) {
        try {
            const decodedToken = (0, jsonwebtoken_1.verify)(token, this._secretKey);
            return decodedToken;
        }
        catch (error) {
            if (error.name == 'TokenExpiredError') {
                switch (role) {
                    case 'User':
                        return {
                            status: 401,
                            message: 'User token expired'
                        };
                    case 'Employer':
                        return {
                            status: 401,
                            message: 'Employer token expired'
                        };
                    case 'Admin':
                        return {
                            status: 401,
                            message: 'Admin token expired'
                        };
                }
            }
            else {
                console.error(error);
                return {
                    status: 40,
                    message: 'Invalid Token'
                };
            }
        }
    }
    verifyRefreshToken(token) {
        try {
            const decodedToken = (0, jsonwebtoken_1.verify)(token, this._secretKey);
            return decodedToken;
        }
        catch (error) {
            if (error.name == 'TokenExpiredError') {
                return {
                    status: 401,
                    message: 'Refresh token expired, login again'
                };
            }
            else {
                console.error(error);
                return {
                    status: 40,
                    message: 'Invalid Token'
                };
            }
        }
    }
}
exports.default = Jwt;
