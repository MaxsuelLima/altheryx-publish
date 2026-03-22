"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarPrazos = listarPrazos;
exports.buscarPrazo = buscarPrazo;
exports.criarPrazo = criarPrazo;
exports.atualizarPrazo = atualizarPrazo;
exports.excluirPrazo = excluirPrazo;
exports.marcarStatus = marcarStatus;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const prazoSchema = zod_1.z.object({
    processoId: zod_1.z.string().uuid(),
    publicacaoId: zod_1.z.string().uuid().nullable().optional(),
    tipo: zod_1.z.enum(["AUDIENCIA", "PRAZO_PROCESSUAL", "PERICIA", "SUSTENTACAO_ORAL", "OUTRO"]),
    descricao: zod_1.z.string().min(3),
    dataInicio: zod_1.z.string().transform((s) => new Date(s)),
    dataFim: zod_1.z.string().transform((s) => new Date(s)),
    horaInicio: zod_1.z.string().nullable().optional(),
    horaFim: zod_1.z.string().nullable().optional(),
    local: zod_1.z.string().nullable().optional(),
    status: zod_1.z.enum(["PENDENTE", "CUMPRIDO", "PERDIDO"]).optional(),
    observacoes: zod_1.z.string().nullable().optional(),
    prepostoNome: zod_1.z.string().nullable().optional(),
    prepostoContato: zod_1.z.string().nullable().optional(),
    testemunhaIds: zod_1.z.array(zod_1.z.string().uuid()).optional(),
});
async function listarPrazos(req, res) {
    try {
        const status = req.query.status;
        const tipo = req.query.tipo;
        const mes = req.query.mes;
        const ano = req.query.ano;
        let dateFilter = {};
        if (mes && ano) {
            const inicio = new Date(Number(ano), Number(mes) - 1, 1);
            const fim = new Date(Number(ano), Number(mes), 0, 23, 59, 59);
            dateFilter = { dataInicio: { gte: inicio, lte: fim } };
        }
        const prazos = await prisma_1.prisma.prazo.findMany({
            where: {
                workspaceId: req.workspaceId,
                ...(status && { status: status }),
                ...(tipo && { tipo: tipo }),
                ...dateFilter,
            },
            include: {
                processo: { select: { id: true, numeroProcesso: true, assunto: true } },
                testemunhas: { include: { testemunha: true } },
            },
            orderBy: { dataInicio: "asc" },
        });
        return res.json(prazos);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar prazos" });
    }
}
async function buscarPrazo(req, res) {
    try {
        const prazo = await prisma_1.prisma.prazo.findFirst({
            where: { id: req.params.id, workspaceId: req.workspaceId },
            include: {
                processo: { select: { id: true, numeroProcesso: true, assunto: true } },
                testemunhas: { include: { testemunha: true } },
            },
        });
        if (!prazo)
            return res.status(404).json({ error: "Prazo não encontrado" });
        return res.json(prazo);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar prazo" });
    }
}
async function criarPrazo(req, res) {
    try {
        const { testemunhaIds, ...dados } = prazoSchema.parse(req.body);
        const prazo = await prisma_1.prisma.prazo.create({
            data: {
                ...dados,
                workspaceId: req.workspaceId,
                tipo: dados.tipo,
                status: dados.status || "PENDENTE",
                publicacaoId: dados.publicacaoId ?? undefined,
                testemunhas: testemunhaIds?.length
                    ? { create: testemunhaIds.map((tid) => ({ testemunhaId: tid })) }
                    : undefined,
            },
            include: {
                processo: { select: { id: true, numeroProcesso: true, assunto: true } },
                testemunhas: { include: { testemunha: true } },
            },
        });
        return res.status(201).json(prazo);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao criar prazo" });
    }
}
async function atualizarPrazo(req, res) {
    try {
        const { testemunhaIds, ...dados } = prazoSchema.partial().parse(req.body);
        if (testemunhaIds !== undefined) {
            await prisma_1.prisma.prazoTestemunha.deleteMany({ where: { prazoId: req.params.id } });
            if (testemunhaIds.length > 0) {
                await prisma_1.prisma.prazoTestemunha.createMany({
                    data: testemunhaIds.map((tid) => ({ prazoId: req.params.id, testemunhaId: tid })),
                });
            }
        }
        const prazo = await prisma_1.prisma.prazo.update({
            where: { id: req.params.id },
            data: {
                ...dados,
                tipo: dados.tipo,
                status: dados.status,
            },
            include: {
                processo: { select: { id: true, numeroProcesso: true, assunto: true } },
                testemunhas: { include: { testemunha: true } },
            },
        });
        return res.json(prazo);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar prazo" });
    }
}
async function excluirPrazo(req, res) {
    try {
        await prisma_1.prisma.prazo.update({
            where: { id: req.params.id },
            data: { deletadoEm: new Date(), deletadoPor: req.user?.userName || "sistema" },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir prazo" });
    }
}
async function marcarStatus(req, res) {
    try {
        const { status } = zod_1.z.object({ status: zod_1.z.enum(["PENDENTE", "CUMPRIDO", "PERDIDO"]) }).parse(req.body);
        const prazo = await prisma_1.prisma.prazo.update({
            where: { id: req.params.id },
            data: { status: status },
        });
        return res.json(prazo);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar status" });
    }
}
//# sourceMappingURL=prazoController.js.map