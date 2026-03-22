"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.masterLogin = masterLogin;
exports.me = me;
exports.getWorkspaceInfo = getWorkspaceInfo;
const prisma_1 = require("../lib/prisma");
const auth_1 = require("../lib/auth");
async function login(req, res) {
    try {
        const { email, senha, workspaceSlug } = req.body;
        if (!email || !senha || !workspaceSlug) {
            return res.status(400).json({ error: "Email, senha e workspace são obrigatórios" });
        }
        const workspace = await prisma_1.prisma.workspace.findUnique({
            where: { slug: workspaceSlug },
        });
        if (!workspace || !workspace.ativo) {
            return res.status(404).json({ error: "Workspace não encontrado ou inativo" });
        }
        const usuario = await prisma_1.prisma.usuario.findFirst({
            where: {
                email,
                workspaceId: workspace.id,
                deletadoEm: null,
                ativo: true,
            },
        });
        if (!usuario) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }
        const senhaValida = await (0, auth_1.comparePassword)(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }
        const token = (0, auth_1.generateToken)({
            userId: usuario.id,
            userName: usuario.nome,
            workspaceId: workspace.id,
            workspaceSlug: workspace.slug,
            role: usuario.role,
            isAdmin: usuario.isAdmin,
        });
        return res.json({
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role,
                isAdmin: usuario.isAdmin,
            },
            workspace: {
                id: workspace.id,
                slug: workspace.slug,
                nome: workspace.nome,
                descricao: workspace.descricao,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao realizar login" });
    }
}
async function masterLogin(req, res) {
    try {
        const { senha } = req.body;
        const masterPassword = process.env.MASTER_ADMIN_PASSWORD;
        if (!masterPassword) {
            return res.status(500).json({ error: "Senha master não configurada no servidor" });
        }
        if (senha !== masterPassword) {
            return res.status(401).json({ error: "Senha inválida" });
        }
        const token = (0, auth_1.generateMasterToken)();
        return res.json({ token });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao realizar login master" });
    }
}
async function me(req, res) {
    try {
        if (req.user?.isMaster) {
            return res.json({
                id: "master",
                nome: "Master Admin",
                role: "MASTER_ADMIN",
                isMaster: true,
            });
        }
        const usuario = await prisma_1.prisma.usuario.findUnique({
            where: { id: req.user.userId },
            include: { workspace: { select: { id: true, slug: true, nome: true, descricao: true } } },
        });
        if (!usuario || usuario.deletadoEm) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }
        return res.json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            role: usuario.role,
            isAdmin: usuario.isAdmin,
            workspace: usuario.workspace,
        });
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar dados do usuário" });
    }
}
async function getWorkspaceInfo(req, res) {
    try {
        const slug = req.params.slug;
        const workspace = await prisma_1.prisma.workspace.findUnique({
            where: { slug },
            select: { id: true, slug: true, nome: true, descricao: true, ativo: true },
        });
        if (!workspace || !workspace.ativo) {
            return res.status(404).json({ error: "Workspace não encontrado" });
        }
        return res.json(workspace);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao buscar workspace" });
    }
}
//# sourceMappingURL=authController.js.map