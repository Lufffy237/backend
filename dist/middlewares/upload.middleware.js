"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadError = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const errorHandler_1 = require("./errorHandler");
// Créer le dossier uploads s'il n'existe pas
const uploadDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Configuration du stockage
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        // Générer un nom unique : uuid + extension originale
        const uniqueSuffix = (0, uuid_1.v4)();
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    },
});
// Filtrer les types de fichiers acceptés
const fileFilter = (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
        cb(null, true);
    }
    else {
        cb(new errorHandler_1.AppError('Seuls les fichiers image (JPEG, PNG, GIF, WebP) sont autorisés', 400));
    }
};
// Configuration de Multer
exports.upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB max
    },
    fileFilter,
});
// Middleware pour gérer les erreurs de Multer
const handleUploadError = (err, _req, res, _next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Le fichier est trop volumineux. Taille maximale : 5 MB',
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    return _next();
};
exports.handleUploadError = handleUploadError;
//# sourceMappingURL=upload.middleware.js.map