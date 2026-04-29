"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const User_1 = __importDefault(require("../models/User"));
const authenticate = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            res.status(401).json({ message: 'No authentication token provided' });
            return;
        }
        const token = header.split(' ')[1];
        const payload = (0, jwt_1.verifyToken)(token);
        if (!payload) {
            res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
            return;
        }
        const user = await User_1.default.findById(payload.userId).select('_id email plan');
        if (!user) {
            res.status(401).json({ message: 'User account no longer exists' });
            return;
        }
        req.userId = payload.userId;
        req.userEmail = user.email;
        req.userPlan = user.plan;
        next();
    }
    catch (err) {
        res.status(500).json({ message: 'Authentication error' });
    }
};
exports.authenticate = authenticate;
