import { Request, Response } from "express";
type IdParam = Request<{
    id: string;
}>;
export declare function listarPeritos(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function buscarPerito(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarPerito(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function atualizarPerito(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirPerito(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=peritoController.d.ts.map