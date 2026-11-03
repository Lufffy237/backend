import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/errorHandler';
import * as fs from 'fs';
import * as path from 'path';

export const uploadImage = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Aucun fichier uploadé' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  return res.status(200).json({
    success: true, message: 'Image uploadée avec succès',
    data: { filename: req.file.filename, originalname: req.file.originalname, size: req.file.size, url: fileUrl },
  });
});

export const deleteImage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const filename = req.params.filename as string;
  const filePath = path.join(__dirname, '../../uploads', filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return res.status(200).json({ success: true, message: 'Image supprimée' });
  }
  return res.status(404).json({ success: false, message: 'Image introuvable' });
});