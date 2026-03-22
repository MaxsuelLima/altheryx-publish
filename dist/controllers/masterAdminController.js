"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarWorkspaces = listarWorkspaces;
exports.criarWorkspace = criarWorkspace;
exports.atualizarWorkspace = atualizarWorkspace;
exports.buscarWorkspace = buscarWorkspace;
exports.adicionarUsuarioWorkspace = adicionarUsuarioWorkspace;
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../lib/auth");
const zod_1 = require("zod");
const workspaceSchema = zod_1.z.object({
    slug: zod_1.z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
    nome: zod_1.z.string().min(2),
    descricao: zod_1.z.string().nullable().optional(),
});
const adminUsuarioSchema = zod_1.z.object({
    nome: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    senha: zod_1.z.string().min(6),
});
async function listarWorkspaces(_req, res) {
    try {
        const workspaces = await prisma_1.prisma.workspace.findMany({
            orderBy: { criadoEm: "desc" },
            include: {
                _count: { select: { usuarios: true } },
            },
        });
        return res.json(workspaces);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao listar workspaces" });
    }
}
async function criarWorkspace(req, res) {
    try {
        const dados = workspaceSchema.parse(req.body);
        const adminData = req.body.admin ? adminUsuarioSchema.parse(req.body.admin) : null;
        const existente = await prisma_1.prisma.workspace.findUnique({ where: { slug: dados.slug } });
        if (existente) {
            return res.status(409).json({ error: "Já existe um workspace com esse slug" });
        }
        const workspace = await prisma_1.prisma.workspace.create({
            data: {
                slug: dados.slug,
                nome: dados.nome,
                descricao: dados.descricao,
            },
        });
        let admin = null;
        if (adminData) {
            const senhaHash = await (0, auth_1.hashPassword)(adminData.senha);
            admin = await prisma_1.prisma.usuario.create({
                data: {
                    nome: adminData.nome,
                    email: adminData.email,
                    senha: senhaHash,
                    role: "ADMIN",
                    isAdmin: true,
                    workspaceId: workspace.id,
                },
                select: { id: true, nome: true, email: true, role: true },
            });
        }
        return res.status(201).json({ workspace, admin });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao criar workspace" });
    }
}
async function atualizarWorkspace(req, res) {
    try {
        const dados = workspaceSchema.partial().parse(req.body);
        const ativo = req.body.ativo;
        const workspace = await prisma_1.prisma.workspace.update({
            where: { id: req.params.id },
            data: {
                ...dados,
                ...(ativo !== undefined && { ativo }),
            },
        });
        return res.json(workspace);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ error: error.errors });
        }
        return res.status(500).json({ error: "Erro ao atualizar workspace" });
    }
}
async function buscarWorkspace(req, res) {
    try {
        const workspace = await prisma_1.prisma.workspace.findUnique({
            where: { id: req.params.id },
            include: {
                usuarios: {
                    where: { deletadoEm: null },
                    select: { id: true, nome: true, email: true, role: true, isAdmin: true, ativo: true, criadoEm: true },
                    orderBy: { criadoEm: "asc" },
                },
                _count: { select: { usuarios: true, processos: true, clientes: true } },
            },
        });
        if (!workspace) {
            return res.status(404).json({ error: "Workspace não encontrado" });
        }
        return res.json(workspace);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar workspace" });
    }
}
async function adicionarUsuarioWorkspace(req, res) {
    try {
        const dados = adminUsuarioSchema.parse(req.body);
        const role = req.body.role || "ESTAGIARIO";
        const isAdmin = req.body.isAdmin || false;
        const workspaceId = req.params.id;
        const workspace = await prisma_1.prisma.workspace.findUnique({ where: { id: workspaceId } });
        if (!workspace) {
            return res.status(404).json({ error: "Workspace não encontrado" });
        }
        const existente = await prisma_1.prisma.usuario.findFirst({
            where: { email: dados.email, workspaceId, deletadoEm: null },
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
                role,
                isAdmin,
                workspaceId,
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
//# sourceMappingURL=masterAdminController.js.map