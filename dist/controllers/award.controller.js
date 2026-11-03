"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAward = exports.updateAward = exports.createAward = exports.getAllAwards = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middlewares/errorHandler");
exports.getAllAwards = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const awards = await database_1.prisma.award.findMany({ orderBy: { order: 'asc' } });
    res.status(200).json({ success: true, data: awards });
});
exports.createAward = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { title, year, issuer, image, order } = req.body;
    if (!title || !year)
        throw new errorHandler_1.AppError('Le titre et l\'année sont requis', 400);
    const award = await database_1.prisma.award.create({ data: { title, year: parseInt(year), issuer: issuer || null, image: image || null, order: order || 0 } });
    res.status(201).json({ success: true, message: 'Distinction ajoutée', data: award });
});
exports.updateAward = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { title, year, issuer, image, order } = req.body;
    const award = await database_1.prisma.award.findUnique({ where: { id } });
    if (!award)
        throw new errorHandler_1.AppError('Distinction introuvable', 404);
    const updated = await database_1.prisma.award.update({
        where: { id },
        data: { title: title || award.title, year: year ? parseInt(year) : award.year, issuer: issuer !== undefined ? issuer : award.issuer, image: image !== undefined ? image : award.image, order: order !== undefined ? order : award.order },
    });
    res.status(200).json({ success: true, message: 'Distinction mise à jour', data: updated });
});
exports.deleteAward = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    await database_1.prisma.award.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Distinction supprimée' });
});
//# sourceMappingURL=award.controller.js.map