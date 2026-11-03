import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler, AppError } from '../middlewares/errorHandler';

export const getAllPartners = asyncHandler(async (_req: Request, res: Response) => {
  const partners = await prisma.partner.findMany({ orderBy: { order: 'asc' } });
  res.status(200).json({ success: true, data: partners });
});

export const createPartner = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, logo, website, order } = req.body;
  if (!name) throw new AppError('Le nom du partenaire est requis', 400);
  const partner = await prisma.partner.create({ data: { name, logo: logo || null, website: website || null, order: order || 0 } });
  res.status(201).json({ success: true, message: 'Partenaire ajouté', data: partner });
});

export const updatePartner = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { name, logo, website, order } = req.body;
  const partner = await prisma.partner.findUnique({ where: { id } });
  if (!partner) throw new AppError('Partenaire introuvable', 404);

  const updated = await prisma.partner.update({
    where: { id },
    data: { name: name || partner.name, logo: logo !== undefined ? logo : partner.logo, website: website !== undefined ? website : partner.website, order: order !== undefined ? order : partner.order },
  });
  res.status(200).json({ success: true, message: 'Partenaire mis à jour', data: updated });
});

export const deletePartner = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await prisma.partner.delete({ where: { id } });
  res.status(200).json({ success: true, message: 'Partenaire supprimé' });
});