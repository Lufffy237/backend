import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler, AppError } from '../middlewares/errorHandler';

export const getAllAwards = asyncHandler(async (_req: Request, res: Response) => {
  const awards = await prisma.award.findMany({ orderBy: { order: 'asc' } });
  res.status(200).json({ success: true, data: awards });
});

export const createAward = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, year, issuer, image, order } = req.body;
  if (!title || !year) throw new AppError('Le titre et l\'année sont requis', 400);
  const award = await prisma.award.create({ data: { title, year: parseInt(year), issuer: issuer || null, image: image || null, order: order || 0 } });
  res.status(201).json({ success: true, message: 'Distinction ajoutée', data: award });
});

export const updateAward = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { title, year, issuer, image, order } = req.body;
  const award = await prisma.award.findUnique({ where: { id } });
  if (!award) throw new AppError('Distinction introuvable', 404);

  const updated = await prisma.award.update({
    where: { id },
    data: { title: title || award.title, year: year ? parseInt(year) : award.year, issuer: issuer !== undefined ? issuer : award.issuer, image: image !== undefined ? image : award.image, order: order !== undefined ? order : award.order },
  });
  res.status(200).json({ success: true, message: 'Distinction mise à jour', data: updated });
});

export const deleteAward = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await prisma.award.delete({ where: { id } });
  res.status(200).json({ success: true, message: 'Distinction supprimée' });
});