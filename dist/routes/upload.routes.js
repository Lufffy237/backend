"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controllers/upload.controller");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Upload d'image (protégé)
router.post('/image', auth_middleware_1.protect, upload_middleware_1.upload.single('image'), upload_middleware_1.handleUploadError, upload_controller_1.uploadImage);
// Suppression d'image (protégé)
router.delete('/image/:filename', auth_middleware_1.protect, upload_controller_1.deleteImage);
exports.default = router;
//# sourceMappingURL=upload.routes.js.map