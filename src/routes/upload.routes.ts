import { Router } from 'express';
import { uploadImage, deleteImage } from '../controllers/upload.controller';
import { upload, handleUploadError } from '../middlewares/upload.middleware';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Upload d'image (protégé)
router.post('/image', protect, upload.single('image'), handleUploadError, uploadImage);

// Suppression d'image (protégé)
router.delete('/image/:filename', protect, deleteImage);

export default router;