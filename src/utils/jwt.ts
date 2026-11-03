import jwt from 'jsonwebtoken';

// Type pour le payload du token
export interface JwtPayload {
  userId: string;
  role: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_super_securise_a_changer_en_prod';
const JWT_EXPIRES_IN = '7d';

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ userId, role } as JwtPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Token invalide ou expiré');
  }
};