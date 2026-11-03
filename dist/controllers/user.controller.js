"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const database_1 = require("../config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_validator_1 = require("../validators/user.validator");
const errorHandler_1 = require("../middlewares/errorHandler");
exports.getAllUsers = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (req.user?.role !== 'SUPER_ADMIN')
        throw new errorHandler_1.AppError('Accès refusé : Réservé au Super Administrateur', 403);
    const users = await database_1.prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true }, orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, count: users.length, data: users });
});
exports.createUser = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (req.user?.role !== 'SUPER_ADMIN')
        throw new errorHandler_1.AppError('Accès refusé : Réservé au Super Administrateur', 403);
    const validatedData = user_validator_1.createUserSchema.parse(req.body);
    const { name, email, password, role, isActive } = validatedData;
    const existingUser = await database_1.prisma.user.findUnique({ where: { email } });
    if (existingUser)
        throw new errorHandler_1.AppError('Cet email est déjà utilisé', 400);
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await database_1.prisma.user.create({ data: { name, email, password: hashedPassword, role, isActive: isActive ?? true }, select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true } });
    res.status(201).json({ success: true, message: 'Utilisateur créé avec succès', data: user });
});
exports.updateUser = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (req.user?.role !== 'SUPER_ADMIN')
        throw new errorHandler_1.AppError('Accès refusé : Réservé au Super Administrateur', 403);
    const id = req.params.id;
    const { name, email, role, isActive } = req.body;
    if (id === req.user?.userId && role && role !== 'SUPER_ADMIN')
        throw new errorHandler_1.AppError('Vous ne pouvez pas modifier votre propre rôle via cette interface', 400);
    if (email) {
        const existingUser = await database_1.prisma.user.findFirst({ where: { email, id: { not: id } } });
        if (existingUser)
            throw new errorHandler_1.AppError('Cet email est déjà utilisé par un autre compte', 400);
    }
    const updatedUser = await database_1.prisma.user.update({
        where: { id },
        data: { name: name || undefined, email: email || undefined, role: role || undefined, isActive: isActive !== undefined ? isActive : undefined },
        select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    });
    res.status(200).json({ success: true, message: 'Utilisateur mis à jour avec succès', data: updatedUser });
});
exports.deleteUser = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (req.user?.role !== 'SUPER_ADMIN')
        throw new errorHandler_1.AppError('Accès refusé : Réservé au Super Administrateur', 403);
    const id = req.params.id;
    if (id === req.user?.userId)
        throw new errorHandler_1.AppError('Vous ne pouvez pas supprimer votre propre compte', 400);
    await database_1.prisma.user.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Utilisateur supprimé avec succès' });
});
exports.updateProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { name, email, password } = req.body;
    const userId = req.user?.userId;
    if (!userId)
        throw new errorHandler_1.AppError('Non autorisé', 401);
    if (email) {
        const existingUser = await database_1.prisma.user.findFirst({ where: { email, id: { not: userId } } });
        if (existingUser)
            throw new errorHandler_1.AppError('Cet email est déjà utilisé par un autre compte', 400);
    }
    const updateData = { name: name || undefined, email: email || undefined };
    if (password && password.length >= 6)
        updateData.password = await bcrypt_1.default.hash(password, 10);
    const updatedUser = await database_1.prisma.user.update({ where: { id: userId }, data: updateData, select: { id: true, name: true, email: true, role: true, isActive: true } });
    res.status(200).json({ success: true, message: 'Profil mis à jour avec succès', data: updatedUser });
});
//# sourceMappingURL=user.controller.js.map