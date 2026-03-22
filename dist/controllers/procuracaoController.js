"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarProcuracoes = listarProcuracoes;
exports.buscarProcuracao = buscarProcuracao;
exports.criarProcuracao = criarProcuracao;
exports.atualizarProcuracao = atualizarProcuracao;
exports.excluirProcuracao = excluirProcuracao;
exports.alertasRenovacao = alertasRenovacao;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const procuracaoSchema = zod_1.z.object({
    processoId: zod_1.z.string().uuid().nullable().optional(),
    tipoProcuracao: zod_1.z.enum(["OUTORGADA", "SUBSTABELECIMENTO_COM_RESERVA", "SUBSTABELECIMENTO_SEM_RESERVA"]).optional(),
    outorgante: zod_1.z.string().min(2),
    outorgado: zod_1.z.string().min(2),
    poderes: zod_1.z.string().min(3),
    dataEmissao: zod_1.z.string().transform((s) => new Date(s)),
    dataValidade: zod_1.z
        .string()
        .nullable()
        .optional()
        .transform((s) => (s ? new Date(s) : null)),
    status: zod_1.z.enum(["VIGENTE", "VENCIDA", "REVOGADA"]).optional(),
    observacoes: zod_1.z.string().nullable().optional(),
});
async function listarProcuracoes(req, res) {
    try {
        const busca = req.query.busca;
        const status = req.query.status;
        const procuracoes = await prisma_1.prisma.procuracao.findMany({
            where: {
                workspaceId: req.workspaceId,
                ...(busca && {
                    OR: [
                        { outorgante: { contains: busca, mode: "insensitive" } },
                        { outorgado: { contains: busca, mode: "insensitive" } },
                        { poderes: { contains: busca, mode: "insensitive" } },
                    ],
                }),
                ...(status && { status: status }),
            },
            include: {
                processo: { select: { id: true, numeroProcesso: true } },
            },
            orderBy: { dataEmissao: "desc" },
        });
        return res.json(procuracoes);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar procurações" });
    }
}
async function buscarProcuracao(req, res) {
    try {
        const procuracao = await prisma_1.prisma.procuracao.findFirst({
            where: { id: req.params.id, workspaceId: req.workspaceId },
            include: { processo: { select: { id: true, numeroProcesso: true } } },
        });
        if (!procuracao)
            return res.status(404).json({ error: "Procuração não encontrada" });
        return res.json(procuracao);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar procuração" });
    }
}
async function criarProcuracao(req, res) {
    try {
        const dados = procuracaoSchema.parse(req.body);
        const procuracao = await prisma_1.prisma.procuracao.create({
            data: {
                ...dados,
                tipoProcuracao: dados.tipoProcuracao || "OUTORGADA",
                status: dados.status || "VIGENTE",
                workspaceId: req.workspaceId,
            },
            include: { processo: { select: { id: true, numeroProcesso: true } } },
        });
        return res.status(201).json(procuracao);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao criar procuração" });
    }
}
async function atualizarProcuracao(req, res) {
    try {
        const dados = procuracaoSchema.partial().parse(req.body);
        const procuracao = await prisma_1.prisma.procuracao.update({
            where: { id: req.params.id },
            data: {
                ...dados,
                tipoProcuracao: dados.tipoProcuracao,
                status: dados.status,
            },
            include: { processo: { select: { id: true, numeroProcesso: true } } },
        });
        return res.json(procuracao);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar procuração" });
    }
}
async function excluirProcuracao(req, res) {
    try {
        await prisma_1.prisma.procuracao.update({
            where: { id: req.params.id },
            data: { deletadoEm: new Date(), deletadoPor: req.user?.userName || "sistema" },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir procuração" });
    }
}
async function alertasRenovacao(req, res) {
    try {
        const hoje = new Date();
        const em30dias = new Date();
        em30dias.setDate(em30dias.getDate() + 30);
        const alertas = await prisma_1.prisma.procuracao.findMany({
            where: {
                workspaceId: req.workspaceId,
                status: "VIGENTE",
                dataValidade: { not: null, lte: em30dias },
            },
            include: { processo: { select: { id: true, numeroProcesso: true } } },
            orderBy: { dataValidade: "asc" },
        });
        const resultado = alertas.map((p) => ({
            ...p,
            diasRestantes: p.dataValidade
                ? Math.ceil((p.dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
                : null,
            vencida: p.dataValidade ? p.dataValidade < hoje : false,
        }));
        return res.json(resultado);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar alertas" });
    }
}
//# sourceMappingURL=procuracaoController.js.map