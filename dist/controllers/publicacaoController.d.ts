import { Request, Response } from "express";
type IdParam = Request<{
    id: string;
}>;
export declare function listarPublicacoes(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarPublicacao(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function atualizarPublicacao(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function marcarLida(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirPublicacao(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function buscarPorPalavraChave(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=publicacaoController.d.ts.map