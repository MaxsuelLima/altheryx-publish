import { Request, Response } from "express";
type IdParam = Request<{
    id: string;
}>;
export declare function listarProcessos(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function buscarProcesso(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarProcesso(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function atualizarProcesso(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirProcesso(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function adicionarMovimentacao(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirMovimentacao(req: Request<{
    id: string;
    movId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function adicionarParte(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function removerParte(req: Request<{
    id: string;
    parteId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function adicionarPerito(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function removerPerito(req: Request<{
    id: string;
    peritoId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function adicionarPreposto(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function removerPreposto(req: Request<{
    id: string;
    prepostoId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function duracaoMedia(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function correcaoMonetaria(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=processoController.d.ts.map