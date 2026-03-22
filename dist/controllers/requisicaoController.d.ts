import { Request, Response } from "express";
type IdParam = Request<{
    id: string;
}>;
export declare function listarRequisicoes(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function buscarRequisicao(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarRequisicao(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function atualizarRequisicao(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirRequisicao(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function dashboardRequisicoes(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=requisicaoController.d.ts.map