"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarTestemunhas = listarTestemunhas;
exports.buscarTestemunha = buscarTestemunha;
exports.criarTestemunha = criarTestemunha;
exports.atualizarTestemunha = atualizarTestemunha;
exports.excluirTestemunha = excluirTestemunha;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const testemunhaSchema = zod_1.z.object({
    nome: zod_1.z.string().min(2),
    cpf: zod_1.z.string().nullable().optional(),
    email: zod_1.z.string().email().nullable().optional(),
    telefone: zod_1.z.string().nullable().optional(),
    endereco: zod_1.z.string().nullable().optional(),
    profissao: zod_1.z.string().nullable().optional(),
});
async function listarTestemunhas(req, res) {
    try {
        const busca = req.query.busca;
        const testemunhas = await prisma_1.prisma.testemunha.findMany({
            where: {
                workspaceId: req.workspaceId,
                ...(busca && {
                    OR: [
                        { nome: { contains: busca, mode: "insensitive" } },
                        { cpf: { contains: busca } },
                    ],
                }),
            },
            orderBy: { nome: "asc" },
        });
        return res.json(testemunhas);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar testemunhas" });
    }
}
async function buscarTestemunha(req, res) {
    try {
        const testemunha = await prisma_1.prisma.testemunha.findFirst({
            where: { id: req.params.id, workspaceId: req.workspaceId },
            include: {
                processos: { include: { processo: { select: { id: true, numeroProcesso: true } } } },
            },
        });
        if (!testemunha)
            return res.status(404).json({ error: "Testemunha não encontrada" });
        return res.json(testemunha);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar testemunha" });
    }
}
async function criarTestemunha(req, res) {
    try {
        const dados = testemunhaSchema.parse(req.body);
        const testemunha = await prisma_1.prisma.testemunha.create({ data: { ...dados, workspaceId: req.workspaceId } });
        return res.status(201).json(testemunha);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao criar testemunha" });
    }
}
async function atualizarTestemunha(req, res) {
    try {
        const dados = testemunhaSchema.partial().parse(req.body);
        const testemunha = await prisma_1.prisma.testemunha.update({
            where: { id: req.params.id },
            data: dados,
        });
        return res.json(testemunha);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar testemunha" });
    }
}
async function excluirTestemunha(req, res) {
    try {
        await prisma_1.prisma.testemunha.update({
            where: { id: req.params.id },
            data: { deletadoEm: new Date(), deletadoPor: req.user?.userName || "sistema" },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir testemunha" });
    }
}
//# sourceMappingURL=testemunhaController.js.map