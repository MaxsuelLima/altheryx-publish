import { Request, Response } from "express";
type IdParam = Request<{
    id: string;
}>;
export declare function listarAdvogados(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function buscarAdvogado(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarAdvogado(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function atualizarAdvogado(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirAdvogado(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=advogadoController.d.ts.map