"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarProcessos = listarProcessos;
exports.buscarProcesso = buscarProcesso;
exports.criarProcesso = criarProcesso;
exports.atualizarProcesso = atualizarProcesso;
exports.excluirProcesso = excluirProcesso;
exports.adicionarMovimentacao = adicionarMovimentacao;
exports.excluirMovimentacao = excluirMovimentacao;
exports.adicionarParte = adicionarParte;
exports.removerParte = removerParte;
exports.adicionarPerito = adicionarPerito;
exports.removerPerito = removerPerito;
exports.adicionarPreposto = adicionarPreposto;
exports.removerPreposto = removerPreposto;
exports.duracaoMedia = duracaoMedia;
exports.correcaoMonetaria = correcaoMonetaria;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const auditService_1 = require("../lib/auditService");
const faseProcessual_1 = require("../lib/faseProcessual");
const processoSchema = zod_1.z.object({
    numeroProcesso: zod_1.z.string().min(5),
    status: zod_1.z.enum(["EM_ANDAMENTO", "SUSPENSO", "ARQUIVADO", "ENCERRADO", "AGUARDANDO_JULGAMENTO"]).optional(),
    tribunal: zod_1.z.string().min(2),
    competencia: zod_1.z.string().nullable().optional(),
    comarca: zod_1.z.string().nullable().optional(),
    assunto: zod_1.z.string().min(2),
    fase: zod_1.z.enum(["CONHECIMENTO", "INSTRUCAO", "JULGAMENTO", "RECURSAL", "EXECUCAO", "CUMPRIMENTO_SENTENCA", "ENCERRADO"]).nullable().optional(),
    valorCausa: zod_1.z.number().nullable().optional(),
    segredoJustica: zod_1.z.boolean().optional(),
    tutelaLiminar: zod_1.z.boolean().optional(),
    observacoes: zod_1.z.string().nullable().optional(),
    advogadoId: zod_1.z.string().uuid().nullable().optional(),
    juizId: zod_1.z.string().uuid().nullable().optional(),
});
async function listarProcessos(req, res) {
    try {
        const busca = req.query.busca;
        const status = req.query.status;
        const processos = await prisma_1.prisma.processo.findMany({
            where: {
                workspaceId: req.workspaceId,
                ...(busca && {
                    OR: [
                        { numeroProcesso: { contains: busca } },
                        { assunto: { contains: busca, mode: "insensitive" } },
                        { tribunal: { contains: busca, mode: "insensitive" } },
                        { comarca: { contains: busca, mode: "insensitive" } },
                    ],
                }),
                ...(status && { status: status }),
            },
            include: {
                advogado: { select: { id: true, nome: true, oab: true } },
                juiz: { select: { id: true, nome: true } },
                _count: { select: { partes: true, documentos: true, movimentacoes: true } },
            },
            orderBy: { criadoEm: "desc" },
        });
        return res.json(processos);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar processos" });
    }
}
async function buscarProcesso(req, res) {
    try {
        const processo = await prisma_1.prisma.processo.findFirst({
            where: { id: req.params.id, workspaceId: req.workspaceId },
            include: {
                advogado: true,
                juiz: true,
                partes: { include: { cliente: true }, orderBy: { criadoEm: "asc" } },
                testemunhas: { include: { testemunha: true } },
                peritos: { include: { perito: true } },
                prepostos: { include: { preposto: true } },
                movimentacoes: { where: { deletadoEm: null }, orderBy: { data: "desc" } },
            },
        });
        if (!processo)
            return res.status(404).json({ error: "Processo não encontrado" });
        return res.json(processo);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar processo" });
    }
}
async function criarProcesso(req, res) {
    try {
        const dados = processoSchema.parse(req.body);
        const processo = await prisma_1.prisma.processo.create({
            data: {
                ...dados,
                workspaceId: req.workspaceId,
                valorCausa: dados.valorCausa ?? undefined,
                fase: dados.fase || "CONHECIMENTO",
            },
        });
        return res.status(201).json(processo);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao criar processo" });
    }
}
async function atualizarProcesso(req, res) {
    try {
        const dados = processoSchema.partial().parse(req.body);
        const anterior = await prisma_1.prisma.processo.findFirst({ where: { id: req.params.id, workspaceId: req.workspaceId } });
        if (!anterior)
            return res.status(404).json({ error: "Processo não encontrado" });
        if (auditService_1.ENTIDADES_SENSIVEIS.includes("Processo")) {
            const aprovacao = await (0, auditService_1.criarAprovacao)({
                entidade: "Processo",
                entidadeId: req.params.id,
                dadosAtuais: anterior,
                dadosPropostos: dados,
                solicitadoPor: req.user?.userName || "sistema",
                workspaceId: req.workspaceId,
            });
            return res.status(202).json({
                message: "Alteração enviada para aprovação",
                aprovacaoId: aprovacao.id,
            });
        }
        const processo = await prisma_1.prisma.processo.update({
            where: { id: req.params.id },
            data: {
                ...dados,
                valorCausa: dados.valorCausa ?? undefined,
                fase: dados.fase,
            },
        });
        return res.json(processo);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar processo" });
    }
}
async function excluirProcesso(req, res) {
    try {
        await prisma_1.prisma.processo.update({
            where: { id: req.params.id },
            data: { deletadoEm: new Date(), deletadoPor: req.user?.userName || "sistema" },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir processo" });
    }
}
const movimentacaoSchema = zod_1.z.object({
    data: zod_1.z.string().transform((s) => new Date(s)),
    descricao: zod_1.z.string().min(3),
});
async function adicionarMovimentacao(req, res) {
    try {
        const dados = movimentacaoSchema.parse(req.body);
        const movimentacao = await prisma_1.prisma.movimentacao.create({
            data: {
                processoId: req.params.id,
                workspaceId: req.workspaceId,
                ...dados,
            },
        });
        const faseDetectada = (0, faseProcessual_1.detectarFase)(dados.descricao);
        await prisma_1.prisma.processo.update({
            where: { id: req.params.id },
            data: {
                ultimaMovimentacao: dados.data,
                ...(faseDetectada && { fase: faseDetectada }),
            },
        });
        return res.status(201).json({ ...movimentacao, faseDetectada });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao adicionar movimentação" });
    }
}
async function excluirMovimentacao(req, res) {
    try {
        await prisma_1.prisma.movimentacao.update({
            where: { id: req.params.movId },
            data: { deletadoEm: new Date(), deletadoPor: req.user?.userName || "sistema" },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir movimentação" });
    }
}
const parteSchema = zod_1.z.object({
    clienteId: zod_1.z.string().uuid(),
    tipoParte: zod_1.z.enum(["AUTOR", "REU", "TERCEIRO_INTERESSADO", "ASSISTENTE", "AMICUS_CURIAE"]),
});
async function adicionarParte(req, res) {
    try {
        const dados = parteSchema.parse(req.body);
        const parte = await prisma_1.prisma.parteProcesso.create({
            data: { processoId: req.params.id, ...dados },
            include: { cliente: true },
        });
        return res.status(201).json(parte);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao adicionar parte" });
    }
}
async function removerParte(req, res) {
    try {
        await prisma_1.prisma.parteProcesso.delete({ where: { id: req.params.parteId } });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao remover parte" });
    }
}
async function adicionarPerito(req, res) {
    try {
        const { peritoId } = zod_1.z.object({ peritoId: zod_1.z.string().uuid() }).parse(req.body);
        const vinculo = await prisma_1.prisma.processoPerito.create({
            data: { processoId: req.params.id, peritoId },
            include: { perito: true },
        });
        return res.status(201).json(vinculo);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao vincular perito" });
    }
}
async function removerPerito(req, res) {
    try {
        await prisma_1.prisma.processoPerito.delete({
            where: { processoId_peritoId: { processoId: req.params.id, peritoId: req.params.peritoId } },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao remover perito" });
    }
}
async function adicionarPreposto(req, res) {
    try {
        const { prepostoId } = zod_1.z.object({ prepostoId: zod_1.z.string().uuid() }).parse(req.body);
        const vinculo = await prisma_1.prisma.processoPreposto.create({
            data: { processoId: req.params.id, prepostoId },
            include: { preposto: true },
        });
        return res.status(201).json(vinculo);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao vincular preposto" });
    }
}
async function removerPreposto(req, res) {
    try {
        await prisma_1.prisma.processoPreposto.delete({
            where: { processoId_prepostoId: { processoId: req.params.id, prepostoId: req.params.prepostoId } },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao remover preposto" });
    }
}
async function duracaoMedia(req, res) {
    try {
        const encerrados = await prisma_1.prisma.processo.findMany({
            where: { workspaceId: req.workspaceId, status: "ENCERRADO" },
            select: { competencia: true, comarca: true, criadoEm: true, atualizadoEm: true },
        });
        const agrupado = {};
        for (const p of encerrados) {
            const dias = Math.ceil((p.atualizadoEm.getTime() - p.criadoEm.getTime()) / (1000 * 60 * 60 * 24));
            const chave = `${p.competencia || "Geral"}|${p.comarca || "Geral"}`;
            if (!agrupado[chave])
                agrupado[chave] = { total: 0, soma: 0 };
            agrupado[chave].total++;
            agrupado[chave].soma += dias;
        }
        const resultado = Object.entries(agrupado).map(([chave, val]) => {
            const [competencia, comarca] = chave.split("|");
            return {
                competencia,
                comarca,
                totalProcessos: val.total,
                duracaoMediaDias: Math.round(val.soma / val.total),
                duracaoMediaMeses: Math.round((val.soma / val.total / 30) * 10) / 10,
            };
        });
        return res.json(resultado);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao calcular duração média" });
    }
}
async function correcaoMonetaria(req, res) {
    try {
        const { valor, indice, meses } = zod_1.z.object({
            valor: zod_1.z.number().positive(),
            indice: zod_1.z.string(),
            meses: zod_1.z.number().int().positive(),
        }).parse(req.body);
        const resultado = (0, faseProcessual_1.calcularCorrecaoMonetaria)(valor, indice, meses);
        return res.json({ ...resultado, valorOriginal: valor, indice, meses, indicesDisponiveis: faseProcessual_1.INDICES_DISPONIVEIS });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao calcular correção monetária" });
    }
}
//# sourceMappingURL=processoController.js.map