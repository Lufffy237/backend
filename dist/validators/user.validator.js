"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: zod_1.z.string().email('Adresse email invalide'),
    password: zod_1.z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    role: zod_1.z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
    isActive: zod_1.z.boolean().optional().default(true),
});
//# sourceMappingURL=user.validator.js.map