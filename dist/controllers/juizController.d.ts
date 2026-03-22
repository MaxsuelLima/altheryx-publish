import { Request, Response } from "express";
type IdParam = Request<{
    id: string;
}>;
export declare function listarJuizes(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function buscarJuiz(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarJuiz(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function atualizarJuiz(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirJuiz(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=juizController.d.ts.map