"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobOffer_controller_1 = require("../controllers/jobOffer.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// ✅ Routes PUBLIQUES
router.get('/public', jobOffer_controller_1.getPublicJobOffers);
router.get('/public/:slug', jobOffer_controller_1.getPublicJobOfferBySlug);
// Routes PROTÉGÉES (Admin)
router.get('/', auth_middleware_1.protect, jobOffer_controller_1.getAllJobOffers);
router.get('/:id', auth_middleware_1.protect, jobOffer_controller_1.getJobOfferById);
router.post('/', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN', 'EDITOR'), jobOffer_controller_1.createJobOffer);
router.put('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN', 'EDITOR'), jobOffer_controller_1.updateJobOffer);
router.delete('/:id', auth_middleware_1.protect, (0, auth_middleware_1.authorize)('SUPER_ADMIN', 'ADMIN'), jobOffer_controller_1.deleteJobOffer);
exports.default = router;
//# sourceMappingURL=jobOffer.routes.js.map