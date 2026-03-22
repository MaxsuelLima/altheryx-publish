"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const financeiroController_1 = require("../controllers/financeiroController");
const insightsController_1 = require("../controllers/insightsController");
const router = (0, express_1.Router)();
router.get("/insights", insightsController_1.getInsights);
router.get("/:id", financeiroController_1.buscarFinanceiro);
router.put("/:id", financeiroController_1.atualizarFinanceiro);
router.post("/:id/parcelas", financeiroController_1.adicionarParcela);
router.put("/:id/parcelas/:parcelaId", financeiroController_1.atualizarParcela);
router.delete("/:id/parcelas/:parcelaId", financeiroController_1.excluirParcela);
exports.default = router;
//# sourceMappingURL=financeiroRoutes.js.map