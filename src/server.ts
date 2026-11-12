import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';
import path from 'path';
import fs from 'fs';

// Import des routes
import authRoutes from './routes/auth.routes';
import agencyRoutes from './routes/agency.routes';
import userRoutes from './routes/user.routes';
import dashboardRoutes from './routes/dashboard.routes';
import articleRoutes from './routes/article.routes';
import categoryRoutes from './routes/category.routes';
import jobOfferRoutes from './routes/jobOffer.routes';
import galleryRoutes from './routes/gallery.routes';
import uploadRoutes from './routes/upload.routes';
import awardRoutes from './routes/award.routes';
import partnerRoutes from './routes/partner.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ✅ 1. OBLIGATOIRE POUR RAILWAY (Corrige l'erreur X-Forwarded-For)
app.set('trust proxy', 1);

// ✅ 2. CORS OUVERT (Temporairement pour éliminer toute erreur de blocage)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer après 15 minutes',
});
app.use('/api/', limiter);

const uploadsPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// ✅ 3. ROUTES
app.use('/api/auth', authRoutes);

// ✅ ASTUCE CRUCIALE : Le frontend appelle /api/agencies/public
// On réécrit l'URL en interne pour que le router des agences le traite comme une demande de liste ('/')
app.get('/api/agencies/public', (req, res, next) => {
  (req as any).url = '/'; 
  agencyRoutes(req, res, next);
});

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

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'Backend opérationnel', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`🚀 Serveur backend démarré sur le port ${PORT}`);
  logger.info(`🌐 CORS: Ouvert à toutes les origines (*)`);
});

export default app;