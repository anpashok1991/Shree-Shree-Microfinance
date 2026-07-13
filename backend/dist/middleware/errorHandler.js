"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = require("../config/logger");
const errors_1 = require("../utils/errors");
function errorHandler(err, _req, res, _next) {
    if (err instanceof errors_1.AppError) {
        logger_1.logger.warn(`Operational error: ${err.message}`, {
            statusCode: err.statusCode,
            stack: err.stack,
        });
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(err.constructor.name === 'ValidationError' && {
                errors: err.errors,
            }),
        });
        return;
    }
    logger_1.logger.error(`Unexpected error: ${err.message}`, {
        stack: err.stack,
    });
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
}
//# sourceMappingURL=errorHandler.js.map