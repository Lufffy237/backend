import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler, AppError } from '../middlewares/errorHandler';

const generateSlug = (title: string) => title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '').replace(/-+/g, '-');

export const getAllJobOffers = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const jobOffers = await prisma.jobOffer.findMany({ orderBy: { createdAt: 'desc' } });
  res.status(200).json({ success: true, count: jobOffers.length, data: jobOffers });
});

export const getJobOfferById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const jobOffer = await prisma.jobOffer.findUnique({ where: { id } });
  if (!jobOffer) throw new AppError('Offre introuvable', 404);
  res.status(200).json({ success: true, data: jobOffer });
});

export const createJobOffer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { title, type, location, contract, description, missions, profile, howToApply, active } = req.body;
  if (!title || !type || !location || !description) throw new AppError('Le titre, le type, la localisation et la description sont requis', 400);

  const jobOffer = await prisma.jobOffer.create({
    data: { title, slug: generateSlug(title), type, location, contract: contract || null, description, missions: missions || [], profile: profile || null, howToApply: howToApply || null, active: active !== undefined ? active : true },
  });
  res.status(201).json({ success: true, message: 'Offre créée avec succès', data: jobOffer });
});

export const updateJobOffer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { title, type, location, contract, description, missions, profile, howToApply, active } = req.body;
  const jobOffer = await prisma.jobOffer.findUnique({ where: { id } });
  if (!jobOffer) throw new AppError('Offre introuvable', 404);

  const newSlug = title ? generateSlug(title) : jobOffer.slug;
  const updatedJobOffer = await prisma.jobOffer.update({
    where: { id },
    data: { title: title || jobOffer.title, slug: newSlug, type: type || jobOffer.type, location: location || jobOffer.location, contract: contract !== undefined ? contract : jobOffer.contract, description: description || jobOffer.description, missions: missions !== undefined ? missions : jobOffer.missions, profile: profile !== undefined ? profile : jobOffer.profile, howToApply: howToApply !== undefined ? howToApply : jobOffer.howToApply, active: active !== undefined ? active : jobOffer.active },
  });
  res.status(200).json({ success: true, message: 'Offre mise à jour', data: updatedJobOffer });
});

export const deleteJobOffer = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await prisma.jobOffer.delete({ where: { id } });
  res.status(200).json({ success: true, message: 'Offre supprimée avec succès' });
});

export const getPublicJobOffers = asyncHandler(async (req: Request, res: Response) => {
  const { type, page = 1, limit = 6 } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);
  const where: any = { active: true };
  if (type && type !== 'ALL') where.type = type;

  const [jobOffers, total] = await Promise.all([
    prisma.jobOffer.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: Number(limit) }),
    prisma.jobOffer.count({ where }),
  ]);
  res.status(200).json({ success: true, data: jobOffers, total, totalPages: Math.ceil(total / Number(limit)) });
});

export const getPublicJobOfferBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const jobOffer = await prisma.jobOffer.findUnique({ where: { slug, active: true } });
  if (!jobOffer) throw new AppError('Offre introuvable ou inactive', 404);

  await prisma.jobOffer.update({ where: { id: jobOffer.id }, data: { views: { increment: 1 } } });
  const updatedJobOffer = await prisma.jobOffer.findUnique({ where: { id: jobOffer.id } });
  res.status(200).json({ success: true, data: updatedJobOffer });
});