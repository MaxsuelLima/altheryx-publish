"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarEventos = listarEventos;
exports.criarEvento = criarEvento;
exports.atualizarEvento = atualizarEvento;
exports.excluirEvento = excluirEvento;
exports.listarTribunais = listarTribunais;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const calendarioSchema = zod_1.z.object({
    tribunal: zod_1.z.string().min(2),
    descricao: zod_1.z.string().min(3),
    dataInicio: zod_1.z.string().transform((s) => new Date(s)),
    dataFim: zod_1.z.string().transform((s) => new Date(s)),
    tipo: zod_1.z.string().min(2),
});
async function listarEventos(req, res) {
    try {
        const tribunal = req.query.tribunal;
        const mes = req.query.mes;
        const ano = req.query.ano;
        let dateFilter = {};
        if (mes && ano) {
            const inicio = new Date(Number(ano), Number(mes) - 1, 1);
            const fim = new Date(Number(ano), Number(mes), 0, 23, 59, 59);
            dateFilter = {
                OR: [
                    { dataInicio: { gte: inicio, lte: fim } },
                    { dataFim: { gte: inicio, lte: fim } },
                    { AND: [{ dataInicio: { lte: inicio } }, { dataFim: { gte: fim } }] },
                ],
            };
        }
        const eventos = await prisma_1.prisma.calendarioTribunal.findMany({
            where: {
                workspaceId: req.workspaceId,
                ...(tribunal && { tribunal: { contains: tribunal, mode: "insensitive" } }),
                ...dateFilter,
            },
            orderBy: { dataInicio: "asc" },
        });
        return res.json(eventos);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar eventos" });
    }
}
async function criarEvento(req, res) {
    try {
        const dados = calendarioSchema.parse(req.body);
        const evento = await prisma_1.prisma.calendarioTribunal.create({ data: { ...dados, workspaceId: req.workspaceId } });
        return res.status(201).json(evento);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao criar evento" });
    }
}
async function atualizarEvento(req, res) {
    try {
        const dados = calendarioSchema.partial().parse(req.body);
        const evento = await prisma_1.prisma.calendarioTribunal.update({
            where: { id: req.params.id },
            data: dados,
        });
        return res.json(evento);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar evento" });
    }
}
async function excluirEvento(req, res) {
    try {
        await prisma_1.prisma.calendarioTribunal.update({
            where: { id: req.params.id },
            data: { deletadoEm: new Date(), deletadoPor: req.user?.userName || "sistema" },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir evento" });
    }
}
async function listarTribunais(req, res) {
    try {
        const tribunais = await prisma_1.prisma.calendarioTribunal.findMany({
            select: { tribunal: true },
            distinct: ["tribunal"],
            where: { workspaceId: req.workspaceId },
            orderBy: { tribunal: "asc" },
        });
        return res.json(tribunais.map((t) => t.tribunal));
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar tribunais" });
    }
}
//# sourceMappingURL=calendarioController.js.map