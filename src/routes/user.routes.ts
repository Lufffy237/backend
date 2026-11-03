import { Router } from 'express';
import { 
  createUser, 
  getAllUsers, 
  updateProfile, 
  updateUser,    // ✅ Ajouté
  deleteUser     // ✅ Ajouté
} from '../controllers/user.controller';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Route pour que l'utilisateur modifie son PROPRE profil (tous rôles)
router.put('/profile', protect, updateProfile);

// Routes réservées au SUPER ADMIN
router.get('/', protect, authorize('SUPER_ADMIN'), getAllUsers);
router.post('/', protect, authorize('SUPER_ADMIN'), createUser);
router.put('/:id', protect, authorize('SUPER_ADMIN'), updateUser);   // ✅ Ajouté
router.delete('/:id', protect, authorize('SUPER_ADMIN'), deleteUser); // ✅ Ajouté

export default router;