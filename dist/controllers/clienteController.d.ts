import { Request, Response } from "express";
type IdParam = Request<{
    id: string;
}>;
export declare function listarClientes(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function buscarCliente(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function criarCliente(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function atualizarCliente(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirCliente(req: IdParam, res: Response): Promise<Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=clienteController.d.ts.map