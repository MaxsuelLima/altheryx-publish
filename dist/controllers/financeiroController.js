"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buscarFinanceiro = buscarFinanceiro;
exports.atualizarFinanceiro = atualizarFinanceiro;
exports.adicionarParcela = adicionarParcela;
exports.atualizarParcela = atualizarParcela;
exports.excluirParcela = excluirParcela;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const auditService_1 = require("../lib/auditService");
const financeiroSchema = zod_1.z.object({
    prognostico: zod_1.z.enum(["PROVAVEL", "POSSIVEL", "REMOTA"]).optional(),
    valorCausaEstimado: zod_1.z.number().nullable().optional(),
    honorariosContrato: zod_1.z.number().nullable().optional(),
    honorariosExito: zod_1.z.number().nullable().optional(),
    percentualExito: zod_1.z.number().min(0).max(100).nullable().optional(),
    formaPagamento: zod_1.z.enum(["A_VISTA", "PARCELADO", "HONORARIOS_EXITO", "MISTO"]).optional(),
    observacoes: zod_1.z.string().nullable().optional(),
});
const parcelaSchema = zod_1.z.object({
    numero: zod_1.z.number().int().positive(),
    valor: zod_1.z.number().positive(),
    dataVencimento: zod_1.z.string().transform((s) => new Date(s)),
    dataPagamento: zod_1.z.string().transform((s) => new Date(s)).nullable().optional(),
    status: zod_1.z.enum(["PENDENTE", "PAGA", "ATRASADA", "CANCELADA"]).optional(),
    observacoes: zod_1.z.string().nullable().optional(),
});
async function buscarFinanceiro(req, res) {
    try {
        let financeiro = await prisma_1.prisma.financeiro.findFirst({
            where: { processoId: req.params.id, workspaceId: req.workspaceId },
            include: {
                parcelas: { where: { deletadoEm: null }, orderBy: { numero: "asc" } },
                processo: {
                    select: { numeroProcesso: true, valorCausa: true, assunto: true, competencia: true },
                },
            },
        });
        if (!financeiro) {
            financeiro = await prisma_1.prisma.financeiro.create({
                data: { processoId: req.params.id, workspaceId: req.workspaceId },
                include: {
                    parcelas: { where: { deletadoEm: null }, orderBy: { numero: "asc" } },
                    processo: {
                        select: { numeroProcesso: true, valorCausa: true, assunto: true, competencia: true },
                    },
                },
            });
        }
        return res.json(financeiro);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar financeiro" });
    }
}
async function atualizarFinanceiro(req, res) {
    try {
        const dados = financeiroSchema.parse(req.body);
        const usuario = req.user?.userName || "sistema";
        const anterior = await prisma_1.prisma.financeiro.findFirst({ where: { processoId: req.params.id, workspaceId: req.workspaceId } });
        if (anterior && auditService_1.ENTIDADES_SENSIVEIS.includes("Financeiro")) {
            const aprovacao = await (0, auditService_1.criarAprovacao)({
                entidade: "Financeiro",
                entidadeId: anterior.id,
                dadosAtuais: anterior,
                dadosPropostos: dados,
                solicitadoPor: usuario,
                workspaceId: req.workspaceId,
            });
            return res.status(202).json({
                message: "Alteração enviada para aprovação",
                aprovacaoId: aprovacao.id,
            });
        }
        const financeiro = await prisma_1.prisma.financeiro.upsert({
            where: { processoId: req.params.id },
            create: {
                processoId: req.params.id,
                workspaceId: req.workspaceId,
                ...dados,
                prognostico: dados.prognostico || "POSSIVEL",
                formaPagamento: dados.formaPagamento || "A_VISTA",
            },
            update: {
                ...dados,
                prognostico: dados.prognostico,
                formaPagamento: dados.formaPagamento,
            },
            include: {
                parcelas: { where: { deletadoEm: null }, orderBy: { numero: "asc" } },
            },
        });
        return res.json(financeiro);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar financeiro" });
    }
}
async function adicionarParcela(req, res) {
    try {
        const dados = parcelaSchema.parse(req.body);
        const financeiro = await prisma_1.prisma.financeiro.findFirst({
            where: { processoId: req.params.id, workspaceId: req.workspaceId },
        });
        if (!financeiro) {
            return res.status(404).json({ error: "Financeiro não encontrado" });
        }
        const parcela = await prisma_1.prisma.parcela.create({
            data: {
                financeiroId: financeiro.id,
                workspaceId: req.workspaceId,
                ...dados,
                status: dados.status || "PENDENTE",
            },
        });
        return res.status(201).json(parcela);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao adicionar parcela" });
    }
}
async function atualizarParcela(req, res) {
    try {
        const dados = parcelaSchema.partial().parse(req.body);
        const parcela = await prisma_1.prisma.parcela.update({
            where: { id: req.params.parcelaId },
            data: {
                ...dados,
                status: dados.status,
            },
        });
        return res.json(parcela);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar parcela" });
    }
}
async function excluirParcela(req, res) {
    try {
        await prisma_1.prisma.parcela.update({
            where: { id: req.params.parcelaId },
            data: { deletadoEm: new Date(), deletadoPor: req.user?.userName || "sistema" },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir parcela" });
    }
}
//# sourceMappingURL=financeiroController.js.map