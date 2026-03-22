import { Request, Response } from "express";
export declare function listarAuditorias(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function buscarAuditoria(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function historicoEntidade(req: Request<{
    entidade: string;
    entidadeId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=auditoriaController.d.ts.map