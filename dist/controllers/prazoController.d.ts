import { Request, Response } from "express";
type IdParam = Request<{
    id: string;
}>;
export declare function listarPrazos(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function buscarPrazo(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarPrazo(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function atualizarPrazo(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirPrazo(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function marcarStatus(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=prazoController.d.ts.map