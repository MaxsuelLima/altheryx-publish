"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioController_1 = require("../controllers/usuarioController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.requireWorkspaceAdmin, usuarioController_1.listarUsuarios);
router.post("/", authMiddleware_1.requireWorkspaceAdmin, usuarioController_1.criarUsuario);
router.put("/:id", authMiddleware_1.requireWorkspaceAdmin, usuarioController_1.atualizarUsuario);
router.delete("/:id", authMiddleware_1.requireWorkspaceAdmin, usuarioController_1.excluirUsuario);
exports.default = router;
//# sourceMappingURL=usuarioRoutes.js.map