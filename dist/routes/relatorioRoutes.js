"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const relatorioController_1 = require("../controllers/relatorioController");
const router = (0, express_1.Router)();
router.get("/filtros", relatorioController_1.relatorioFiltros);
router.get("/processos", relatorioController_1.relatorioProcessos);
router.get("/clientes", relatorioController_1.relatorioClientes);
router.get("/financeiro", relatorioController_1.relatorioFinanceiro);
router.get("/prazos", relatorioController_1.relatorioPrazos);
router.get("/procuracoes", relatorioController_1.relatorioProcuracoes);
router.get("/requisicoes", relatorioController_1.relatorioRequisicoes);
exports.default = router;
//# sourceMappingURL=relatorioRoutes.js.map