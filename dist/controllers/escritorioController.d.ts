import { Request, Response } from "express";
type IdParam = Request<{
    id: string;
}>;
export declare function listarEscritorios(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function buscarEscritorio(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarEscritorio(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function atualizarEscritorio(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirEscritorio(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=escritorioController.d.ts.map