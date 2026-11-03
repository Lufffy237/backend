import { Router } from 'express';
import { 
  getAllJobOffers, getJobOfferById, createJobOffer, updateJobOffer, deleteJobOffer,
  getPublicJobOffers, getPublicJobOfferBySlug // ✅ Ajout
} from '../controllers/jobOffer.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// ✅ Routes PUBLIQUES
router.get('/public', getPublicJobOffers);
router.get('/public/:slug', getPublicJobOfferBySlug);

// Routes PROTÉGÉES (Admin)
router.get('/', protect, getAllJobOffers);
router.get('/:id', protect, getJobOfferById);
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), createJobOffer);
router.put('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateJobOffer);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteJobOffer);

export default router;