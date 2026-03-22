export declare const ENTIDADES_SENSIVEIS: string[];
export declare function criarAprovacao(params: {
    entidade: string;
    entidadeId: string;
    dadosAtuais: unknown;
    dadosPropostos: unknown;
    solicitadoPor: string;
    workspaceId?: string;
}): Promise<{
    id: string;
    workspaceId: string | null;
    criadoEm: Date;
    status: import(".prisma/client").$Enums.StatusAprovacao;
    entidade: string;
    entidadeId: string;
    dadosAtuais: import("@prisma/client/runtime/library").JsonValue;
    dadosPropostos: import("@prisma/client/runtime/library").JsonValue;
    solicitadoPor: string;
    aprovadoPor: string | null;
    motivoRejeicao: string | null;
    resolvidoEm: Date | null;
}>;
//# sourceMappingURL=auditService.d.ts.map