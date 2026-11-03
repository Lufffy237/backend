import { Response } from 'express';
import { prisma } from '../config/database';
import bcrypt from 'bcrypt';
import { createUserSchema } from '../validators/user.validator';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler, AppError } from '../middlewares/errorHandler';

export const getAllUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'SUPER_ADMIN') throw new AppError('Accès refusé : Réservé au Super Administrateur', 403);
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true }, orderBy: { createdAt: 'desc' } });
  res.status(200).json({ success: true, count: users.length, data: users });
});

export const createUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'SUPER_ADMIN') throw new AppError('Accès refusé : Réservé au Super Administrateur', 403);
  const validatedData = createUserSchema.parse(req.body);
  const { name, email, password, role, isActive } = validatedData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new AppError('Cet email est déjà utilisé', 400);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { name, email, password: hashedPassword, role, isActive: isActive ?? true }, select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true } });
  res.status(201).json({ success: true, message: 'Utilisateur créé avec succès', data: user });
});

export const updateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'SUPER_ADMIN') throw new AppError('Accès refusé : Réservé au Super Administrateur', 403);
  const id = req.params.id as string;
  const { name, email, role, isActive } = req.body;

  if (id === req.user?.userId && role && role !== 'SUPER_ADMIN') throw new AppError('Vous ne pouvez pas modifier votre propre rôle via cette interface', 400);

  if (email) {
    const existingUser = await prisma.user.findFirst({ where: { email, id: { not: id } } });
    if (existingUser) throw new AppError('Cet email est déjà utilisé par un autre compte', 400);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { name: name || undefined, email: email || undefined, role: role || undefined, isActive: isActive !== undefined ? isActive : undefined },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  });
  res.status(200).json({ success: true, message: 'Utilisateur mis à jour avec succès', data: updatedUser });
});

export const deleteUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (req.user?.role !== 'SUPER_ADMIN') throw new AppError('Accès refusé : Réservé au Super Administrateur', 403);
  const id = req.params.id as string;
  if (id === req.user?.userId) throw new AppError('Vous ne pouvez pas supprimer votre propre compte', 400);

  await prisma.user.delete({ where: { id } });
  res.status(200).json({ success: true, message: 'Utilisateur supprimé avec succès' });
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body;
  const userId = req.user?.userId;
  if (!userId) throw new AppError('Non autorisé', 401);

  if (email) {
    const existingUser = await prisma.user.findFirst({ where: { email, id: { not: userId } } });
    if (existingUser) throw new AppError('Cet email est déjà utilisé par un autre compte', 400);
  }

  const updateData: any = { name: name || undefined, email: email || undefined };
  if (password && password.length >= 6) updateData.password = await bcrypt.hash(password, 10);

  const updatedUser = await prisma.user.update({ where: { id: userId }, data: updateData, select: { id: true, name: true, email: true, role: true, isActive: true } });
  res.status(200).json({ success: true, message: 'Profil mis à jour avec succès', data: updatedUser });
});