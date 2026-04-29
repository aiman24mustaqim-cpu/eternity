"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jwt_1 = require("../utils/jwt");
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existing = await User_1.default.findOne({ email });
        if (existing) {
            res.status(400).json({ success: false, message: 'Email is already registered' });
            return;
        }
        const user = await User_1.default.create({ name, email, password });
        const token = (0, jwt_1.generateToken)(user._id.toString(), user.email);
        res.status(201).json({ success: true, message: 'Account created!', token, user });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }
        const token = (0, jwt_1.generateToken)(user._id.toString(), user.email);
        const userObj = user.toObject();
        delete userObj.password;
        res.json({ success: true, message: 'Welcome back!', token, user: userObj });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const getMe = async (req, res, next) => {
    try {
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({ success: true, user });
    }
    catch (err) {
        next(err);
    }
};
exports.getMe = getMe;
const updateProfile = async (req, res, next) => {
    try {
        const user = await User_1.default.findByIdAndUpdate(req.userId, { name: req.body.name, avatar: req.body.avatar }, { new: true });
        res.json({ success: true, user });
    }
    catch (err) {
        next(err);
    }
};
exports.updateProfile = updateProfile;
