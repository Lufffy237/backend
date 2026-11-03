"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getAllCategories = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middlewares/errorHandler");
exports.getAllCategories = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const categories = await database_1.prisma.category.findMany({
        include: { _count: { select: { articles: true } } },
        orderBy: { name: 'asc' },
    });
    res.status(200).json({ success: true, count: categories.length, data: categories });
});
exports.createCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { name, slug } = req.body;
    if (!name)
        throw new errorHandler_1.AppError('Le nom de la catégorie est requis', 400);
    const finalSlug = slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '').replace(/-+/g, '-');
    const existingCategory = await database_1.prisma.category.findUnique({ where: { slug: finalSlug } });
    if (existingCategory)
        throw new errorHandler_1.AppError('Une catégorie avec ce slug existe déjà', 400);
    const category = await database_1.prisma.category.create({ data: { name, slug: finalSlug } });
    res.status(201).json({ success: true, message: 'Catégorie créée avec succès', data: category });
});
exports.updateCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { name, slug } = req.body;
    const category = await database_1.prisma.category.findUnique({ where: { id } });
    if (!category)
        throw new errorHandler_1.AppError('Catégorie introuvable', 404);
    const finalSlug = slug || (name ? name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : category.slug);
    if (finalSlug !== category.slug) {
        const existingCategory = await database_1.prisma.category.findUnique({ where: { slug: finalSlug } });
        if (existingCategory)
            throw new errorHandler_1.AppError('Une catégorie avec ce slug existe déjà', 400);
    }
    const updatedCategory = await database_1.prisma.category.update({ where: { id }, data: { name: name || category.name, slug: finalSlug } });
    res.status(200).json({ success: true, message: 'Catégorie mise à jour', data: updatedCategory });
});
exports.deleteCategory = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const category = await database_1.prisma.category.findUnique({
        where: { id },
        include: { _count: { select: { articles: true } } },
    });
    if (!category)
        throw new errorHandler_1.AppError('Catégorie introuvable', 404);
    if (category._count.articles > 0) {
        throw new errorHandler_1.AppError(`Impossible de supprimer cette catégorie car elle contient ${category._count.articles} article(s).`, 400);
    }
    await database_1.prisma.category.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Catégorie supprimée avec succès' });
});
//# sourceMappingURL=category.controller.js.map