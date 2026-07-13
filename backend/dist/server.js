"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const prisma_1 = require("./config/prisma");
const logger_1 = require("./config/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const routes_1 = __importDefault(require("./routes"));
const seed_1 = require("./seeds/seed");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({ crossOriginResourcePolicy: false }));
app.use((0, cors_1.default)({ origin: config_1.config.cors.origin }));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('combined', {
    stream: { write: (message) => logger_1.logger.info(message.trim()) },
}));
app.use('/api', rateLimiter_1.apiLimiter);
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'Shree Shree Microfinance API is running', timestamp: new Date().toISOString() });
});
app.use('/api', routes_1.default);
app.use(errorHandler_1.errorHandler);
async function start() {
    try {
        await (0, prisma_1.connectDatabase)();
        await (0, seed_1.seedAdmin)();
        app.listen(config_1.config.port, () => {
            logger_1.logger.info(`Server running on port ${config_1.config.port} in ${config_1.config.nodeEnv} mode`);
            console.log(`\n  🏦 Shree Shree Microfinance API`);
            console.log(`  ➜ Server: http://localhost:${config_1.config.port}`);
            console.log(`  ➜ Health: http://localhost:${config_1.config.port}/api/health\n`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
start();
exports.default = app;
//# sourceMappingURL=server.js.map