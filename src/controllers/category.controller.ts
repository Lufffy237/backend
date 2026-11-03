import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler, AppError } from '../middlewares/errorHandler';

export const getAllCategories = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { articles: true } } },
    orderBy: { name: 'asc' },
  });
  res.status(200).json({ success: true, count: categories.length, data: categories });
});

export const createCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, slug } = req.body;
  if (!name) throw new AppError('Le nom de la catégorie est requis', 400);

  const finalSlug = slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '').replace(/-+/g, '-');
  const existingCategory = await prisma.category.findUnique({ where: { slug: finalSlug } });
  if (existingCategory) throw new AppError('Une catégorie avec ce slug existe déjà', 400);

  const category = await prisma.category.create({ data: { name, slug: finalSlug } });
  res.status(201).json({ success: true, message: 'Catégorie créée avec succès', data: category });
});

export const updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { name, slug } = req.body;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) throw new AppError('Catégorie introuvable', 404);

  const finalSlug = slug || (name ? name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : category.slug);
  if (finalSlug !== category.slug) {
    const existingCategory = await prisma.category.findUnique({ where: { slug: finalSlug } });
    if (existingCategory) throw new AppError('Une catégorie avec ce slug existe déjà', 400);
  }

  const updatedCategory = await prisma.category.update({ where: { id }, data: { name: name || category.name, slug: finalSlug } });
  res.status(200).json({ success: true, message: 'Catégorie mise à jour', data: updatedCategory });
});

export const deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { articles: true } } },
  });
  if (!category) throw new AppError('Catégorie introuvable', 404);
  if (category._count.articles > 0) {
    throw new AppError(`Impossible de supprimer cette catégorie car elle contient ${category._count.articles} article(s).`, 400);
  }
  await prisma.category.delete({ where: { id } });
  res.status(200).json({ success: true, message: 'Catégorie supprimée avec succès' });
});