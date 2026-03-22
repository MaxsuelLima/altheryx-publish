"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarEscritorios = listarEscritorios;
exports.buscarEscritorio = buscarEscritorio;
exports.criarEscritorio = criarEscritorio;
exports.atualizarEscritorio = atualizarEscritorio;
exports.excluirEscritorio = excluirEscritorio;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const escritorioSchema = zod_1.z.object({
    nome: zod_1.z.string().min(2),
    cnpj: zod_1.z.string().min(14),
    email: zod_1.z.string().email().nullable().optional(),
    telefone: zod_1.z.string().nullable().optional(),
    endereco: zod_1.z.string().nullable().optional(),
    cidade: zod_1.z.string().nullable().optional(),
    estado: zod_1.z.string().max(2).nullable().optional(),
    cep: zod_1.z.string().nullable().optional(),
    ativo: zod_1.z.boolean().optional(),
});
async function listarEscritorios(req, res) {
    try {
        const busca = req.query.busca;
        const escritorios = await prisma_1.prisma.escritorio.findMany({
            where: {
                workspaceId: req.workspaceId,
                ...(busca && {
                    OR: [
                        { nome: { contains: busca, mode: "insensitive" } },
                        { cnpj: { contains: busca } },
                    ],
                }),
            },
            include: { _count: { select: { advogados: true } } },
            orderBy: { nome: "asc" },
        });
        return res.json(escritorios);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar escritórios" });
    }
}
async function buscarEscritorio(req, res) {
    try {
        const escritorio = await prisma_1.prisma.escritorio.findFirst({
            where: { id: req.params.id, workspaceId: req.workspaceId },
            include: { advogados: true },
        });
        if (!escritorio)
            return res.status(404).json({ error: "Escritório não encontrado" });
        return res.json(escritorio);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar escritório" });
    }
}
async function criarEscritorio(req, res) {
    try {
        const dados = escritorioSchema.parse(req.body);
        const escritorio = await prisma_1.prisma.escritorio.create({ data: { ...dados, workspaceId: req.workspaceId } });
        return res.status(201).json(escritorio);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao criar escritório" });
    }
}
async function atualizarEscritorio(req, res) {
    try {
        const dados = escritorioSchema.partial().parse(req.body);
        const escritorio = await prisma_1.prisma.escritorio.update({
            where: { id: req.params.id },
            data: dados,
        });
        return res.json(escritorio);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar escritório" });
    }
}
async function excluirEscritorio(req, res) {
    try {
        await prisma_1.prisma.escritorio.update({
            where: { id: req.params.id },
            data: { deletadoEm: new Date(), deletadoPor: req.user?.userName || "sistema" },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir escritório" });
    }
}
//# sourceMappingURL=escritorioController.js.map