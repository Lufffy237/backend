import { Router } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

// Route publique
router.post('/login', login);

export default router;