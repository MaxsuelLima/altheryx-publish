"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboard = getDashboard;
const prisma_1 = require("../lib/prisma");
async function getDashboard(req, res) {
    try {
        const [totalClientes, totalAdvogados, totalProcessos, totalEscritorios, totalJuizes, totalTestemunhas, totalPeritos, totalPrepostos, totalProcuracoes, totalRequisicoes, processosPorStatus, processosPorCompetencia, processosPorTribunal, processosPorFase, prazosProximos, procuracoesVencendo,] = await Promise.all([
            prisma_1.prisma.cliente.count({ where: { workspaceId: req.workspaceId, ativo: true, deletadoEm: null } }),
            prisma_1.prisma.advogado.count({ where: { workspaceId: req.workspaceId, ativo: true, deletadoEm: null } }),
            prisma_1.prisma.processo.count({ where: { workspaceId: req.workspaceId, deletadoEm: null } }),
            prisma_1.prisma.escritorio.count({ where: { workspaceId: req.workspaceId, ativo: true, deletadoEm: null } }),
            prisma_1.prisma.juiz.count({ where: { workspaceId: req.workspaceId, ativo: true, deletadoEm: null } }),
            prisma_1.prisma.testemunha.count({ where: { workspaceId: req.workspaceId, deletadoEm: null } }),
            prisma_1.prisma.perito.count({ where: { workspaceId: req.workspaceId, deletadoEm: null } }),
            prisma_1.prisma.preposto.count({ where: { workspaceId: req.workspaceId, deletadoEm: null } }),
            prisma_1.prisma.procuracao.count({ where: { workspaceId: req.workspaceId, deletadoEm: null } }),
            prisma_1.prisma.requisicao.count({ where: { workspaceId: req.workspaceId, deletadoEm: null, status: { in: ["ABERTA", "EM_ANALISE", "EM_ANDAMENTO"] } } }),
            prisma_1.prisma.processo.groupBy({
                by: ["status"],
                _count: { id: true },
                where: { workspaceId: req.workspaceId, deletadoEm: null },
            }),
            prisma_1.prisma.processo.groupBy({
                by: ["competencia"],
                _count: { id: true },
                where: { workspaceId: req.workspaceId, competencia: { not: null }, deletadoEm: null },
            }),
            prisma_1.prisma.processo.groupBy({
                by: ["tribunal"],
                _count: { id: true },
                where: { workspaceId: req.workspaceId, deletadoEm: null },
            }),
            prisma_1.prisma.processo.groupBy({
                by: ["fase"],
                _count: { id: true },
                where: { workspaceId: req.workspaceId, fase: { not: null }, deletadoEm: null },
            }),
            prisma_1.prisma.prazo.count({
                where: {
                    workspaceId: req.workspaceId,
                    deletadoEm: null,
                    status: "PENDENTE",
                    dataFim: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
                },
            }),
            prisma_1.prisma.procuracao.count({
                where: {
                    workspaceId: req.workspaceId,
                    deletadoEm: null,
                    status: "VIGENTE",
                    dataValidade: { not: null, lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
                },
            }),
        ]);
        return res.json({
            totais: {
                clientes: totalClientes,
                advogados: totalAdvogados,
                processos: totalProcessos,
                escritorios: totalEscritorios,
                juizes: totalJuizes,
                testemunhas: totalTestemunhas,
                peritos: totalPeritos,
                prepostos: totalPrepostos,
                procuracoes: totalProcuracoes,
                requisicoesPendentes: totalRequisicoes,
            },
            alertas: {
                prazosProximos,
                procuracoesVencendo,
            },
            processosPorStatus: processosPorStatus.map((item) => ({
                status: item.status,
                quantidade: item._count.id,
            })),
            processosPorCompetencia: processosPorCompetencia.map((item) => ({
                competencia: item.competencia,
                quantidade: item._count.id,
            })),
            processosPorTribunal: processosPorTribunal.map((item) => ({
                tribunal: item.tribunal,
                quantidade: item._count.id,
            })),
            processosPorFase: processosPorFase.map((item) => ({
                fase: item.fase,
                quantidade: item._count.id,
            })),
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao carregar dashboard" });
    }
}
//# sourceMappingURL=dashboardController.js.map