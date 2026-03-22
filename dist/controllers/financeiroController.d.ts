import { Request, Response } from "express";
type IdParam = Request<{
    id: string;
}>;
export declare function buscarFinanceiro(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function atualizarFinanceiro(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function adicionarParcela(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function atualizarParcela(req: Request<{
    id: string;
    parcelaId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirParcela(req: Request<{
    id: string;
    parcelaId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=financeiroController.d.ts.map