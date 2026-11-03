"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicArticleBySlug = exports.getPublicArticles = exports.deleteArticle = exports.updateArticle = exports.createArticle = exports.getArticleById = exports.getAllArticles = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middlewares/errorHandler");
exports.getAllArticles = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
    const articles = await database_1.prisma.article.findMany({
        include: { category: { select: { name: true } }, author: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, count: articles.length, data: articles });
});
exports.getArticleById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const article = await database_1.prisma.article.findUnique({
        where: { id },
        include: { category: true, author: { select: { name: true } } },
    });
    if (!article)
        throw new errorHandler_1.AppError('Article introuvable', 404);
    res.status(200).json({ success: true, data: article });
});
exports.createArticle = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { title, slug, content, excerpt, coverImage, categoryId, tags, published } = req.body;
    const authorId = req.user?.userId;
    if (!title || !content || !authorId)
        throw new errorHandler_1.AppError('Le titre, le contenu et l\'auteur sont requis', 400);
    const finalSlug = slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const article = await database_1.prisma.article.create({
        data: { title, slug: finalSlug, content, excerpt: excerpt || '', coverImage: coverImage || '', categoryId: categoryId || null, authorId, tags: tags || [], published: published || false },
        include: { category: true, author: { select: { name: true } } },
    });
    res.status(201).json({ success: true, message: 'Article créé avec succès', data: article });
});
exports.updateArticle = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    const { title, slug, content, excerpt, coverImage, categoryId, tags, published } = req.body;
    const article = await database_1.prisma.article.findUnique({ where: { id } });
    if (!article)
        throw new errorHandler_1.AppError('Article introuvable', 404);
    const finalSlug = slug || (title ? title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : article.slug);
    const updatedArticle = await database_1.prisma.article.update({
        where: { id },
        data: {
            title: title || article.title, slug: finalSlug, content: content || article.content,
            excerpt: excerpt !== undefined ? excerpt : article.excerpt, coverImage: coverImage !== undefined ? coverImage : article.coverImage,
            categoryId: categoryId !== undefined ? categoryId : article.categoryId, tags: tags !== undefined ? tags : article.tags,
            published: published !== undefined ? published : article.published,
        },
        include: { category: true, author: { select: { name: true } } },
    });
    res.status(200).json({ success: true, message: 'Article mis à jour', data: updatedArticle });
});
exports.deleteArticle = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const id = req.params.id;
    await database_1.prisma.article.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Article supprimé avec succès' });
});
exports.getPublicArticles = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { category, page = 1, limit = 6 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where = { published: true };
    if (category && category !== 'ALL')
        where.category = { slug: category };
    const [articles, total] = await Promise.all([
        database_1.prisma.article.findMany({ where, include: { category: { select: { name: true, slug: true } }, author: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, skip, take: Number(limit) }),
        database_1.prisma.article.count({ where }),
    ]);
    res.status(200).json({ success: true, data: articles, total, totalPages: Math.ceil(total / Number(limit)) });
});
exports.getPublicArticleBySlug = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const slug = req.params.slug;
    const article = await database_1.prisma.article.findUnique({
        where: { slug, published: true },
        include: { category: { select: { name: true, slug: true } }, author: { select: { name: true } } }
    });
    if (!article)
        throw new errorHandler_1.AppError('Article introuvable', 404);
    res.status(200).json({ success: true, data: article });
});
//# sourceMappingURL=article.controller.js.map