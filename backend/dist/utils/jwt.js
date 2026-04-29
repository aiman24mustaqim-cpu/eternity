"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET || 'fallback_secret_change_in_production';
const EXPIRES = process.env.JWT_EXPIRES_IN || '7d';
const generateToken = (userId, email) => {
    return jsonwebtoken_1.default.sign({ userId, email }, SECRET, { expiresIn: EXPIRES });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, SECRET);
    }
    catch {
        return null;
    }
};
exports.verifyToken = verifyToken;
