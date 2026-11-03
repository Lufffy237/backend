import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
  isActive: z.boolean().optional().default(true),
});