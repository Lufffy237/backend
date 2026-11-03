import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler, AppError } from '../middlewares/errorHandler';

export const getAllGalleryItems = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, category } = req.query as any;
  const where: any = {};
  if (type && type !== 'ALL') where.type = type;
  if (category && category !== 'ALL') where.category = category;

  const items = await prisma.galleryImage.findMany({ where, orderBy: { uploadedAt: 'desc' } });
  res.status(200).json({ success: true, count: items.length, data: items });
});

export const createGalleryItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, category, title, url, thumbnail, videoUrl, videoPlatform, videoId, duration, location } = req.body;
  if (!type || !category || !title || !url) throw new AppError('Le type, la catégorie, le titre et l\'URL sont requis', 400);

  const item = await prisma.galleryImage.create({
    data: { type, category, title, url, thumbnail: thumbnail || null, videoUrl: videoUrl || null, videoPlatform: videoPlatform || null, videoId: videoId || null, duration: duration || null, location: location || null },
  });
  res.status(201).json({ success: true, message: 'Élément ajouté à la galerie', data: item });
});

export const updateGalleryItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  const { type, category, title, url, thumbnail, videoUrl, videoPlatform, videoId, duration, location } = req.body;
  const item = await prisma.galleryImage.findUnique({ where: { id } });
  if (!item) throw new AppError('Élément introuvable', 404);

  const updatedItem = await prisma.galleryImage.update({
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

export const deleteGalleryItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const id = req.params.id as string;
  await prisma.galleryImage.delete({ where: { id } });
  res.status(200).json({ success: true, message: 'Élément supprimé avec succès' });
});