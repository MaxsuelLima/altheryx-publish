"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aprovacaoController_1 = require("../controllers/aprovacaoController");
const router = (0, express_1.Router)();
router.get("/dashboard", aprovacaoController_1.dashboardAprovacoes);
router.get("/", aprovacaoController_1.listarAprovacoes);
router.get("/:id", aprovacaoController_1.buscarAprovacao);
router.post("/:id/aprovar", aprovacaoController_1.aprovarAlteracao);
router.post("/:id/rejeitar", aprovacaoController_1.rejeitarAlteracao);
exports.default = router;
//# sourceMappingURL=aprovacaoRoutes.js.map