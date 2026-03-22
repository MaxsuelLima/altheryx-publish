"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarClientes = listarClientes;
exports.buscarCliente = buscarCliente;
exports.criarCliente = criarCliente;
exports.atualizarCliente = atualizarCliente;
exports.excluirCliente = excluirCliente;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const clienteSchema = zod_1.z.object({
    nome: zod_1.z.string().min(2),
    cpfCnpj: zod_1.z.string().min(11),
    email: zod_1.z.string().email().nullable().optional(),
    telefone: zod_1.z.string().nullable().optional(),
    endereco: zod_1.z.string().nullable().optional(),
    cidade: zod_1.z.string().nullable().optional(),
    estado: zod_1.z.string().max(2).nullable().optional(),
    cep: zod_1.z.string().nullable().optional(),
    observacoes: zod_1.z.string().nullable().optional(),
    ativo: zod_1.z.boolean().optional(),
});
async function listarClientes(req, res) {
    try {
        const busca = req.query.busca;
        const ativo = req.query.ativo;
        const clientes = await prisma_1.prisma.cliente.findMany({
            where: {
                workspaceId: req.workspaceId,
                ...(busca && {
                    OR: [
                        { nome: { contains: busca, mode: "insensitive" } },
                        { cpfCnpj: { contains: busca } },
                        { email: { contains: busca, mode: "insensitive" } },
                    ],
                }),
                ...(ativo !== undefined && { ativo: ativo === "true" }),
            },
            orderBy: { nome: "asc" },
        });
        return res.json(clientes);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar clientes" });
    }
}
async function buscarCliente(req, res) {
    try {
        const cliente = await prisma_1.prisma.cliente.findFirst({
            where: { id: req.params.id, workspaceId: req.workspaceId },
            include: { partesProcesso: { include: { processo: true } } },
        });
        if (!cliente)
            return res.status(404).json({ error: "Cliente não encontrado" });
        return res.json(cliente);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar cliente" });
    }
}
async function criarCliente(req, res) {
    try {
        const dados = clienteSchema.parse(req.body);
        const cliente = await prisma_1.prisma.cliente.create({ data: { ...dados, workspaceId: req.workspaceId } });
        return res.status(201).json(cliente);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao criar cliente" });
    }
}
async function atualizarCliente(req, res) {
    try {
        const dados = clienteSchema.partial().parse(req.body);
        const cliente = await prisma_1.prisma.cliente.update({
            where: { id: req.params.id },
            data: dados,
        });
        return res.json(cliente);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar cliente" });
    }
}
async function excluirCliente(req, res) {
    try {
        await prisma_1.prisma.cliente.update({
            where: { id: req.params.id },
            data: { deletadoEm: new Date(), deletadoPor: req.user?.userName || "sistema" },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir cliente" });
    }
}
//# sourceMappingURL=clienteController.js.map