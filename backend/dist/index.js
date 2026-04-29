"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const auth_1 = __importDefault(require("./routes/auth"));
const templates_1 = __importDefault(require("./routes/templates"));
const packages_1 = __importDefault(require("./routes/packages"));
const payments_1 = __importDefault(require("./routes/payments"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || '5000';
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));
app.use('/api/payments/webhook', express_1.default.raw({ type: 'application/json' }));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
const limiter = (0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api', limiter);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
app.use('/api/auth', auth_1.default);
app.use('/api/templates', templates_1.default);
app.use('/api/packages', packages_1.default);
app.use('/api/payments', payments_1.default);
app.use('/api/uploads', uploads_1.default);
app.get('/api/health', (_, res) => {
    res.json({ status: 'ok', app: process.env.APP_NAME || 'Eternity' });
});
app.use('*', (req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});
app.use(errorHandler_1.errorHandler);
const startServer = async () => {
    await (0, db_1.connectDB)();
    app.listen(PORT, () => {
        console.log(`\n✦ Eternity API running on port ${PORT}`);
        console.log(`✦ Environment: ${process.env.NODE_ENV}\n`);
    });
};
startServer();
exports.default = app;
