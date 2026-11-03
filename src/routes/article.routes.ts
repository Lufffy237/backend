import { Router } from 'express';
import { 
  getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle,
  getPublicArticles, getPublicArticleBySlug // ✅ Ajout des imports
} from '../controllers/article.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// ✅ Routes PUBLIQUES (pas de middleware 'protect')
router.get('/public', getPublicArticles);
router.get('/public/:slug', getPublicArticleBySlug);

// Routes PROTÉGÉES (Admin)
router.get('/', protect, getAllArticles);
router.get('/:id', protect, getArticleById);
router.post('/', protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), createArticle);
router.put('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN', 'EDITOR'), updateArticle);
router.delete('/:id', protect, authorize('SUPER_ADMIN', 'ADMIN'), deleteArticle);

export default router;