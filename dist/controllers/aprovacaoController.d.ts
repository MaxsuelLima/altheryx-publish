import { Request, Response } from "express";
export declare function listarAprovacoes(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function buscarAprovacao(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function aprovarAlteracao(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function rejeitarAlteracao(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function dashboardAprovacoes(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=aprovacaoController.d.ts.map