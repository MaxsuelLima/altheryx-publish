import { Request, Response } from "express";
type IdParam = Request<{
    id: string;
}>;
export declare function listarTestemunhas(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function buscarTestemunha(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarTestemunha(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function atualizarTestemunha(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirTestemunha(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=testemunhaController.d.ts.map