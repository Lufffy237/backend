import { Router } from 'express';
import { 
  getAllAgencies, createAgency, updateAgency, deleteAgency,
  getPublicAgencies // ✅ Ajout de l'import
} from '../controllers/agency.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// ✅ Route PUBLIQUE (pas de middleware 'protect')
router.get('/public', getPublicAgencies);

// Routes PROTÉGÉES (Admin)
router.get('/', protect, getAllAgencies);
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN'), createAgency);
router.put('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), updateAgency);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteAgency);

export default router;