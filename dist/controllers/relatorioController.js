"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.relatorioProcessos = relatorioProcessos;
exports.relatorioClientes = relatorioClientes;
exports.relatorioFinanceiro = relatorioFinanceiro;
exports.relatorioPrazos = relatorioPrazos;
exports.relatorioProcuracoes = relatorioProcuracoes;
exports.relatorioRequisicoes = relatorioRequisicoes;
exports.relatorioFiltros = relatorioFiltros;
const prisma_1 = require("../lib/prisma");
async function relatorioProcessos(req, res) {
    try {
        const status = req.query.status;
        const tribunal = req.query.tribunal;
        const competencia = req.query.competencia;
        const dataInicio = req.query.dataInicio;
        const dataFim = req.query.dataFim;
        const advogadoId = req.query.advogadoId;
        const processos = await prisma_1.prisma.processo.findMany({
            where: {
                workspaceId: req.workspaceId,
                deletadoEm: null,
                ...(status && { status: status }),
                ...(tribunal && { tribunal: { contains: tribunal, mode: "insensitive" } }),
                ...(competencia && { competencia: { contains: competencia, mode: "insensitive" } }),
                ...(advogadoId && { advogadoId }),
                ...(dataInicio &&
                    dataFim && {
                    criadoEm: {
                        gte: new Date(dataInicio),
                        lte: new Date(dataFim + "T23:59:59"),
                    },
                }),
            },
            include: {
                advogado: { select: { nome: true, oab: true } },
                juiz: { select: { nome: true } },
                _count: { select: { partes: true, movimentacoes: true, documentos: true } },
                financeiro: { select: { prognostico: true, honorariosContrato: true, valorCausaEstimado: true } },
            },
            orderBy: { criadoEm: "desc" },
        });
        return res.json(processos);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao gerar relatório de processos" });
    }
}
async function relatorioClientes(req, res) {
    try {
        const ativo = req.query.ativo;
        const estado = req.query.estado;
        const dataInicio = req.query.dataInicio;
        const dataFim = req.query.dataFim;
        const clientes = await prisma_1.prisma.cliente.findMany({
            where: {
                workspaceId: req.workspaceId,
                deletadoEm: null,
                ...(ativo !== undefined && { ativo: ativo === "true" }),
                ...(estado && { estado }),
                ...(dataInicio &&
                    dataFim && {
                    criadoEm: {
                        gte: new Date(dataInicio),
                        lte: new Date(dataFim + "T23:59:59"),
                    },
                }),
            },
            include: {
                _count: { select: { partesProcesso: true } },
            },
            orderBy: { nome: "asc" },
        });
        return res.json(clientes);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao gerar relatório de clientes" });
    }
}
async function relatorioFinanceiro(req, res) {
    try {
        const prognostico = req.query.prognostico;
        const statusParcela = req.query.statusParcela;
        const dataInicio = req.query.dataInicio;
        const dataFim = req.query.dataFim;
        const financeiros = await prisma_1.prisma.financeiro.findMany({
            where: {
                workspaceId: req.workspaceId,
                deletadoEm: null,
                ...(prognostico && { prognostico: prognostico }),
            },
            include: {
                processo: {
                    select: { id: true, numeroProcesso: true, assunto: true, tribunal: true, status: true },
                },
                parcelas: {
                    where: {
                        deletadoEm: null,
                        ...(statusParcela && { status: statusParcela }),
                        ...(dataInicio &&
                            dataFim && {
                            dataVencimento: {
                                gte: new Date(dataInicio),
                                lte: new Date(dataFim + "T23:59:59"),
                            },
                        }),
                    },
                    orderBy: { dataVencimento: "asc" },
                },
            },
            orderBy: { criadoEm: "desc" },
        });
        const toNum = (v) => (v ? Number(v) : 0);
        const resumo = {
            totalHonorarios: financeiros.reduce((acc, f) => acc + toNum(f.honorariosContrato), 0),
            totalValorCausa: financeiros.reduce((acc, f) => acc + toNum(f.valorCausaEstimado), 0),
            totalParcelas: financeiros.reduce((acc, f) => acc + f.parcelas.length, 0),
            totalPago: financeiros.reduce((acc, f) => acc +
                f.parcelas
                    .filter((p) => p.status === "PAGA")
                    .reduce((s, p) => s + toNum(p.valor), 0), 0),
            totalPendente: financeiros.reduce((acc, f) => acc +
                f.parcelas
                    .filter((p) => p.status === "PENDENTE" || p.status === "ATRASADA")
                    .reduce((s, p) => s + toNum(p.valor), 0), 0),
        };
        return res.json({ dados: financeiros, resumo });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao gerar relatório financeiro" });
    }
}
async function relatorioPrazos(req, res) {
    try {
        const status = req.query.status;
        const tipo = req.query.tipo;
        const dataInicio = req.query.dataInicio;
        const dataFim = req.query.dataFim;
        const prazos = await prisma_1.prisma.prazo.findMany({
            where: {
                workspaceId: req.workspaceId,
                deletadoEm: null,
                ...(status && { status: status }),
                ...(tipo && { tipo: tipo }),
                ...(dataInicio &&
                    dataFim && {
                    dataInicio: {
                        gte: new Date(dataInicio),
                        lte: new Date(dataFim + "T23:59:59"),
                    },
                }),
            },
            include: {
                processo: { select: { id: true, numeroProcesso: true, assunto: true } },
                testemunhas: { include: { testemunha: { select: { nome: true } } } },
            },
            orderBy: { dataInicio: "asc" },
        });
        return res.json(prazos);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao gerar relatório de prazos" });
    }
}
async function relatorioProcuracoes(req, res) {
    try {
        const status = req.query.status;
        const vencendo = req.query.vencendo;
        let dateFilter = {};
        if (vencendo === "true") {
            const em30dias = new Date();
            em30dias.setDate(em30dias.getDate() + 30);
            dateFilter = {
                status: "VIGENTE",
                dataValidade: { not: null, lte: em30dias },
            };
        }
        const procuracoes = await prisma_1.prisma.procuracao.findMany({
            where: {
                workspaceId: req.workspaceId,
                deletadoEm: null,
                ...(status && !vencendo && { status: status }),
                ...dateFilter,
            },
            include: {
                processo: { select: { id: true, numeroProcesso: true } },
            },
            orderBy: { dataEmissao: "desc" },
        });
        return res.json(procuracoes);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao gerar relatório de procurações" });
    }
}
async function relatorioRequisicoes(req, res) {
    try {
        const status = req.query.status;
        const area = req.query.area;
        const dataInicio = req.query.dataInicio;
        const dataFim = req.query.dataFim;
        const requisicoes = await prisma_1.prisma.requisicao.findMany({
            where: {
                workspaceId: req.workspaceId,
                deletadoEm: null,
                ...(status && { status: status }),
                ...(area && { area: area }),
                ...(dataInicio &&
                    dataFim && {
                    criadoEm: {
                        gte: new Date(dataInicio),
                        lte: new Date(dataFim + "T23:59:59"),
                    },
                }),
            },
            orderBy: { criadoEm: "desc" },
        });
        return res.json(requisicoes);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao gerar relatório de requisições" });
    }
}
async function relatorioFiltros(req, res) {
    try {
        const [tribunais, competencias, advogados, estados] = await Promise.all([
            prisma_1.prisma.processo.findMany({
                select: { tribunal: true },
                distinct: ["tribunal"],
                where: { workspaceId: req.workspaceId, deletadoEm: null },
                orderBy: { tribunal: "asc" },
            }),
            prisma_1.prisma.processo.findMany({
                select: { competencia: true },
                distinct: ["competencia"],
                where: { workspaceId: req.workspaceId, competencia: { not: null }, deletadoEm: null },
                orderBy: { competencia: "asc" },
            }),
            prisma_1.prisma.advogado.findMany({
                select: { id: true, nome: true, oab: true },
                where: { workspaceId: req.workspaceId, ativo: true, deletadoEm: null },
                orderBy: { nome: "asc" },
            }),
            prisma_1.prisma.cliente.findMany({
                select: { estado: true },
                distinct: ["estado"],
                where: { workspaceId: req.workspaceId, estado: { not: null }, deletadoEm: null },
                orderBy: { estado: "asc" },
            }),
        ]);
        return res.json({
            tribunais: tribunais.map((t) => t.tribunal),
            competencias: competencias.map((c) => c.competencia).filter(Boolean),
            advogados,
            estados: estados.map((e) => e.estado).filter(Boolean),
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar filtros" });
    }
}
//# sourceMappingURL=relatorioController.js.map