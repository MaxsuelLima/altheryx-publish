"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarPublicacoes = listarPublicacoes;
exports.criarPublicacao = criarPublicacao;
exports.atualizarPublicacao = atualizarPublicacao;
exports.marcarLida = marcarLida;
exports.excluirPublicacao = excluirPublicacao;
exports.buscarPorPalavraChave = buscarPorPalavraChave;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const publicacaoSchema = zod_1.z.object({
    processoId: zod_1.z.string().uuid().nullable().optional(),
    palavraChave: zod_1.z.string().min(2),
    diarioOrigem: zod_1.z.string().min(2),
    dataPublicacao: zod_1.z.string().transform((s) => new Date(s)),
    conteudo: zod_1.z.string().min(3),
});
async function listarPublicacoes(req, res) {
    try {
        const busca = req.query.busca;
        const lida = req.query.lida;
        const publicacoes = await prisma_1.prisma.publicacao.findMany({
            where: {
                workspaceId: req.workspaceId,
                ...(busca && {
                    OR: [
                        { palavraChave: { contains: busca, mode: "insensitive" } },
                        { conteudo: { contains: busca, mode: "insensitive" } },
                        { diarioOrigem: { contains: busca, mode: "insensitive" } },
                    ],
                }),
                ...(lida !== undefined && { lida: lida === "true" }),
            },
            include: {
                processo: { select: { id: true, numeroProcesso: true } },
            },
            orderBy: { dataPublicacao: "desc" },
        });
        return res.json(publicacoes);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar publicações" });
    }
}
async function criarPublicacao(req, res) {
    try {
        const dados = publicacaoSchema.parse(req.body);
        const publicacao = await prisma_1.prisma.publicacao.create({
            data: { ...dados, workspaceId: req.workspaceId },
            include: { processo: { select: { id: true, numeroProcesso: true } } },
        });
        return res.status(201).json(publicacao);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao criar publicação" });
    }
}
async function atualizarPublicacao(req, res) {
    try {
        const dados = publicacaoSchema.partial().parse(req.body);
        const publicacao = await prisma_1.prisma.publicacao.update({
            where: { id: req.params.id },
            data: dados,
        });
        return res.json(publicacao);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar publicação" });
    }
}
async function marcarLida(req, res) {
    try {
        const anterior = await prisma_1.prisma.publicacao.findFirst({ where: { id: req.params.id, workspaceId: req.workspaceId } });
        if (!anterior)
            return res.status(404).json({ error: "Publicação não encontrada" });
        const publicacao = await prisma_1.prisma.publicacao.update({
            where: { id: req.params.id },
            data: { lida: true },
        });
        return res.json(publicacao);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao marcar como lida" });
    }
}
async function excluirPublicacao(req, res) {
    try {
        await prisma_1.prisma.publicacao.update({
            where: { id: req.params.id },
            data: { deletadoEm: new Date(), deletadoPor: req.user?.userName || "sistema" },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir publicação" });
    }
}
async function buscarPorPalavraChave(req, res) {
    try {
        const palavra = req.query.palavra;
        if (!palavra || palavra.length < 2) {
            return res.status(400).json({ error: "Palavra-chave deve ter ao menos 2 caracteres" });
        }
        const resultados = await prisma_1.prisma.publicacao.findMany({
            where: {
                workspaceId: req.workspaceId,
                OR: [
                    { palavraChave: { contains: palavra, mode: "insensitive" } },
                    { conteudo: { contains: palavra, mode: "insensitive" } },
                ],
            },
            include: {
                processo: { select: { id: true, numeroProcesso: true } },
            },
            orderBy: { dataPublicacao: "desc" },
            take: 50,
        });
        return res.json(resultados);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro na busca" });
    }
}
//# sourceMappingURL=publicacaoController.js.map