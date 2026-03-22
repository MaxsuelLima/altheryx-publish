"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarAprovacoes = listarAprovacoes;
exports.buscarAprovacao = buscarAprovacao;
exports.aprovarAlteracao = aprovarAlteracao;
exports.rejeitarAlteracao = rejeitarAlteracao;
exports.dashboardAprovacoes = dashboardAprovacoes;
const prisma_1 = require("../lib/prisma");
async function listarAprovacoes(req, res) {
    try {
        const status = req.query.status;
        const aprovacoes = await prisma_1.prisma.aprovacaoPendente.findMany({
            where: {
                workspaceId: req.workspaceId,
                ...(status ? { status: status } : { status: "PENDENTE" }),
            },
            orderBy: { criadoEm: "desc" },
        });
        return res.json(aprovacoes);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar aprovações" });
    }
}
async function buscarAprovacao(req, res) {
    try {
        const aprovacao = await prisma_1.prisma.aprovacaoPendente.findFirst({
            where: { id: req.params.id, workspaceId: req.workspaceId },
        });
        if (!aprovacao)
            return res.status(404).json({ error: "Aprovação não encontrada" });
        return res.json(aprovacao);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar aprovação" });
    }
}
async function aprovarAlteracao(req, res) {
    try {
        const usuario = req.user?.userName || "sistema";
        const aprovacao = await prisma_1.prisma.aprovacaoPendente.findFirst({
            where: { id: req.params.id, workspaceId: req.workspaceId },
        });
        if (!aprovacao)
            return res.status(404).json({ error: "Aprovação não encontrada" });
        if (aprovacao.status !== "PENDENTE") {
            return res.status(400).json({ error: "Esta aprovação já foi processada" });
        }
        const dados = aprovacao.dadosPropostos;
        if (aprovacao.entidade === "Processo") {
            await prisma_1.prisma.processo.update({
                where: { id: aprovacao.entidadeId },
                data: {
                    ...dados,
                    valorCausa: dados.valorCausa !== undefined ? (dados.valorCausa ?? undefined) : undefined,
                },
            });
        }
        else if (aprovacao.entidade === "Financeiro") {
            await prisma_1.prisma.financeiro.update({
                where: { id: aprovacao.entidadeId },
                data: {
                    ...dados,
                    prognostico: dados.prognostico,
                    formaPagamento: dados.formaPagamento,
                },
            });
        }
        const resultado = await prisma_1.prisma.aprovacaoPendente.update({
            where: { id: req.params.id },
            data: {
                status: "APROVADA",
                aprovadoPor: usuario,
                resolvidoEm: new Date(),
            },
        });
        return res.json(resultado);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao aprovar alteração" });
    }
}
async function rejeitarAlteracao(req, res) {
    try {
        const usuario = req.user?.userName || "sistema";
        const { motivo } = req.body;
        const aprovacao = await prisma_1.prisma.aprovacaoPendente.findFirst({
            where: { id: req.params.id, workspaceId: req.workspaceId },
        });
        if (!aprovacao)
            return res.status(404).json({ error: "Aprovação não encontrada" });
        if (aprovacao.status !== "PENDENTE") {
            return res.status(400).json({ error: "Esta aprovação já foi processada" });
        }
        const resultado = await prisma_1.prisma.aprovacaoPendente.update({
            where: { id: req.params.id },
            data: {
                status: "REJEITADA",
                aprovadoPor: usuario,
                motivoRejeicao: motivo || null,
                resolvidoEm: new Date(),
            },
        });
        return res.json(resultado);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao rejeitar alteração" });
    }
}
async function dashboardAprovacoes(req, res) {
    try {
        const [pendentes, aprovadas, rejeitadas] = await Promise.all([
            prisma_1.prisma.aprovacaoPendente.count({ where: { workspaceId: req.workspaceId, status: "PENDENTE" } }),
            prisma_1.prisma.aprovacaoPendente.count({ where: { workspaceId: req.workspaceId, status: "APROVADA" } }),
            prisma_1.prisma.aprovacaoPendente.count({ where: { workspaceId: req.workspaceId, status: "REJEITADA" } }),
        ]);
        return res.json({ pendentes, aprovadas, rejeitadas });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao gerar dashboard" });
    }
}
//# sourceMappingURL=aprovacaoController.js.map