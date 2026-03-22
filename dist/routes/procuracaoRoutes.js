"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const procuracaoController_1 = require("../controllers/procuracaoController");
const router = (0, express_1.Router)();
router.get("/", procuracaoController_1.listarProcuracoes);
router.get("/alertas", procuracaoController_1.alertasRenovacao);
router.get("/:id", procuracaoController_1.buscarProcuracao);
router.post("/", procuracaoController_1.criarProcuracao);
router.put("/:id", procuracaoController_1.atualizarProcuracao);
router.delete("/:id", procuracaoController_1.excluirProcuracao);
exports.default = router;
//# sourceMappingURL=procuracaoRoutes.js.map