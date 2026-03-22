"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditoriaController_1 = require("../controllers/auditoriaController");
const router = (0, express_1.Router)();
router.get("/", auditoriaController_1.listarAuditorias);
router.get("/:id", auditoriaController_1.buscarAuditoria);
router.get("/:entidade/:entidadeId", auditoriaController_1.historicoEntidade);
exports.default = router;
//# sourceMappingURL=auditoriaRoutes.js.map