"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarAdvogados = listarAdvogados;
exports.buscarAdvogado = buscarAdvogado;
exports.criarAdvogado = criarAdvogado;
exports.atualizarAdvogado = atualizarAdvogado;
exports.excluirAdvogado = excluirAdvogado;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const advogadoSchema = zod_1.z.object({
    nome: zod_1.z.string().min(2),
    oab: zod_1.z.string().min(4),
    email: zod_1.z.string().email().nullable().optional(),
    telefone: zod_1.z.string().nullable().optional(),
    especialidade: zod_1.z.string().nullable().optional(),
    escritorioId: zod_1.z.string().uuid().nullable().optional(),
    ativo: zod_1.z.boolean().optional(),
});
async function listarAdvogados(req, res) {
    try {
        const busca = req.query.busca;
        const advogados = await prisma_1.prisma.advogado.findMany({
            where: {
                workspaceId: req.workspaceId,
                ...(busca && {
                    OR: [
                        { nome: { contains: busca, mode: "insensitive" } },
                        { oab: { contains: busca, mode: "insensitive" } },
                    ],
                }),
            },
            include: { escritorio: { select: { id: true, nome: true } } },
            orderBy: { nome: "asc" },
        });
        return res.json(advogados);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar advogados" });
    }
}
async function buscarAdvogado(req, res) {
    try {
        const advogado = await prisma_1.prisma.advogado.findFirst({
            where: { id: req.params.id, workspaceId: req.workspaceId },
            include: {
                escritorio: true,
                processos: { select: { id: true, numeroProcesso: true, status: true } },
            },
        });
        if (!advogado)
            return res.status(404).json({ error: "Advogado não encontrado" });
        return res.json(advogado);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar advogado" });
    }
}
async function criarAdvogado(req, res) {
    try {
        const dados = advogadoSchema.parse(req.body);
        const advogado = await prisma_1.prisma.advogado.create({
            data: { ...dados, workspaceId: req.workspaceId },
            include: { escritorio: { select: { id: true, nome: true } } },
        });
        return res.status(201).json(advogado);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao criar advogado" });
    }
}
async function atualizarAdvogado(req, res) {
    try {
        const dados = advogadoSchema.partial().parse(req.body);
        const advogado = await prisma_1.prisma.advogado.update({
            where: { id: req.params.id },
            data: dados,
            include: { escritorio: { select: { id: true, nome: true } } },
        });
        return res.json(advogado);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar advogado" });
    }
}
async function excluirAdvogado(req, res) {
    try {
        await prisma_1.prisma.advogado.update({
            where: { id: req.params.id },
            data: { deletadoEm: new Date(), deletadoPor: req.user?.userName || "sistema" },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir advogado" });
    }
}
//# sourceMappingURL=advogadoController.js.map