import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { protect,  } from '../middlewares/auth.middleware';

const router = Router();

// Protégé : accessible à tous les rôles connectés
router.get('/stats', protect, getDashboardStats);

export default router;