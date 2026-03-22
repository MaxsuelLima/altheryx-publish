"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requisicaoController_1 = require("../controllers/requisicaoController");
const router = (0, express_1.Router)();
router.get("/", requisicaoController_1.listarRequisicoes);
router.get("/dashboard", requisicaoController_1.dashboardRequisicoes);
router.get("/:id", requisicaoController_1.buscarRequisicao);
router.post("/", requisicaoController_1.criarRequisicao);
router.put("/:id", requisicaoController_1.atualizarRequisicao);
router.delete("/:id", requisicaoController_1.excluirRequisicao);
exports.default = router;
//# sourceMappingURL=requisicaoRoutes.js.map