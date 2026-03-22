"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const masterAdminController_1 = require("../controllers/masterAdminController");
const router = (0, express_1.Router)();
router.get("/workspaces", masterAdminController_1.listarWorkspaces);
router.post("/workspaces", masterAdminController_1.criarWorkspace);
router.get("/workspaces/:id", masterAdminController_1.buscarWorkspace);
router.put("/workspaces/:id", masterAdminController_1.atualizarWorkspace);
router.post("/workspaces/:id/usuarios", masterAdminController_1.adicionarUsuarioWorkspace);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map