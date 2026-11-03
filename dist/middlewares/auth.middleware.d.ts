import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../utils/jwt';
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
/**
 * Middleware pour vérifier si l'utilisateur est connecté
 */
export declare const protect: (req: AuthRequest, _res: Response, next: NextFunction) => void;
/**
 * Middleware pour vérifier les rôles autorisés
 * Exemple d'utilisation : authorize('SUPER_ADMIN', 'ADMIN')
 */
export declare const authorize: (...allowedRoles: string[]) => (req: AuthRequest, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map