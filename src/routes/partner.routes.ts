// partner.routes.ts (faire de même pour award.routes.ts en changeant les noms)
import { Router } from 'express';
import { getAllPartners, createPartner, updatePartner, deletePartner } from '../controllers/partner.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();
router.get('/', getAllPartners); // Public
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), createPartner);
router.put('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updatePartner);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deletePartner);
export default router;