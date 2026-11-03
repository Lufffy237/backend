"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
const errorHandler_1 = require("./errorHandler");
/**
 * Middleware pour vérifier si l'utilisateur est connecté
 */
const protect = (req, _res, next) => {
    let token;
    // Vérifier le header Authorization: Bearer <token>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new errorHandler_1.AppError('Non autorisé : Aucun token fourni', 401));
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return next(new errorHandler_1.AppError('Non autorisé : Token invalide ou expiré', 401));
    }
};
exports.protect = protect;
/**
 * Middleware pour vérifier les rôles autorisés
 * Exemple d'utilisation : authorize('SUPER_ADMIN', 'ADMIN')
 */
const authorize = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new errorHandler_1.AppError('Permissions insuffisantes', 403));
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map