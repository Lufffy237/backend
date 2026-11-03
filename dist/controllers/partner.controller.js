"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePartner = exports.updatePartner = exports.createPartner = exports.getAllPartners = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middlewares/errorHandler");
exports.getAllPartners = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const partners = await database_1.prisma.partner.findMany({ orderBy: { order: 'asc' } });
    res.status(200).json({ success: true, data: partners });
});
exports.createPartner = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { name, logo, website, order } = req.body;
    if (!name)
        throw new errorHandler_1.AppError('Le nom du partenaire est requis', 400);
    const partner = await database_1.prisma.partner.create({ data: { name, logo: logo || null, website: website || null, order: order || 0 } });
    res.status(201).json({ success: true, message: 'Partenaire ajouté', data: partner });
});
exports.updatePartner = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { name, logo, website, order } = req.body;
    const partner = await database_1.prisma.partner.findUnique({ where: { id } });
    if (!partner)
        throw new errorHandler_1.AppError('Partenaire introuvable', 404);
    const updated = await database_1.prisma.partner.update({
        where: { id },
        data: { name: name || partner.name, logo: logo !== undefined ? logo : partner.logo, website: website !== undefined ? website : partner.website, order: order !== undefined ? order : partner.order },
    });
    res.status(200).json({ success: true, message: 'Partenaire mis à jour', data: updated });
});
exports.deletePartner = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    await database_1.prisma.partner.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Partenaire supprimé' });
});
//# sourceMappingURL=partner.controller.js.map