"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// partner.routes.ts (faire de même pour award.routes.ts en changeant les noms)
const express_1 = require("express");
const partner_controller_1 = require("../controllers/partner.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', partner_controller_1.getAllPartners); // Public
router.post('/', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), partner_controller_1.createPartner);
router.put('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), partner_controller_1.updatePartner);
router.delete('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), partner_controller_1.deletePartner);
exports.default = router;
//# sourceMappingURL=partner.routes.js.map