import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
export declare const upload: multer.Multer;
export declare const handleUploadError: (err: any, _req: Request, res: Response, _next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=upload.middleware.d.ts.map