"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clienteController_1 = require("../controllers/clienteController");
const router = (0, express_1.Router)();
router.get("/", clienteController_1.listarClientes);
router.get("/:id", clienteController_1.buscarCliente);
router.post("/", clienteController_1.criarCliente);
router.put("/:id", clienteController_1.atualizarCliente);
router.delete("/:id", clienteController_1.excluirCliente);
exports.default = router;
//# sourceMappingURL=clienteRoutes.js.map