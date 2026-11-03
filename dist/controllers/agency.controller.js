"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicAgencies = exports.deleteAgency = exports.updateAgency = exports.createAgency = exports.getAllAgencies = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middlewares/errorHandler");
exports.getAllAgencies = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const agencies = await database_1.prisma.agency.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, count: agencies.length, data: agencies });
});
exports.createAgency = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { name, type, country, city, province, address, phone, email, hours, latitude, longitude, published } = req.body;
    if (!name || !type || !country || !city || !address) {
        throw new errorHandler_1.AppError('Les champs nom, type, pays, ville et adresse sont requis', 400);
    }
    const agency = await database_1.prisma.agency.create({
        data: {
            name, type, country, city,
            province: province || null, address,
            phone: phone || null, email: email || null, hours: hours || null,
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
            published: published !== undefined ? published : true,
        },
    });
    res.status(201).json({ success: true, message: 'Agence créée avec succès', data: agency });
});
exports.updateAgency = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { name, type, country, city, province, address, phone, email, hours, latitude, longitude, published } = req.body;
    const agency = await database_1.prisma.agency.findUnique({ where: { id } });
    if (!agency)
        throw new errorHandler_1.AppError('Agence introuvable', 404);
    const updatedAgency = await database_1.prisma.agency.update({
        where: { id },
        data: {
            name: name || agency.name, type: type || agency.type, country: country || agency.country, city: city || agency.city,
            province: province !== undefined ? province : agency.province, address: address || agency.address,
            phone: phone !== undefined ? phone : agency.phone, email: email !== undefined ? email : agency.email,
            hours: hours !== undefined ? hours : agency.hours,
            latitude: latitude !== undefined ? parseFloat(latitude) : agency.latitude,
            longitude: longitude !== undefined ? parseFloat(longitude) : agency.longitude,
            published: published !== undefined ? published : agency.published,
        },
    });
    res.status(200).json({ success: true, message: 'Agence mise à jour avec succès', data: updatedAgency });
});
exports.deleteAgency = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const agency = await database_1.prisma.agency.findUnique({ where: { id } });
    if (!agency)
        throw new errorHandler_1.AppError('Agence introuvable', 404);
    await database_1.prisma.agency.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Agence supprimée avec succès' });
});
exports.getPublicAgencies = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const agencies = await database_1.prisma.agency.findMany({
        where: { published: true },
        orderBy: [{ country: 'asc' }, { city: 'asc' }, { name: 'asc' }]
    });
    res.status(200).json({ success: true, count: agencies.length, data: agencies });
});
//# sourceMappingURL=agency.controller.js.map