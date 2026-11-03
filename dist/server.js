"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = require("express-rate-limit");
const errorHandler_1 = require("./middlewares/errorHandler");
const logger_1 = require("./utils/logger");
// Import des routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const agency_routes_1 = __importDefault(require("./routes/agency.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const article_routes_1 = __importDefault(require("./routes/article.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const jobOffer_routes_1 = __importDefault(require("./routes/jobOffer.routes"));
const gallery_routes_1 = __importDefault(require("./routes/gallery.routes"));
const path_1 = __importDefault(require("path"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const award_routes_1 = __importDefault(require("./routes/award.routes"));
const partner_routes_1 = __importDefault(require("./routes/partner.routes"));
// 1. Charger les variables d'environnement
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ==========================================
// 2. MIDDLEWARES GLOBAUX (SÉCURITÉ & PARSING)
// ==========================================
// Sécurité des headers HTTP
app.use((0, helmet_1.default)());
// Configuration CORS
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
// ⚠️ CRUCIAL : Parser le JSON et les formulaires AVANT les routes
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Rate limiting (protection contre les attaques par force brute)
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par fenêtre
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer après 15 minutes',
});
app.use('/api/', limiter);
// ==========================================
// 3. ROUTES STATIQUES
// ==========================================
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// ==========================================
// 4. ROUTES API (après le parsing JSON)
// ==========================================
app.use('/api/auth', auth_routes_1.default);
app.use('/api/agencies', agency_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/articles', article_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/job-offers', jobOffer_routes_1.default);
app.use('/api/gallery', gallery_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
app.use('/api/partners', partner_routes_1.default);
app.use('/api/awards', award_routes_1.default);
// Route de test (Health check)
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'OK',
        message: 'Backend Élégance Pressing opérationnel',
        timestamp: new Date().toISOString(),
    });
});
// ==========================================
// 5. GESTION DES ERREURS (TOUJOURS EN DERNIER)
// ==========================================
app.use(errorHandler_1.errorHandler);
// ==========================================
// 6. DÉMARRAGE DU SERVEUR
// ==========================================
app.listen(PORT, () => {
    logger_1.logger.info(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
    logger_1.logger.info(`📍 Health check: http://localhost:${PORT}/api/health`);
    logger_1.logger.info(`🔧 Environnement: ${process.env.NODE_ENV}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map