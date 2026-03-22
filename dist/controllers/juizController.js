"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarJuizes = listarJuizes;
exports.buscarJuiz = buscarJuiz;
exports.criarJuiz = criarJuiz;
exports.atualizarJuiz = atualizarJuiz;
exports.excluirJuiz = excluirJuiz;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const juizSchema = zod_1.z.object({
    nome: zod_1.z.string().min(2),
    tribunal: zod_1.z.string().nullable().optional(),
    vara: zod_1.z.string().nullable().optional(),
    email: zod_1.z.string().email().nullable().optional(),
    ativo: zod_1.z.boolean().optional(),
});
async function listarJuizes(req, res) {
    try {
        const busca = req.query.busca;
        const juizes = await prisma_1.prisma.juiz.findMany({
            where: {
                workspaceId: req.workspaceId,
                ...(busca && {
                    OR: [
                        { nome: { contains: busca, mode: "insensitive" } },
                        { tribunal: { contains: busca, mode: "insensitive" } },
                    ],
                }),
            },
            include: { _count: { select: { processos: true } } },
            orderBy: { nome: "asc" },
        });
        return res.json(juizes);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar juízes" });
    }
}
async function buscarJuiz(req, res) {
    try {
        const juiz = await prisma_1.prisma.juiz.findFirst({
            where: { id: req.params.id, workspaceId: req.workspaceId },
            include: { processos: { select: { id: true, numeroProcesso: true, status: true } } },
        });
        if (!juiz)
            return res.status(404).json({ error: "Juiz não encontrado" });
        return res.json(juiz);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar juiz" });
    }
}
async function criarJuiz(req, res) {
    try {
        const dados = juizSchema.parse(req.body);
        const juiz = await prisma_1.prisma.juiz.create({ data: { ...dados, workspaceId: req.workspaceId } });
        return res.status(201).json(juiz);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao criar juiz" });
    }
}
async function atualizarJuiz(req, res) {
    try {
        const dados = juizSchema.partial().parse(req.body);
        const juiz = await prisma_1.prisma.juiz.update({
            where: { id: req.params.id },
            data: dados,
        });
        return res.json(juiz);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar juiz" });
    }
}
async function excluirJuiz(req, res) {
    try {
        await prisma_1.prisma.juiz.update({
            where: { id: req.params.id },
            data: { deletadoEm: new Date(), deletadoPor: req.user?.userName || "sistema" },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir juiz" });
    }
}
//# sourceMappingURL=juizController.js.map