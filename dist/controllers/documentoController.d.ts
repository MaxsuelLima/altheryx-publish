import { Request, Response } from "express";
export declare function listarDocumentos(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function uploadDocumento(req: Request<{
    id: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function downloadDocumento(req: Request<{
    id: string;
    docId: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function visualizarDocumento(req: Request<{
    id: string;
    docId: string;
}>, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
export declare function atualizarDocumento(req: Request<{
    id: string;
    docId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
export declare function excluirDocumento(req: Request<{
    id: string;
    docId: string;
}>, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=documentoController.d.ts.map