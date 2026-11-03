export interface JwtPayload {
    userId: string;
    role: string;
}
export declare const generateToken: (userId: string, role: string) => string;
export declare const verifyToken: (token: string) => JwtPayload;
//# sourceMappingURL=jwt.d.ts.map