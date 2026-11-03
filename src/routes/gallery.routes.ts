import { Router } from 'express';
import { getAllGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../controllers/gallery.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', protect, getAllGalleryItems);
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), createGalleryItem);
router.put('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateGalleryItem);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteGalleryItem);

export default router;