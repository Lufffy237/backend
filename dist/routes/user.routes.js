"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Route pour que l'utilisateur modifie son PROPRE profil (tous rôles)
router.put('/profile', auth_middleware_1.protect, user_controller_1.updateProfile);
// Routes réservées au SUPER ADMIN
router.get('/', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN'), user_controller_1.getAllUsers);
router.post('/', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN'), user_controller_1.createUser);
router.put('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN'), user_controller_1.updateUser); // ✅ Ajouté
router.delete('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN'), user_controller_1.deleteUser); // ✅ Ajouté
exports.default = router;
//# sourceMappingURL=user.routes.js.map