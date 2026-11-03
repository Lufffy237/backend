"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGalleryItem = exports.updateGalleryItem = exports.createGalleryItem = exports.getAllGalleryItems = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middlewares/errorHandler");
exports.getAllGalleryItems = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { type, category } = req.query;
    const where = {};
    if (type && type !== 'ALL')
        where.type = type;
    if (category && category !== 'ALL')
        where.category = category;
    const items = await database_1.prisma.galleryImage.findMany({ where, orderBy: { uploadedAt: 'desc' } });
    res.status(200).json({ success: true, count: items.length, data: items });
});
exports.createGalleryItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { type, category, title, url, thumbnail, videoUrl, videoPlatform, videoId, duration, location } = req.body;
    if (!type || !category || !title || !url)
        throw new errorHandler_1.AppError('Le type, la catégorie, le titre et l\'URL sont requis', 400);
    const item = await database_1.prisma.galleryImage.create({
        data: { type, category, title, url, thumbnail: thumbnail || null, videoUrl: videoUrl || null, videoPlatform: videoPlatform || null, videoId: videoId || null, duration: duration || null, location: location || null },
    });
    res.status(201).json({ success: true, message: 'Élément ajouté à la galerie', data: item });
});
exports.updateGalleryItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { type, category, title, url, thumbnail, videoUrl, videoPlatform, videoId, duration, location } = req.body;
    const item = await database_1.prisma.galleryImage.findUnique({ where: { id } });
    if (!item)
        throw new errorHandler_1.AppError('Élément introuvable', 404);
    const updatedItem = await database_1.prisma.galleryImage.update({
        where: { id },
        data: {
            type: type || item.type, category: category || item.category, title: title || item.title, url: url || item.url,
            thumbnail: thumbnail !== undefined ? thumbnail : item.thumbnail, videoUrl: videoUrl !== undefined ? videoUrl : item.videoUrl,
            videoPlatform: videoPlatform !== undefined ? videoPlatform : item.videoPlatform, videoId: videoId !== undefined ? videoId : item.videoId,
            duration: duration !== undefined ? duration : item.duration, location: location !== undefined ? location : item.location,
        },
    });
    res.status(200).json({ success: true, message: 'Élément mis à jour', data: updatedItem });
});
exports.deleteGalleryItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    await database_1.prisma.galleryImage.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Élément supprimé avec succès' });
});
//# sourceMappingURL=gallery.controller.js.map