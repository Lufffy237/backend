"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Toutes les routes sont protégées. Seuls ADMIN et SUPER_ADMIN peuvent gérer les catégories.
router.get('/', auth_middleware_1.protect, category_controller_1.getAllCategories);
router.post('/', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), category_controller_1.createCategory);
router.put('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), category_controller_1.updateCategory);
router.delete('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), category_controller_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=category.routes.js.map