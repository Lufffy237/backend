"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const article_controller_1 = require("../controllers/article.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// ✅ Routes PUBLIQUES (pas de middleware 'protect')
router.get('/public', article_controller_1.getPublicArticles);
router.get('/public/:slug', article_controller_1.getPublicArticleBySlug);
// Routes PROTÉGÉES (Admin)
router.get('/', auth_middleware_1.protect, article_controller_1.getAllArticles);
router.get('/:id', auth_middleware_1.protect, article_controller_1.getArticleById);
router.post('/', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN', 'EDITOR'), article_controller_1.createArticle);
router.put('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN', 'EDITOR'), article_controller_1.updateArticle);
router.delete('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), article_controller_1.deleteArticle);
exports.default = router;
//# sourceMappingURL=article.routes.js.map