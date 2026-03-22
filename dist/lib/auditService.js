"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENTIDADES_SENSIVEIS = void 0;
exports.criarAprovacao = criarAprovacao;
const prisma_1 = require("./prisma");
exports.ENTIDADES_SENSIVEIS = ["Processo", "Financeiro"];
async function criarAprovacao(params) {
    return prisma_1.prismaBase.aprovacaoPendente.create({
        data: {
            entidade: params.entidade,
            entidadeId: params.entidadeId,
            dadosAtuais: params.dadosAtuais,
            dadosPropostos: params.dadosPropostos,
            solicitadoPor: params.solicitadoPor,
            workspaceId: params.workspaceId || null,
        },
    });
}
//# sourceMappingURL=auditService.js.map