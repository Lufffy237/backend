"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicJobOfferBySlug = exports.getPublicJobOffers = exports.deleteJobOffer = exports.updateJobOffer = exports.createJobOffer = exports.getJobOfferById = exports.getAllJobOffers = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middlewares/errorHandler");
const generateSlug = (title) => title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '').replace(/-+/g, '-');
exports.getAllJobOffers = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const jobOffers = await database_1.prisma.jobOffer.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, count: jobOffers.length, data: jobOffers });
});
exports.getJobOfferById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const jobOffer = await database_1.prisma.jobOffer.findUnique({ where: { id } });
    if (!jobOffer)
        throw new errorHandler_1.AppError('Offre introuvable', 404);
    res.status(200).json({ success: true, data: jobOffer });
});
exports.createJobOffer = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { title, type, location, contract, description, missions, profile, howToApply, active } = req.body;
    if (!title || !type || !location || !description)
        throw new errorHandler_1.AppError('Le titre, le type, la localisation et la description sont requis', 400);
    const jobOffer = await database_1.prisma.jobOffer.create({
        data: { title, slug: generateSlug(title), type, location, contract: contract || null, description, missions: missions || [], profile: profile || null, howToApply: howToApply || null, active: active !== undefined ? active : true },
    });
    res.status(201).json({ success: true, message: 'Offre créée avec succès', data: jobOffer });
});
exports.updateJobOffer = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { title, type, location, contract, description, missions, profile, howToApply, active } = req.body;
    const jobOffer = await database_1.prisma.jobOffer.findUnique({ where: { id } });
    if (!jobOffer)
        throw new errorHandler_1.AppError('Offre introuvable', 404);
    const newSlug = title ? generateSlug(title) : jobOffer.slug;
    const updatedJobOffer = await database_1.prisma.jobOffer.update({
        where: { id },
        data: { title: title || jobOffer.title, slug: newSlug, type: type || jobOffer.type, location: location || jobOffer.location, contract: contract !== undefined ? contract : jobOffer.contract, description: description || jobOffer.description, missions: missions !== undefined ? missions : jobOffer.missions, profile: profile !== undefined ? profile : jobOffer.profile, howToApply: howToApply !== undefined ? howToApply : jobOffer.howToApply, active: active !== undefined ? active : jobOffer.active },
    });
    res.status(200).json({ success: true, message: 'Offre mise à jour', data: updatedJobOffer });
});
exports.deleteJobOffer = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    await database_1.prisma.jobOffer.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Offre supprimée avec succès' });
});
exports.getPublicJobOffers = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { type, page = 1, limit = 6 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where = { active: true };
    if (type && type !== 'ALL')
        where.type = type;
    const [jobOffers, total] = await Promise.all([
        database_1.prisma.jobOffer.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: Number(limit) }),
        database_1.prisma.jobOffer.count({ where }),
    ]);
    res.status(200).json({ success: true, data: jobOffers, total, totalPages: Math.ceil(total / Number(limit)) });
});
exports.getPublicJobOfferBySlug = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const slug = req.params.slug;
    const jobOffer = await database_1.prisma.jobOffer.findUnique({ where: { slug, active: true } });
    if (!jobOffer)
        throw new errorHandler_1.AppError('Offre introuvable ou inactive', 404);
    await database_1.prisma.jobOffer.update({ where: { id: jobOffer.id }, data: { views: { increment: 1 } } });
    const updatedJobOffer = await database_1.prisma.jobOffer.findUnique({ where: { id: jobOffer.id } });
    res.status(200).json({ success: true, data: updatedJobOffer });
});
//# sourceMappingURL=jobOffer.controller.js.map