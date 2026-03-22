"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarAuditorias = listarAuditorias;
exports.buscarAuditoria = buscarAuditoria;
exports.historicoEntidade = historicoEntidade;
const prisma_1 = require("../lib/prisma");
async function listarAuditorias(req, res) {
    try {
        const entidade = req.query.entidade;
        const entidadeId = req.query.entidadeId;
        const acao = req.query.acao;
        const usuario = req.query.usuario;
        const dataInicio = req.query.dataInicio;
        const dataFim = req.query.dataFim;
        const limite = Number(req.query.limite) || 50;
        const logs = await prisma_1.prisma.auditLog.findMany({
            where: {
                workspaceId: req.workspaceId,
                ...(entidade && { entidade }),
                ...(entidadeId && { entidadeId }),
                ...(acao && { acao: acao }),
                ...(usuario && { usuario: { contains: usuario, mode: "insensitive" } }),
                ...(dataInicio &&
                    dataFim && {
                    criadoEm: {
                        gte: new Date(dataInicio),
                        lte: new Date(dataFim + "T23:59:59"),
                    },
                }),
            },
            orderBy: { criadoEm: "desc" },
            take: limite,
        });
        return res.json(logs);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar auditoria" });
    }
}
async function buscarAuditoria(req, res) {
    try {
        const log = await prisma_1.prisma.auditLog.findFirst({
            where: { id: req.params.id, workspaceId: req.workspaceId },
        });
        if (!log)
            return res.status(404).json({ error: "Log não encontrado" });
        return res.json(log);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar log" });
    }
}
async function historicoEntidade(req, res) {
    try {
        const logs = await prisma_1.prisma.auditLog.findMany({
            where: {
                workspaceId: req.workspaceId,
                entidade: req.params.entidade,
                entidadeId: req.params.entidadeId,
            },
            orderBy: { criadoEm: "desc" },
        });
        return res.json(logs);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar histórico" });
    }
}
//# sourceMappingURL=auditoriaController.js.map