"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarRequisicoes = listarRequisicoes;
exports.buscarRequisicao = buscarRequisicao;
exports.criarRequisicao = criarRequisicao;
exports.atualizarRequisicao = atualizarRequisicao;
exports.excluirRequisicao = excluirRequisicao;
exports.dashboardRequisicoes = dashboardRequisicoes;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const requisicaoSchema = zod_1.z.object({
    solicitante: zod_1.z.string().min(2),
    departamento: zod_1.z.string().min(2),
    area: zod_1.z.enum(["CONTRATOS", "CONSULTIVO"]),
    tipo: zod_1.z.enum([
        "ELABORACAO_CONTRATO",
        "AVALIACAO_CONTRATO",
        "PARECER",
        "ADITAMENTO_CONTRATO",
        "RESCISAO_RESOLUCAO",
        "DISTRATO",
        "CONSULTIVO_PREVENTIVO",
        "CONSULTIVO_MATERIAL",
        "CONSULTIVO_OUTROS",
    ]),
    prioridade: zod_1.z.enum(["BAIXA", "MEDIA", "ALTA", "URGENTE"]).optional(),
    titulo: zod_1.z.string().min(3),
    descricao: zod_1.z.string().min(5),
    partesEnvolvidas: zod_1.z.string().nullable().optional(),
    valorEnvolvido: zod_1.z.number().nullable().optional(),
    prazoDesejado: zod_1.z
        .string()
        .nullable()
        .optional()
        .transform((s) => (s ? new Date(s) : null)),
});
async function listarRequisicoes(req, res) {
    try {
        const busca = req.query.busca;
        const status = req.query.status;
        const area = req.query.area;
        const prioridade = req.query.prioridade;
        const requisicoes = await prisma_1.prisma.requisicao.findMany({
            where: {
                workspaceId: req.workspaceId,
                ...(busca && {
                    OR: [
                        { titulo: { contains: busca, mode: "insensitive" } },
                        { solicitante: { contains: busca, mode: "insensitive" } },
                        { departamento: { contains: busca, mode: "insensitive" } },
                        { descricao: { contains: busca, mode: "insensitive" } },
                    ],
                }),
                ...(status && { status: status }),
                ...(area && { area: area }),
                ...(prioridade && { prioridade: prioridade }),
            },
            orderBy: { criadoEm: "desc" },
        });
        return res.json(requisicoes);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar requisições" });
    }
}
async function buscarRequisicao(req, res) {
    try {
        const requisicao = await prisma_1.prisma.requisicao.findFirst({
            where: { id: req.params.id, workspaceId: req.workspaceId },
        });
        if (!requisicao)
            return res.status(404).json({ error: "Requisição não encontrada" });
        return res.json(requisicao);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar requisição" });
    }
}
async function criarRequisicao(req, res) {
    try {
        const dados = requisicaoSchema.parse(req.body);
        const requisicao = await prisma_1.prisma.requisicao.create({
            data: {
                ...dados,
                area: dados.area,
                tipo: dados.tipo,
                prioridade: dados.prioridade || "MEDIA",
                workspaceId: req.workspaceId,
            },
        });
        return res.status(201).json(requisicao);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao criar requisição" });
    }
}
async function atualizarRequisicao(req, res) {
    try {
        const dados = requisicaoSchema.partial().parse(req.body);
        const extra = {};
        if (req.body.status)
            extra.status = req.body.status;
        if (req.body.resposta !== undefined)
            extra.resposta = req.body.resposta;
        if (req.body.responsavel !== undefined)
            extra.responsavel = req.body.responsavel;
        if (req.body.status === "CONCLUIDA") {
            extra.concluidaEm = new Date();
        }
        const requisicao = await prisma_1.prisma.requisicao.update({
            where: { id: req.params.id },
            data: {
                ...dados,
                ...(dados.area && { area: dados.area }),
                ...(dados.tipo && { tipo: dados.tipo }),
                ...(dados.prioridade && { prioridade: dados.prioridade }),
                ...extra,
            },
        });
        return res.json(requisicao);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar requisição" });
    }
}
async function excluirRequisicao(req, res) {
    try {
        await prisma_1.prisma.requisicao.update({
            where: { id: req.params.id },
            data: { deletadoEm: new Date(), deletadoPor: req.user?.userName || "sistema" },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir requisição" });
    }
}
async function dashboardRequisicoes(req, res) {
    try {
        const [total, porStatus, porArea, porPrioridade] = await Promise.all([
            prisma_1.prisma.requisicao.count({ where: { workspaceId: req.workspaceId } }),
            prisma_1.prisma.requisicao.groupBy({
                by: ["status"],
                _count: { id: true },
                where: { workspaceId: req.workspaceId },
            }),
            prisma_1.prisma.requisicao.groupBy({
                by: ["area"],
                _count: { id: true },
                where: { workspaceId: req.workspaceId },
            }),
            prisma_1.prisma.requisicao.groupBy({
                by: ["prioridade"],
                where: { workspaceId: req.workspaceId, status: { in: ["ABERTA", "EM_ANALISE", "EM_ANDAMENTO"] } },
                _count: { id: true },
            }),
        ]);
        return res.json({
            total,
            porStatus: porStatus.map((s) => ({ status: s.status, quantidade: s._count.id })),
            porArea: porArea.map((a) => ({ area: a.area, quantidade: a._count.id })),
            porPrioridade: porPrioridade.map((p) => ({ prioridade: p.prioridade, quantidade: p._count.id })),
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao gerar dashboard" });
    }
}
//# sourceMappingURL=requisicaoController.js.map