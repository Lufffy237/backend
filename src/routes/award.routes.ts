import { Router } from 'express';
import { getAllAwards, createAward, updateAward, deleteAward } from '../controllers/award.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Route publique pour récupérer les distinctions (pour le site vitrine)
router.get('/', getAllAwards);

// Routes protégées (Administration)
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), createAward);
router.put('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateAward);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteAward);

export default router;