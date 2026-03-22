import { Request, Response, NextFunction } from "express";
export declare function authenticate(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function requireMaster(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function requireWorkspaceAdmin(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export declare function injectWorkspace(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=authMiddleware.d.ts.map