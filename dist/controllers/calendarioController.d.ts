import { Request, Response } from "express";
type IdParam = Request<{
    id: string;
}>;
export declare function listarEventos(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarEvento(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function atualizarEvento(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirEvento(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function listarTribunais(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=calendarioController.d.ts.map