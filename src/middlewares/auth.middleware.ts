import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { AppError } from './errorHandler';

// Étendre l'interface Request de Express
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * Middleware pour vérifier si l'utilisateur est connecté
 */
export const protect = (req: AuthRequest, _res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Vérifier le header Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Non autorisé : Aucun token fourni', 401));
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Non autorisé : Token invalide ou expiré', 401));
  }
};

/**
 * Middleware pour vérifier les rôles autorisés
 * Exemple d'utilisation : authorize('SUPER_ADMIN', 'ADMIN')
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError('Permissions insuffisantes', 403));
    }
    next();
  };
};