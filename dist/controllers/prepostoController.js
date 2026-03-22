"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarPrepostos = listarPrepostos;
exports.buscarPreposto = buscarPreposto;
exports.criarPreposto = criarPreposto;
exports.atualizarPreposto = atualizarPreposto;
exports.excluirPreposto = excluirPreposto;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const prepostoSchema = zod_1.z.object({
    nome: zod_1.z.string().min(2),
    cpf: zod_1.z.string().nullable().optional(),
    email: zod_1.z.string().email().nullable().optional(),
    telefone: zod_1.z.string().nullable().optional(),
    empresa: zod_1.z.string().nullable().optional(),
    cargo: zod_1.z.string().nullable().optional(),
});
async function listarPrepostos(req, res) {
    try {
        const busca = req.query.busca;
        const prepostos = await prisma_1.prisma.preposto.findMany({
            where: {
                workspaceId: req.workspaceId,
                ...(busca && {
                    OR: [
                        { nome: { contains: busca, mode: "insensitive" } },
                        { cpf: { contains: busca } },
                        { empresa: { contains: busca, mode: "insensitive" } },
                    ],
                }),
            },
            include: {
                _count: { select: { processos: true } },
            },
            orderBy: { nome: "asc" },
        });
        return res.json(prepostos);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar prepostos" });
    }
}
async function buscarPreposto(req, res) {
    try {
        const preposto = await prisma_1.prisma.preposto.findFirst({
            where: { id: req.params.id, workspaceId: req.workspaceId },
            include: {
                processos: { include: { processo: { select: { id: true, numeroProcesso: true, assunto: true } } } },
            },
        });
        if (!preposto)
            return res.status(404).json({ error: "Preposto não encontrado" });
        return res.json(preposto);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar preposto" });
    }
}
async function criarPreposto(req, res) {
    try {
        const dados = prepostoSchema.parse(req.body);
        const preposto = await prisma_1.prisma.preposto.create({ data: { ...dados, workspaceId: req.workspaceId } });
        return res.status(201).json(preposto);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao criar preposto" });
    }
}
async function atualizarPreposto(req, res) {
    try {
        const dados = prepostoSchema.partial().parse(req.body);
        const preposto = await prisma_1.prisma.preposto.update({
            where: { id: req.params.id },
            data: dados,
        });
        return res.json(preposto);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar preposto" });
    }
}
async function excluirPreposto(req, res) {
    try {
        await prisma_1.prisma.preposto.update({
            where: { id: req.params.id },
            data: { deletadoEm: new Date(), deletadoPor: req.user?.userName || "sistema" },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir preposto" });
    }
}
//# sourceMappingURL=prepostoController.js.map