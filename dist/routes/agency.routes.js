"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agency_controller_1 = require("../controllers/agency.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// ✅ Route PUBLIQUE (pas de middleware 'protect')
router.get('/public', agency_controller_1.getPublicAgencies);
// Routes PROTÉGÉES (Admin)
router.get('/', auth_middleware_1.protect, agency_controller_1.getAllAgencies);
router.post('/', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), agency_controller_1.createAgency);
router.put('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), agency_controller_1.updateAgency);
router.delete('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), agency_controller_1.deleteAgency);
exports.default = router;
//# sourceMappingURL=agency.routes.js.map