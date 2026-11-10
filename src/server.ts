import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';

// Import des routes
import authRoutes from './routes/auth.routes';
import agencyRoutes from './routes/agency.routes';
import userRoutes from './routes/user.routes';
import dashboardRoutes from './routes/dashboard.routes';
import articleRoutes from './routes/article.routes';
import categoryRoutes from './routes/category.routes';
import jobOfferRoutes from './routes/jobOffer.routes';
import galleryRoutes from './routes/gallery.routes';
import path from 'path';
import uploadRoutes from './routes/upload.routes';
import awardRoutes from './routes/award.routes';
import partnerRoutes from './routes/partner.routes';

// 1. Charger les variables d'environnement
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 2. MIDDLEWARES GLOBAUX (SÉCURITÉ & PARSING)
// ==========================================

// Sécurité des headers HTTP
app.use(helmet());

// Configuration CORS
app.use(cors({
  origin: ['https://frontend-1-coral-nine.vercel.app/', 'http://localhost:3000'], // Ajoutez l'URL Vercel ici
  credentials: true,
}));

// ⚠️ CRUCIAL : Parser le JSON et les formulaires AVANT les routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting (protection contre les attaques par force brute)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer après 15 minutes',
});
app.use('/api/', limiter);

// ==========================================
// 3. ROUTES STATIQUES
// ==========================================
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ==========================================
// 4. ROUTES API (après le parsing JSON)
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/agencies', agencyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/job-offers', jobOfferRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/awards', awardRoutes);

// Route de test (Health check)
app.get('/api/health', (_req, res) => { // ✅ CORRECTION : Ajout de "_" devant req
  res.json({
    status: 'OK',
    message: 'Backend Élégance Pressing opérationnel',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 5. GESTION DES ERREURS (TOUJOURS EN DERNIER)
// ==========================================
app.use(errorHandler);

// ==========================================
// 6. DÉMARRAGE DU SERVEUR
// ==========================================
app.listen(PORT, () => {
  logger.info(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
  logger.info(`📍 Health check: http://localhost:${PORT}/api/health`);
  logger.info(`🔧 Environnement: ${process.env.NODE_ENV}`);
});

export default app;