"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const database_1 = require("../config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const auth_validator_1 = require("../validators/auth.validator");
const errorHandler_1 = require("../middlewares/errorHandler");
exports.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const validatedData = auth_validator_1.loginSchema.parse(req.body);
    const { email, password } = validatedData;
    const user = await database_1.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive)
        throw new errorHandler_1.AppError('Email ou mot de passe incorrect', 401);
    const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid)
        throw new errorHandler_1.AppError('Email ou mot de passe incorrect', 401);
    const token = (0, jwt_1.generateToken)(user.id, user.role);
    res.status(200).json({
        success: true,
        message: 'Connexion réussie',
        data: {
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            token,
        },
    });
});
//# sourceMappingURL=auth.controller.js.map