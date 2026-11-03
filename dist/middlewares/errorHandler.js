"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = exports.AppError = void 0;
const logger_1 = require("../utils/logger");
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, _req, res, _next) => {
    let statusCode = 500;
    let message = 'Erreur interne du serveur';
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // Logger l'erreur (vérification de sécurité si logger est undefined)
    if (logger_1.logger) {
        logger_1.logger.error(`${statusCode} - ${message} - ${_req.originalUrl} - ${_req.method} - ${_req.ip}`);
    }
    // Réponse au client
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map