import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler, AppError } from '../middlewares/errorHandler';

export const getAllArticles = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const articles = await prisma.article.findMany({
    include: { category: { select: { name: true } }, author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });
  res.status(200).json({ success: true, count: articles.length, data: articles });
});

export const getArticleById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const article = await prisma.article.findUnique({
    where: { id },
    include: { category: true, author: { select: { name: true } } },
  });
  if (!article) throw new AppError('Article introuvable', 404);
  res.status(200).json({ success: true, data: article });
});

export const createArticle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, slug, content, excerpt, coverImage, categoryId, tags, published } = req.body;
  const authorId = req.user?.userId;
  if (!title || !content || !authorId) throw new AppError('Le titre, le contenu et l\'auteur sont requis', 400);

  const finalSlug = slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  const article = await prisma.article.create({
    data: { title, slug: finalSlug, content, excerpt: excerpt || '', coverImage: coverImage || '', categoryId: categoryId || null, authorId, tags: tags || [], published: published || false },
    include: { category: true, author: { select: { name: true } } },
  });
  res.status(201).json({ success: true, message: 'Article créé avec succès', data: article });
});

export const updateArticle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { title, slug, content, excerpt, coverImage, categoryId, tags, published } = req.body;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) throw new AppError('Article introuvable', 404);

  const finalSlug = slug || (title ? title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : article.slug);
  const updatedArticle = await prisma.article.update({
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

export const deleteArticle = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await prisma.article.delete({ where: { id } });
  res.status(200).json({ success: true, message: 'Article supprimé avec succès' });
});

export const getPublicArticles = asyncHandler(async (req: Request, res: Response) => {
  const { category, page = 1, limit = 6 } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = { published: true };
  if (category && category !== 'ALL') where.category = { slug: category };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({ where, include: { category: { select: { name: true, slug: true } }, author: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, skip, take: Number(limit) }),
    prisma.article.count({ where }),
  ]);
  res.status(200).json({ success: true, data: articles, total, totalPages: Math.ceil(total / Number(limit)) });
});

export const getPublicArticleBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const article = await prisma.article.findUnique({
    where: { slug, published: true },
    include: { category: { select: { name: true, slug: true } }, author: { select: { name: true } } }
  });
  if (!article) throw new AppError('Article introuvable', 404);
  res.status(200).json({ success: true, data: article });
});