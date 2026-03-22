"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarPeritos = listarPeritos;
exports.buscarPerito = buscarPerito;
exports.criarPerito = criarPerito;
exports.atualizarPerito = atualizarPerito;
exports.excluirPerito = excluirPerito;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const peritoSchema = zod_1.z.object({
    nome: zod_1.z.string().min(2),
    cpf: zod_1.z.string().nullable().optional(),
    email: zod_1.z.string().email().nullable().optional(),
    telefone: zod_1.z.string().nullable().optional(),
    tipo: zod_1.z.enum(["PERITO", "ASSISTENTE_TECNICO"]).optional(),
    especialidade: zod_1.z.string().nullable().optional(),
    registroProfissional: zod_1.z.string().nullable().optional(),
});
async function listarPeritos(req, res) {
    try {
        const busca = req.query.busca;
        const tipo = req.query.tipo;
        const peritos = await prisma_1.prisma.perito.findMany({
            where: {
                workspaceId: req.workspaceId,
                ...(tipo && { tipo: tipo }),
                ...(busca && {
                    OR: [
                        { nome: { contains: busca, mode: "insensitive" } },
                        { cpf: { contains: busca } },
                        { especialidade: { contains: busca, mode: "insensitive" } },
                    ],
                }),
            },
            include: {
                _count: { select: { processos: true } },
            },
            orderBy: { nome: "asc" },
        });
        return res.json(peritos);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar peritos" });
    }
}
async function buscarPerito(req, res) {
    try {
        const perito = await prisma_1.prisma.perito.findFirst({
            where: { id: req.params.id, workspaceId: req.workspaceId },
            include: {
                processos: { include: { processo: { select: { id: true, numeroProcesso: true, assunto: true } } } },
            },
        });
        if (!perito)
            return res.status(404).json({ error: "Perito não encontrado" });
        return res.json(perito);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar perito" });
    }
}
async function criarPerito(req, res) {
    try {
        const dados = peritoSchema.parse(req.body);
        const perito = await prisma_1.prisma.perito.create({
            data: {
                ...dados,
                tipo: dados.tipo || "PERITO",
                workspaceId: req.workspaceId,
            },
        });
        return res.status(201).json(perito);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao criar perito" });
    }
}
async function atualizarPerito(req, res) {
    try {
        const dados = peritoSchema.partial().parse(req.body);
        const perito = await prisma_1.prisma.perito.update({
            where: { id: req.params.id },
            data: {
                ...dados,
                tipo: dados.tipo,
            },
        });
        return res.json(perito);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar perito" });
    }
}
async function excluirPerito(req, res) {
    try {
        await prisma_1.prisma.perito.update({
            where: { id: req.params.id },
            data: { deletadoEm: new Date(), deletadoPor: req.user?.userName || "sistema" },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir perito" });
    }
}
//# sourceMappingURL=peritoController.js.map