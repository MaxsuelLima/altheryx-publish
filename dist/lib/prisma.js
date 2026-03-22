"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaBase = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const requestContext_1 = require("./requestContext");
const prismaBase = new client_1.PrismaClient();
exports.prismaBase = prismaBase;
const MODELOS_COM_SOFT_DELETE = new Set([
    "Usuario", "Cliente", "Escritorio", "Advogado", "Juiz", "Testemunha",
    "Processo", "Financeiro", "Parcela", "Movimentacao", "Documento",
    "Publicacao", "Prazo", "CalendarioTribunal", "Procuracao", "Requisicao",
    "Perito", "Preposto",
]);
const MODELOS_SEM_AUDITORIA = new Set([
    "AuditLog", "AprovacaoPendente", "Workspace",
    "ParteProcesso", "ProcessoTestemunha", "ProcessoPerito",
    "ProcessoPreposto", "PrazoTestemunha",
]);
function modelAccessor(model) {
    return model.charAt(0).toLowerCase() + model.slice(1);
}
const prisma = prismaBase.$extends({
    query: {
        $allModels: {
            async findMany({ model, args, query }) {
                if (MODELOS_COM_SOFT_DELETE.has(model)) {
                    args.where = { deletadoEm: null, ...args.where };
                }
                return query(args);
            },
            async findFirst({ model, args, query }) {
                if (MODELOS_COM_SOFT_DELETE.has(model)) {
                    args.where = { deletadoEm: null, ...args.where };
                }
                return query(args);
            },
            async create({ model, args, query }) {
                const result = await query(args);
                if (!MODELOS_SEM_AUDITORIA.has(model)) {
                    const ctx = requestContext_1.requestContext.getStore();
                    if (ctx) {
                        await prismaBase.auditLog.create({
                            data: {
                                entidade: model,
                                entidadeId: result.id,
                                acao: "CRIACAO",
                                dadosNovos: result,
                                usuario: ctx.usuario,
                                ip: ctx.ip || null,
                                workspaceId: ctx.workspaceId || null,
                            },
                        });
                    }
                }
                return result;
            },
            async update({ model, args, query }) {
                if (MODELOS_SEM_AUDITORIA.has(model)) {
                    return query(args);
                }
                const ctx = requestContext_1.requestContext.getStore();
                if (!ctx)
                    return query(args);
                const accessor = modelAccessor(model);
                const anterior = await prismaBase[accessor].findUnique({
                    where: args.where,
                });
                const result = await query(args);
                const data = args.data;
                const isSoftDelete = data?.deletadoEm !== undefined;
                await prismaBase.auditLog.create({
                    data: {
                        entidade: model,
                        entidadeId: result.id,
                        acao: isSoftDelete ? "EXCLUSAO" : "ATUALIZACAO",
                        dadosAnteriores: anterior,
                        dadosNovos: isSoftDelete ? undefined : result,
                        usuario: ctx.usuario,
                        ip: ctx.ip || null,
                        workspaceId: ctx.workspaceId || null,
                    },
                });
                return result;
            },
            async upsert({ model, args, query }) {
                if (MODELOS_SEM_AUDITORIA.has(model)) {
                    return query(args);
                }
                const ctx = requestContext_1.requestContext.getStore();
                if (!ctx)
                    return query(args);
                const accessor = modelAccessor(model);
                const anterior = await prismaBase[accessor].findUnique({
                    where: args.where,
                });
                const result = await query(args);
                await prismaBase.auditLog.create({
                    data: {
                        entidade: model,
                        entidadeId: result.id,
                        acao: anterior ? "ATUALIZACAO" : "CRIACAO",
                        dadosAnteriores: anterior,
                        dadosNovos: result,
                        usuario: ctx.usuario,
                        ip: ctx.ip || null,
                        workspaceId: ctx.workspaceId || null,
                    },
                });
                return result;
            },
        },
    },
});
exports.prisma = prisma;
//# sourceMappingURL=prisma.js.map