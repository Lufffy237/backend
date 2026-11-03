import { Request, Response } from 'express';
import { prisma } from '../config/database';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';
import { loginSchema } from '../validators/auth.validator';
import { asyncHandler, AppError } from '../middlewares/errorHandler';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);
  const { email, password } = validatedData;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) throw new AppError('Email ou mot de passe incorrect', 401);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new AppError('Email ou mot de passe incorrect', 401);

  const token = generateToken(user.id, user.role);

  res.status(200).json({
    success: true,
    message: 'Connexion réussie',
    data: {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token,
    },
  });
});