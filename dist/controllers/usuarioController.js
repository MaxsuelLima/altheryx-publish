"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarUsuarios = listarUsuarios;
exports.criarUsuario = criarUsuario;
exports.atualizarUsuario = atualizarUsuario;
exports.excluirUsuario = excluirUsuario;
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../lib/auth");
const zod_1 = require("zod");
const usuarioSchema = zod_1.z.object({
    nome: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    senha: zod_1.z.string().min(6),
    role: zod_1.z.enum(["ADMIN", "ADVOGADO", "ESTAGIARIO", "SECRETARIA"]).optional(),
    isAdmin: zod_1.z.boolean().optional(),
});
async function listarUsuarios(req, res) {
    try {
        const usuarios = await prisma_1.prisma.usuario.findMany({
            where: {
                workspaceId: req.workspaceId,
            },
            select: {
                id: true,
                nome: true,
                email: true,
                role: true,
                isAdmin: true,
                ativo: true,
                criadoEm: true,
            },
            orderBy: { nome: "asc" },
        });
        return res.json(usuarios);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar usuários" });
    }
}
async function criarUsuario(req, res) {
    try {
        const dados = usuarioSchema.parse(req.body);
        const existente = await prisma_1.prisma.usuario.findFirst({
            where: { email: dados.email, workspaceId: req.workspaceId },
        });
        if (existente) {
            return res.status(409).json({ error: "Já existe um usuário com esse email neste workspace" });
        }
        const senhaHash = await (0, auth_1.hashPassword)(dados.senha);
        const usuario = await prisma_1.prisma.usuario.create({
            data: {
                nome: dados.nome,
                email: dados.email,
                senha: senhaHash,
                role: dados.role || "ESTAGIARIO",
                isAdmin: dados.isAdmin || false,
                workspaceId: req.workspaceId,
            },
            select: { id: true, nome: true, email: true, role: true, isAdmin: true },
        });
        return res.status(201).json(usuario);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao criar usuário" });
    }
}
async function atualizarUsuario(req, res) {
    try {
        const dados = usuarioSchema.partial().parse(req.body);
        const updateData = {};
        if (dados.nome)
            updateData.nome = dados.nome;
        if (dados.email)
            updateData.email = dados.email;
        if (dados.role)
            updateData.role = dados.role;
        if (dados.isAdmin !== undefined)
            updateData.isAdmin = dados.isAdmin;
        if (dados.senha)
            updateData.senha = await (0, auth_1.hashPassword)(dados.senha);
        if (req.body.ativo !== undefined)
            updateData.ativo = req.body.ativo;
        const usuario = await prisma_1.prisma.usuario.update({
            where: { id: req.params.id },
            data: updateData,
            select: { id: true, nome: true, email: true, role: true, isAdmin: true, ativo: true },
        });
        return res.json(usuario);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar usuário" });
    }
}
async function excluirUsuario(req, res) {
    try {
        const anterior = await prisma_1.prisma.usuario.findFirst({
            where: { id: req.params.id, workspaceId: req.workspaceId },
        });
        if (!anterior) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        if (anterior.id === req.user.userId) {
            return res.status(400).json({ error: "Não é possível excluir o próprio usuário" });
        }
        await prisma_1.prisma.usuario.update({
            where: { id: req.params.id },
            data: { deletadoEm: new Date(), deletadoPor: req.user.userName },
        });
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao excluir usuário" });
    }
}
//# sourceMappingURL=usuarioController.js.map