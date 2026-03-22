"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prazoController_1 = require("../controllers/prazoController");
const router = (0, express_1.Router)();
router.get("/", prazoController_1.listarPrazos);
router.get("/:id", prazoController_1.buscarPrazo);
router.post("/", prazoController_1.criarPrazo);
router.put("/:id", prazoController_1.atualizarPrazo);
router.patch("/:id/status", prazoController_1.marcarStatus);
router.delete("/:id", prazoController_1.excluirPrazo);
exports.default = router;
//# sourceMappingURL=prazoRoutes.js.map