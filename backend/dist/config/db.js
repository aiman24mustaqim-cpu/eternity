"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eternity';
    try {
        const conn = await mongoose_1.default.connect(uri);
        console.log(`✦ MongoDB connected: ${conn.connection.host}`);
    }
    catch (err) {
        console.error('MongoDB connection failed:', err);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
