import { Request, Response } from "express";
type IdParam = Request<{
    id: string;
}>;
export declare function listarPrepostos(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function buscarPreposto(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarPreposto(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function atualizarPreposto(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirPreposto(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=prepostoController.d.ts.map