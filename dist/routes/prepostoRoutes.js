"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prepostoController_1 = require("../controllers/prepostoController");
const router = (0, express_1.Router)();
router.get("/", prepostoController_1.listarPrepostos);
router.get("/:id", prepostoController_1.buscarPreposto);
router.post("/", prepostoController_1.criarPreposto);
router.put("/:id", prepostoController_1.atualizarPreposto);
router.delete("/:id", prepostoController_1.excluirPreposto);
exports.default = router;
//# sourceMappingURL=prepostoRoutes.js.map