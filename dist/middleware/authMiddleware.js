"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.requireMaster = requireMaster;
exports.requireWorkspaceAdmin = requireWorkspaceAdmin;
exports.injectWorkspace = injectWorkspace;
const auth_1 = require("../lib/auth");
const prisma_1 = require("../lib/prisma");
function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não fornecido" });
    }
    try {
        const token = header.slice(7);
        const payload = (0, auth_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
}
function requireMaster(req, res, next) {
    if (!req.user?.isMaster) {
        return res.status(403).json({ error: "Acesso restrito ao administrador master" });
    }
    next();
}
function requireWorkspaceAdmin(req, res, next) {
    if (!req.user?.isAdmin && !req.user?.isMaster) {
        return res.status(403).json({ error: "Acesso restrito ao administrador do workspace" });
    }
    next();
}
async function injectWorkspace(req, res, next) {
    if (req.user?.isMaster) {
        return next();
    }
    if (!req.user?.workspaceId) {
        return res.status(401).json({ error: "Workspace não identificado" });
    }
    const workspace = await prisma_1.prisma.workspace.findUnique({
        where: { id: req.user.workspaceId },
    });
    if (!workspace || !workspace.ativo) {
        return res.status(403).json({ error: "Workspace inativo ou não encontrado" });
    }
    req.workspaceId = workspace.id;
    next();
}
//# sourceMappingURL=authMiddleware.js.map