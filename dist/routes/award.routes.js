"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const award_controller_1 = require("../controllers/award.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Route publique pour récupérer les distinctions (pour le site vitrine)
router.get('/', award_controller_1.getAllAwards);
// Routes protégées (Administration)
router.post('/', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), award_controller_1.createAward);
router.put('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), award_controller_1.updateAward);
router.delete('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), award_controller_1.deleteAward);
exports.default = router;
//# sourceMappingURL=award.routes.js.map