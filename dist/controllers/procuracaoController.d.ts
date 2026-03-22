import { Request, Response } from "express";
type IdParam = Request<{
    id: string;
}>;
export declare function listarProcuracoes(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function buscarProcuracao(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarProcuracao(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function atualizarProcuracao(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirProcuracao(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function alertasRenovacao(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=procuracaoController.d.ts.map