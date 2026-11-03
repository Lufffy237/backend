import { Router } from 'express';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Toutes les routes sont protégées. Seuls ADMIN et SUPER_ADMIN peuvent gérer les catégories.
router.get('/', protect, getAllCategories);
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), createCategory);
router.put('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateCategory);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteCategory);

export default router;