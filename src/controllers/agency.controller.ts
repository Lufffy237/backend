import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler, AppError } from '../middlewares/errorHandler';

export const getAllAgencies = asyncHandler(async (_req: AuthRequest, res: Response) => {
  const agencies = await prisma.agency.findMany({ orderBy: { createdAt: 'desc' } });
  res.status(200).json({ success: true, count: agencies.length, data: agencies });
});

export const createAgency = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, type, country, city, province, address, phone, email, hours, latitude, longitude, published } = req.body;
  if (!name || !type || !country || !city || !address) {
    throw new AppError('Les champs nom, type, pays, ville et adresse sont requis', 400);
  }
  const agency = await prisma.agency.create({
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

export const updateAgency = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { name, type, country, city, province, address, phone, email, hours, latitude, longitude, published } = req.body;

  const agency = await prisma.agency.findUnique({ where: { id } });
  if (!agency) throw new AppError('Agence introuvable', 404);

  const updatedAgency = await prisma.agency.update({
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

export const deleteAgency = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const agency = await prisma.agency.findUnique({ where: { id } });
  if (!agency) throw new AppError('Agence introuvable', 404);

  await prisma.agency.delete({ where: { id } });
  res.status(200).json({ success: true, message: 'Agence supprimée avec succès' });
});

export const getPublicAgencies = asyncHandler(async (_req: any, res: Response) => {
  const agencies = await prisma.agency.findMany({
    where: { published: true },
    orderBy: [{ country: 'asc' }, { city: 'asc' }, { name: 'asc' }]
  });
  res.status(200).json({ success: true, count: agencies.length, data: agencies });
});