import { z } from 'zod';
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodEnum<["SUPER_ADMIN", "ADMIN", "EDITOR"]>;
    isActive: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name: string;
    role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
    isActive: boolean;
}, {
    email: string;
    password: string;
    name: string;
    role: "SUPER_ADMIN" | "ADMIN" | "EDITOR";
    isActive?: boolean | undefined;
}>;
//# sourceMappingURL=user.validator.d.ts.map